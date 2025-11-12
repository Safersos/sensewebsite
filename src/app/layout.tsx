import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteDock } from "@/components/navigation/site-dock";
import { SiteMobileDock } from "@/components/navigation/site-mobile-dock";
import { NeuralCursor } from "@/components/ui/neural-cursor";
import { PageTransition } from "@/components/ui/page-transition";
import { SplashScreen } from "@/components/ui/splash-screen";
import { DisableContextMenu } from "@/components/ui/disable-context-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Sense",
    template: "%s | Sense",
  },
  description: "Sense — a new frontier for motion-led product design.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sense",
  },
};

export const viewport: Viewport = {
  themeColor: "#04020D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        <DisableContextMenu />
        <SplashScreen />
        <NeuralCursor />
        <SiteMobileDock />
        <div className="hidden md:block">
          <SiteDock />
        </div>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
