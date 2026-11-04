import { PrismaPg } from "@prisma/adapter-pg";

/** @param {string | undefined} connectionString */
export function databaseOptions(connectionString) {
  if (!connectionString) throw new Error("Configureaza DATABASE_URL in .env.");
  let url;
  try {
    url = new URL(connectionString);
  } catch {
    throw new Error("Configureaza DATABASE_URL in .env.");
  }
  if (["postgres:", "postgresql:"].includes(url.protocol) && url.hostname) {
    return { adapter: new PrismaPg({ connectionString }) };
  }
  if (["prisma:", "prisma+postgres:"].includes(url.protocol) && url.hostname) {
    return { accelerateUrl: connectionString };
  }
  throw new Error("DATABASE_URL trebuie sa fie o conexiune PostgreSQL sau Prisma Accelerate.");
}
