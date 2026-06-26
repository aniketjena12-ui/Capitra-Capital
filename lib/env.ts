/**
 * lib/env.ts
 * Validates all required environment variables at startup.
 * Import this at the top of any server-side module that needs these values.
 * Throws a clear error at build/start time instead of failing silently with placeholders.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    throw new Error(
      `[Capitra] Missing required environment variable: "${key}". ` +
        `Please add it to your .env file and to Vercel environment settings.`
    );
  }
  return value;
}

export const env = {
  // Database
  DATABASE_URL: requireEnv("DATABASE_URL"),

  // NextAuth
  NEXTAUTH_SECRET: requireEnv("NEXTAUTH_SECRET"),

  // Razorpay (server-side secret keys — never exposed to client)
  RAZORPAY_KEY_ID: requireEnv("RAZORPAY_KEY_ID"),
  RAZORPAY_KEY_SECRET: requireEnv("RAZORPAY_KEY_SECRET"),
} as const;
