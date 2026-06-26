/**
 * Email notification utility using Nodemailer.
 * Requires SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM in .env
 *
 * For free testing, use Resend (resend.com) or Mailtrap (mailtrap.io).
 * Example Resend SMTP config:
 *   SMTP_HOST=smtp.resend.com
 *   SMTP_PORT=587
 *   SMTP_USER=resend
 *   SMTP_PASS=re_your_api_key_here
 *   SMTP_FROM=noreply@capitracapital.com
 */

import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("[Email] SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env");
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  const t = getTransporter();
  if (!t) {
    console.log(`[Email Skipped] To: ${to} | Subject: ${subject}`);
    return false;
  }

  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || "Capitra Capital <noreply@capitracapital.com>",
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("[Email Error]", err);
    return false;
  }
}

// ─── Pre-built email templates ────────────────────────────────────────────────

export function emailWelcome(name: string) {
  return {
    subject: "Welcome to Capitra Capital 🎯",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#060810;color:#f0f4ff;padding:2rem;border-radius:12px">
        <h2 style="color:#3b82f6;margin-bottom:0.5rem">Welcome, ${name}! 🚀</h2>
        <p style="color:#9ba8c0">Your Capitra Capital account is ready. Explore challenges, prove your edge, and get funded.</p>
        <a href="https://capitracapital.com/challenges" style="display:inline-block;margin-top:1.5rem;padding:0.75rem 1.5rem;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
          Browse Challenges →
        </a>
        <p style="margin-top:2rem;font-size:0.75rem;color:#5a6580">Capitra Capital — Built for disciplined traders.</p>
      </div>`,
  };
}

export function emailPayoutApproved(name: string, amount: number) {
  return {
    subject: `Payout of ₹${amount.toLocaleString("en-IN")} Approved ✅`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#060810;color:#f0f4ff;padding:2rem;border-radius:12px">
        <h2 style="color:#22c55e">Payout Approved! 💸</h2>
        <p style="color:#9ba8c0">Hi ${name},</p>
        <p style="color:#9ba8c0">Your payout of <strong style="color:#f0f4ff">₹${amount.toLocaleString("en-IN")}</strong> has been approved and is being processed to your registered bank account.</p>
        <p style="color:#9ba8c0">Processing typically takes 1–3 business days.</p>
        <p style="margin-top:2rem;font-size:0.75rem;color:#5a6580">Capitra Capital — Built for disciplined traders.</p>
      </div>`,
  };
}

export function emailPayoutRejected(name: string, reason?: string) {
  return {
    subject: "Payout Request — Action Required",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#060810;color:#f0f4ff;padding:2rem;border-radius:12px">
        <h2 style="color:#ef4444">Payout Request Not Approved</h2>
        <p style="color:#9ba8c0">Hi ${name},</p>
        <p style="color:#9ba8c0">Your recent payout request could not be processed at this time.</p>
        ${reason ? `<p style="color:#fca5a5"><strong>Reason:</strong> ${reason}</p>` : ""}
        <p style="color:#9ba8c0">Please contact support if you believe this is an error.</p>
        <a href="https://capitracapital.com/contact" style="display:inline-block;margin-top:1.5rem;padding:0.75rem 1.5rem;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
          Contact Support →
        </a>
        <p style="margin-top:2rem;font-size:0.75rem;color:#5a6580">Capitra Capital — Built for disciplined traders.</p>
      </div>`,
  };
}

export function emailKycVerified(name: string) {
  return {
    subject: "KYC Verified — You Can Now Request Payouts ✅",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#060810;color:#f0f4ff;padding:2rem;border-radius:12px">
        <h2 style="color:#22c55e">Identity Verified! 🎉</h2>
        <p style="color:#9ba8c0">Hi ${name},</p>
        <p style="color:#9ba8c0">Your KYC verification is complete. You are now fully eligible to request profit payouts from your dashboard.</p>
        <a href="https://capitracapital.com/dashboard/payouts" style="display:inline-block;margin-top:1.5rem;padding:0.75rem 1.5rem;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
          Request Payout →
        </a>
        <p style="margin-top:2rem;font-size:0.75rem;color:#5a6580">Capitra Capital — Built for disciplined traders.</p>
      </div>`,
  };
}

export function emailEvaluationPassed(name: string, planName: string) {
  return {
    subject: "🏆 Evaluation Passed — Funded Account Incoming!",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#060810;color:#f0f4ff;padding:2rem;border-radius:12px">
        <h2 style="color:#22c55e">Congratulations, ${name}! 🏆</h2>
        <p style="color:#9ba8c0">You have successfully passed the <strong style="color:#f0f4ff">${planName}</strong> evaluation challenge!</p>
        <p style="color:#9ba8c0">Your funded account credentials are being prepared and will be sent to you shortly. Keep up the great trading!</p>
        <a href="https://capitracapital.com/dashboard" style="display:inline-block;margin-top:1.5rem;padding:0.75rem 1.5rem;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
          View Dashboard →
        </a>
        <p style="margin-top:2rem;font-size:0.75rem;color:#5a6580">Capitra Capital — Built for disciplined traders.</p>
      </div>`,
  };
}

export function emailDrawdownWarning(name: string, type: "daily" | "overall", pct: number) {
  return {
    subject: `⚠️ Drawdown Warning — ${pct.toFixed(1)}% ${type === "daily" ? "Daily" : "Overall"} Loss`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#060810;color:#f0f4ff;padding:2rem;border-radius:12px">
        <h2 style="color:#eab308">Drawdown Warning ⚠️</h2>
        <p style="color:#9ba8c0">Hi ${name},</p>
        <p style="color:#9ba8c0">Your ${type === "daily" ? "daily" : "overall"} loss has reached <strong style="color:#fbbf24">${pct.toFixed(1)}%</strong> of the allowed limit.</p>
        <p style="color:#9ba8c0">Please trade carefully. Breaching the ${type === "daily" ? "4%" : "8%"} limit will result in your evaluation being terminated.</p>
        <a href="https://capitracapital.com/dashboard" style="display:inline-block;margin-top:1.5rem;padding:0.75rem 1.5rem;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
          Check Dashboard →
        </a>
        <p style="margin-top:2rem;font-size:0.75rem;color:#5a6580">Capitra Capital — Built for disciplined traders.</p>
      </div>`,
  };
}
