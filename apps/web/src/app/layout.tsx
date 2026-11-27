import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { AppShell } from "@/components/layout/app-shell";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { InlineScript } from "@/components/shared/inline-script";
import { Toaster } from "@/components/ui/sonner";
import { themeInitScript } from "@/lib/theme-script";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const description =
  "Send one prompt to several models, watch them stream side by side, and let a judge pick the winner.";

export const metadata: Metadata = {
  applicationName: "LLM Arena",
  title: {
    default: "LLM Arena",
    template: "%s · LLM Arena",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "LLM Arena",
    title: "LLM Arena — compare models side by side",
    description,
  },
  twitter: {
    card: "summary",
    title: "LLM Arena",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        <InlineScript html={themeInitScript} />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <TooltipProvider delayDuration={150}>
            <AppShell>{children}</AppShell>
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
