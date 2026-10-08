import type { Metadata, Viewport } from "next";
import { Anek_Bangla } from "next/font/google";
// import { Analytics } from "@vercel/analytics/next";

import { PageTransition } from "@/components/providers/page-transition";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { AppProviders } from "../components/providers/app-providers";

const anek = Anek_Bangla({
  subsets: ["latin", "bengali"],
  axes: ["wdth"],
  variable: "--font-anek",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NEEL — Menswear, made in Bangladesh",
    template: "%s · NEEL",
  },
  description:
    "Shirts and pants cut for Bangladeshi weather. Cash on delivery across Bangladesh, next-day delivery inside Dhaka, and easy size exchanges.",
  generator: "v0.app",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f9" },
    { media: "(prefers-color-scheme: dark)", color: "#12151f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${anek.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <TooltipProvider>
          <AppProviders>
            <PageTransition>{children}</PageTransition>
          </AppProviders>
        </TooltipProvider>
        {/* {process.env.NODE_ENV === "production" && <Analytics />} */}
      </body>
    </html>
  );
}