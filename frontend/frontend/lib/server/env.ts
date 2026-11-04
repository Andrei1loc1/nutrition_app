/**
 * Server-side environment helpers.
 * Safe to use only in server contexts (API routes, server components, Prisma).
 */

export const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
