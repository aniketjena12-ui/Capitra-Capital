/**
 * lib/env.ts
 * Validates environment variables at startup.
 *
 * - requireEnv(): throws at build/start time if a variable is missing.
 *   Use for variables that are unconditionally needed (DB, auth secret).
 *
 * - optionalEnv(): returns the value or undefined.
 *   Use for variables that gate optional features (payment keys, SMTP).
 *   The feature itself should check for undefined and degrade gracefully.
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

function optionalEnv(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim() !== "" ? value : undefined;
}

export const env = {
  // ── Required — app will not start without these ──────────────────────────
  DATABASE_URL:     requireEnv("DATABASE_URL"),
  NEXTAUTH_SECRET:  requireEnv("NEXTAUTH_SECRET"),

  // ── Optional — features degrade gracefully when absent ───────────────────

  // Razorpay — payment routes return 503 if these are not set
  RAZORPAY_KEY_ID:     optionalEnv("RAZORPAY_KEY_ID"),
  RAZORPAY_KEY_SECRET: optionalEnv("RAZORPAY_KEY_SECRET"),

  // SMTP — emails are skipped (logged to console) if not configured
  SMTP_HOST: optionalEnv("SMTP_HOST"),
  SMTP_PORT: optionalEnv("SMTP_PORT"),
  SMTP_USER: optionalEnv("SMTP_USER"),
  SMTP_PASS: optionalEnv("SMTP_PASS"),
  SMTP_FROM: optionalEnv("SMTP_FROM"),
} as const;
