import { PrismaClient, type Prisma } from "@prisma/client";
import { databaseOptions } from "./options.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient<Prisma.PrismaClientOptions>({
    ...databaseOptions(process.env.DATABASE_URL),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
