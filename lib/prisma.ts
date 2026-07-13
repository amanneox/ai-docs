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

  // The managed database (e.g. on Vercel) terminates TLS with a self-signed
  // certificate in its chain, which node-postgres rejects by default (P1011).
  // Enable TLS for remote hosts while accepting that cert; if a CA cert is
  // supplied via DATABASE_CA_CERT we verify against it instead. Local Postgres
  // (localhost) usually has no TLS, so leave SSL off there.
  const host = new URL(connectionString).hostname
  const isLocal = host === "localhost" || host === "127.0.0.1"
  const ca = process.env.DATABASE_CA_CERT

  const adapter = new PrismaPg({
    connectionString,
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
