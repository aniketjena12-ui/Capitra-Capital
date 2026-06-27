import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent the site from being embedded in iframes (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },

  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Control referrer information sent with requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Disable browser features not needed by this app
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },

  // Force HTTPS for 1 year (only active on HTTPS deployments like Vercel)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },

  // Content Security Policy
  // - default-src: only allow resources from same origin
  // - script-src: allow same origin + Razorpay CDN (needed for checkout modal)
  // - connect-src: allow API calls to same origin + Razorpay
  // - frame-src: allow Razorpay iframe for checkout
  // - img-src: allow same origin + data URIs
  // - style-src: allow same origin + unsafe-inline (required by Next.js/CSS modules)
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://s3.tradingview.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://*.tradingview.com wss://*.tradingview.com",
      "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://s3.tradingview.com https://*.tradingview.com",
      "img-src 'self' data: blob: https://cdn.razorpay.com https://s3.tradingview.com https://*.tradingview.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
