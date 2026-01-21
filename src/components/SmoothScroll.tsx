"use client";

import { useEffect, useRef, ReactNode } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const ease = 0.08; // Lower = smoother/slower, Higher = faster response
    const threshold = 0.5; // Stop animating when difference is small

    const smoothScroll = () => {
      const diff = targetScrollRef.current - currentScrollRef.current;
      
      if (Math.abs(diff) > threshold) {
        currentScrollRef.current += diff * ease;
        window.scrollTo(0, currentScrollRef.current);
        rafRef.current = requestAnimationFrame(smoothScroll);
      } else {
        currentScrollRef.current = targetScrollRef.current;
        isScrollingRef.current = false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollRef.current = Math.max(0, Math.min(maxScroll, targetScrollRef.current + e.deltaY));
      
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        currentScrollRef.current = window.scrollY;
        rafRef.current = requestAnimationFrame(smoothScroll);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollAmount = 100;
      let delta = 0;

      switch (e.key) {
        case "ArrowDown":
          delta = scrollAmount;
          break;
        case "ArrowUp":
          delta = -scrollAmount;
          break;
        case "PageDown":
          delta = window.innerHeight;
          break;
        case "PageUp":
          delta = -window.innerHeight;
          break;
        case "Home":
          targetScrollRef.current = 0;
          if (!isScrollingRef.current) {
            isScrollingRef.current = true;
            currentScrollRef.current = window.scrollY;
            rafRef.current = requestAnimationFrame(smoothScroll);
          }
          return;
        case "End":
          targetScrollRef.current = document.documentElement.scrollHeight - window.innerHeight;
          if (!isScrollingRef.current) {
            isScrollingRef.current = true;
            currentScrollRef.current = window.scrollY;
            rafRef.current = requestAnimationFrame(smoothScroll);
          }
          return;
        default:
          return;
      }

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollRef.current = Math.max(0, Math.min(maxScroll, targetScrollRef.current + delta));

      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        currentScrollRef.current = window.scrollY;
        rafRef.current = requestAnimationFrame(smoothScroll);
      }
    };

    // Initialize target to current scroll position
    targetScrollRef.current = window.scrollY;
    currentScrollRef.current = window.scrollY;

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return <>{children}</>;
}
