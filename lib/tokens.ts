/**
 * lib/tokens.ts
 * Cryptographically secure token generation and expiry helpers.
 * Used for email verification and password reset flows.
 */

import crypto from "crypto";

/**
 * Generates a URL-safe random token (hex, 32 bytes = 64 chars).
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Returns a Date `minutes` minutes from now.
 */
export function expiresInMinutes(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

/**
 * Returns true if the given expiry date is in the past.
 */
export function isExpired(expiry: Date | null | undefined): boolean {
  if (!expiry) return true;
  return new Date() > expiry;
}
