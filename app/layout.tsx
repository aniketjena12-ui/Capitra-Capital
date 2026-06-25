import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "Capitra Capital – Funded Trader Program",
    template: "%s | Capitra Capital",
  },
  description:
    "Capitra Capital empowers traders to prove their edge, pass evaluations, and unlock funded opportunities.",
  keywords: ["prop trading", "funded trader", "trading challenge", "India", "profit split"],
  openGraph: {
    title: "Capitra Capital – Funded Trader Program",
    description: "Pass the evaluation. Trade with real capital. Keep 80% of profits.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <div style={{ flex: 1 }}>{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}