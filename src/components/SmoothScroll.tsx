"use client";

import { useEffect, ReactNode } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let rafId: number;
    let isScrolling = false;
    let isUserScrolling = false;

    const ease = 0.12;

    const smoothScroll = () => {
      const diff = targetY - currentY;
      
      if (Math.abs(diff) > 0.5) {
        currentY += diff * ease;
        isUserScrolling = true;
        window.scrollTo(0, currentY);
        isUserScrolling = false;
        rafId = requestAnimationFrame(smoothScroll);
      } else {
        currentY = targetY;
        isScrolling = false;
      }
    };

    const updateTarget = (delta: number) => {
      targetY += delta;
      targetY = Math.max(0, Math.min(targetY, document.body.scrollHeight - window.innerHeight));
      
      if (!isScrolling) {
        isScrolling = true;
        rafId = requestAnimationFrame(smoothScroll);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      updateTarget(e.deltaY);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyDeltas: Record<string, number> = {
        ArrowDown: 100,
        ArrowUp: -100,
        PageDown: window.innerHeight * 0.8,
        PageUp: -window.innerHeight * 0.8,
        Space: window.innerHeight * 0.8,
        Home: -targetY,
        End: document.body.scrollHeight - window.innerHeight - targetY,
      };

      const delta = keyDeltas[e.key];
      if (delta !== undefined) {
        e.preventDefault();
        updateTarget(delta);
      }
    };

    const handleScroll = () => {
      if (!isUserScrolling) {
        targetY = window.scrollY;
        currentY = window.scrollY;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{children}</>;
}
