import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is required")
  }

  // Aiven Postgres terminates TLS with a self-signed certificate in its chain,
  // which node-postgres rejects by default (P1011). We enable TLS for remote
  // hosts while accepting that cert (or verifying against DATABASE_CA_CERT if
  // provided). Local Postgres (localhost) usually has no TLS, so leave SSL off.
  //
  // Note: node-postgres merges connection-string params OVER the config object,
  // so a `sslmode=require` in the URL would clobber the `ssl` option below and
  // re-enable strict verification. Strip it so our explicit ssl config wins.
  const url = new URL(connectionString)
  url.searchParams.delete("sslmode")
  url.searchParams.delete("ssl")

  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1"
  const ca = process.env.DATABASE_CA_CERT

  const adapter = new PrismaPg({
    connectionString: url.toString(),
    ...(isLocal
      ? {}
      : { ssl: ca ? { ca } : { rejectUnauthorized: false } }),
  })
  return new PrismaClient({ adapter })
}

// Lazily instantiate the client on first property access. This keeps
// `next build` (which imports every route module to collect page data)
// from evaluating DATABASE_URL — the DB is only needed at request time.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client =
      globalForPrisma.prisma ?? (globalForPrisma.prisma = createClient())
    const value: unknown = Reflect.get(client, prop, receiver)
    return typeof value === "function" ? value.bind(client) : value
  },
})
