import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function initPrisma(): PrismaClient {
  // On Vercel, copy the SQLite DB to /tmp (writable filesystem)
  if (process.env.VERCEL && !process.env.DATABASE_URL?.includes('/tmp/')) {
    const srcDb = path.join(process.cwd(), 'prisma', 'dev.db')
    const tmpDb = '/tmp/dev.db'

    if (!fs.existsSync(tmpDb) && fs.existsSync(srcDb)) {
      fs.copyFileSync(srcDb, tmpDb)
    }

    process.env.DATABASE_URL = `file:${tmpDb}`
  }

  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? initPrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
