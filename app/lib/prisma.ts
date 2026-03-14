import { PrismaClient } from "@prisma/client";
import { postgres } from "@prisma/adapter-postgres";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    adapter: postgres({url: process.env.DATABASE_URL}),
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export { prisma };
