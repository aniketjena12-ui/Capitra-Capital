/** Single source of truth for admin identity. Can be overridden via env var. */
export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "admin@capitracapital.com";
