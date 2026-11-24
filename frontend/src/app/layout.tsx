import type { Metadata } from "next";
import {
  DM_Sans,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";

import { AppShell } from "@/components/AppShell";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Viralytiq",
  description:
    "AI-powered Personal Content Strategist for LinkedIn creators",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${plusJakarta.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body
        className="
          antialiased
          font-sans
          text-slate-100
          bg-[#050816]
          overflow-x-hidden
        "
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}