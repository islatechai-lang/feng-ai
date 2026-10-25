import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FengShui AI — Classical Room Analyzer & Spatial Chi Engine",
  description:
    "Upload your room photo, align your door compass direction, and receive your Feng Shui score, #1 issue fix, and an AI-rearranged layout in true Command Position.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FengShui AI",
  },
};

export const viewport: Viewport = {
  themeColor: "#020f0d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#020e0c] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
        {children}
      </body>
    </html>
  );
}
