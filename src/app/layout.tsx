import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AnimatedBackground from "../components/AnimatedBackground";
import CursorGlow from "../components/CursorGlow";
import Navbar from "../components/Navbar";
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
  title: "COREX Store | Futuristic PC Components",
  description:
    "A curated, design-forward concept store for performance PC components with a dark, neon aesthetic and a focus on clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AnimatedBackground />
        <CursorGlow />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
