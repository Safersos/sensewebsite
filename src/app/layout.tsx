import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteDock } from "@/components/navigation/site-dock";
import { NeuralCursor } from "@/components/ui/neural-cursor";
import { PageTransition } from "@/components/ui/page-transition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home | Sense",
  description: "Sense — a new frontier for motion-led product design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NeuralCursor />
        <SiteDock />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
