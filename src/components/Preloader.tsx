"use client";

import { useEffect, useState } from "react";
import styles from "./Preloader.module.css";

const IMAGES = [
  "/vecteezy_modern-gaming-pc-isolated-on-transparent_48412735.png",
  "/vecteezy_modern-gaming-pc-isolated-on-transparent_48412770.png",
  "/vecteezy_modern-gaming-pc-isolated-on-transparent_48412788.png",
  "/step1.png",
  "/step2.png",
  "/step3.png",
  "/ChatGPT Image 31 janv. 2026, 12_31_52.png",
  "/ChatGPT Image 31 janv. 2026, 12_31_58.png",
  "/ChatGPT Image 31 janv. 2026, 12_32_04.png",
  "/ChatGPT Image 31 janv. 2026, 12_32_09.png",
  "/ChatGPT Image 31 janv. 2026, 12_32_13.png",
  "/corex_inside.png",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
];

const COOKIE_KEY = "corex_assets_v1";
const COOKIE_DAYS = 7;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Already visited — skip preloader (images are in browser cache)
    if (getCookie(COOKIE_KEY)) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";

    let loaded = 0;
    const total = IMAGES.length;

    const onLoad = () => {
      loaded++;
      setProgress(Math.round((loaded / total) * 100));

      if (loaded === total) {
        setCookie(COOKIE_KEY, "1", COOKIE_DAYS);
        // Small pause at 100% for visual satisfaction
        setTimeout(() => {
          setExiting(true);
          document.body.style.overflow = "";
          // Remove from DOM after fade-out animation
          setTimeout(() => setVisible(false), 900);
        }, 400);
      }
    };

    IMAGES.forEach((src) => {
      const img = new window.Image();
      img.onload = onLoad;
      img.onerror = onLoad; // count errors as loaded
      img.src = src;
    });

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`${styles.overlay} ${exiting ? styles.exiting : ""}`}>
      <div className={styles.content}>
        <div className={styles.logo}>COREX</div>
        <div className={styles.tagline}>Custom Gaming PCs</div>

        <div className={styles.progressWrapper}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.percent}>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
