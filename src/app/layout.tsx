import type { Metadata } from "next";
import { Geist, Geist_Mono, Special_Elite, Bebas_Neue } from "next/font/google";
import localFont from "next/font/local";
import AnimatedBackground from "../components/AnimatedBackground";
import CursorGlow from "../components/CursorGlow";
import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";
import SmoothScroll from "../components/SmoothScroll";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const specialElite = Special_Elite({
  variable: "--font-typewriter",
  weight: "400",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const playPretend = localFont({
  src: "../fonts/PlayPretend.otf",
  variable: "--font-play-pretend",
  display: "swap",
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
      <body className={`${geistSans.variable} ${geistMono.variable} ${specialElite.variable} ${bebasNeue.variable} ${playPretend.variable}`}>
        <Preloader />
        <AnimatedBackground />
        <CursorGlow />
        <Navbar />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
