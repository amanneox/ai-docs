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

  const adapter = new PrismaPg({ connectionString })
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
