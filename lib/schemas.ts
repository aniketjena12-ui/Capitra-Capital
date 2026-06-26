/**
 * lib/schemas.ts
 * Centralised Zod validation schemas for all API routes.
 * Compatible with Zod v4 (z.enum uses `error` not `errorMap`,
 * z.number uses `error` not `invalid_type_error`).
 */

import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(80),
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
});

// ─── KYC ──────────────────────────────────────────────────────────────────────

export const kycDocTypes = ["AADHAAR", "PAN", "PASSPORT", "VOTER_ID", "DRIVING_LICENSE"] as const;

export const kycSubmitSchema = z.object({
  kycIdUrl: z.string().min(1, "Government ID is required."),
  kycSelfieUrl: z.string().min(1, "Selfie is required."),
  // Zod v4: use z.enum with just the tuple and a custom `error` string
  kycDocType: z
    .string()
    .refine((v): v is (typeof kycDocTypes)[number] => (kycDocTypes as readonly string[]).includes(v), {
      message: "Select a valid document type.",
    }),
});

// ─── Trades ───────────────────────────────────────────────────────────────────

export const tradeCreateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD."),
  symbol: z.string().min(1, "Symbol is required.").max(30),
  direction: z
    .string()
    .refine((v): v is "BUY" | "SELL" => v === "BUY" || v === "SELL", {
      message: "Direction must be BUY or SELL.",
    }),
  entry: z.string().min(1, "Entry price is required."),
  exit: z.string().min(1, "Exit price is required."),
  pnl: z.string().min(1, "P&L is required."),
  notes: z.string().max(500).optional(),
});

// ─── Payouts ──────────────────────────────────────────────────────────────────

export const payoutRequestSchema = z.object({
  amount: z
    .number({ error: "Amount must be a number." })
    .min(1000, "Minimum payout is ₹1,000."),
  method: z
    .string()
    .refine((v): v is "NEFT" | "IMPS" | "UPI" => ["NEFT", "IMPS", "UPI"].includes(v), {
      message: "Transfer method must be NEFT, IMPS, or UPI.",
    }),
});

// ─── Settings ─────────────────────────────────────────────────────────────────

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(80),
  phone: z.string().max(20).optional(),
});

export const bankUpdateSchema = z.object({
  accountName: z.string().min(2, "Account name is required.").max(100),
  accountNo: z.string().min(5, "Account number is required.").max(30),
  ifsc: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid IFSC code (e.g. HDFC0001234)."),
  bankName: z.string().min(2, "Bank name is required.").max(100),
});

export const notifsUpdateSchema = z.object({
  emailNotif: z.boolean(),
  drawdownNotif: z.boolean(),
  payoutNotif: z.boolean(),
  newsNotif: z.boolean(),
});

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminKycActionSchema = z.object({
  userId: z.string().uuid("Invalid user ID."),
  action: z.string().refine((v): v is "APPROVE" | "REJECT" => v === "APPROVE" || v === "REJECT", {
    message: "Action must be APPROVE or REJECT.",
  }),
  notes: z.string().max(500).optional(),
});

export const adminPayoutActionSchema = z.object({
  payoutId: z.string().uuid("Invalid payout ID."),
  action: z.string().refine((v): v is "APPROVE" | "REJECT" => v === "APPROVE" || v === "REJECT", {
    message: "Action must be APPROVE or REJECT.",
  }),
});
