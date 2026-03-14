import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
    engine: "client",
    adapter: "postgresql",
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export { prisma };
