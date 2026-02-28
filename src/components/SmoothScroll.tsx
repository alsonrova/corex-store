"use client";

import { useEffect, useRef, ReactNode } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const targetScrollRef  = useRef(0);
  const currentScrollRef = useRef(0);
  const rafRef           = useRef<number | null>(null);
  const isScrollingRef   = useRef(false);
  // Flag: true while our own window.scrollTo() is responsible for the next scroll event
  const internalScrollRef = useRef(false);

  useEffect(() => {
    const ease      = 0.08;
    const threshold = 0.5;

    const smoothScroll = () => {
      const diff = targetScrollRef.current - currentScrollRef.current;

      if (Math.abs(diff) > threshold) {
        currentScrollRef.current += diff * ease;
        // Mark this scroll as ours so handleScroll ignores it
        internalScrollRef.current = true;
        window.scrollTo(0, currentScrollRef.current);
        rafRef.current = requestAnimationFrame(smoothScroll);
      } else {
        currentScrollRef.current = targetScrollRef.current;
        isScrollingRef.current   = false;
      }
    };

    // ── Scrollbar (or any external scroll source) ──────────────────────────
    // When the browser scrolls on its own (scrollbar drag, touch, etc.)
    // we resync both refs so the next wheel/key event starts from the right place.
    const handleScroll = () => {
      if (internalScrollRef.current) {
        // Scroll was triggered by our window.scrollTo() — ignore it
        internalScrollRef.current = false;
        return;
      }
      // External scroll: resync refs to real position and kill the RAF
      const pos = window.scrollY;
      targetScrollRef.current  = pos;
      currentScrollRef.current = pos;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      isScrollingRef.current = false;
    };

    // ── Mouse wheel ────────────────────────────────────────────────────────
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollRef.current = Math.max(0, Math.min(maxScroll, targetScrollRef.current + e.deltaY));

      if (!isScrollingRef.current) {
        isScrollingRef.current   = true;
        currentScrollRef.current = window.scrollY;
        rafRef.current = requestAnimationFrame(smoothScroll);
      }
    };

    // ── Keyboard ───────────────────────────────────────────────────────────
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if focus is inside an interactive element (input, textarea, select…)
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const scrollAmount = 100;
      let delta = 0;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          delta = scrollAmount;
          break;
        case "ArrowUp":
          e.preventDefault();
          delta = -scrollAmount;
          break;
        case "PageDown":
          e.preventDefault();
          delta = window.innerHeight;
          break;
        case "PageUp":
          e.preventDefault();
          delta = -window.innerHeight;
          break;
        case "Home":
          e.preventDefault();
          targetScrollRef.current = 0;
          if (!isScrollingRef.current) {
            isScrollingRef.current   = true;
            currentScrollRef.current = window.scrollY;
            rafRef.current = requestAnimationFrame(smoothScroll);
          }
          return;
        case "End":
          e.preventDefault();
          targetScrollRef.current = document.documentElement.scrollHeight - window.innerHeight;
          if (!isScrollingRef.current) {
            isScrollingRef.current   = true;
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
        isScrollingRef.current   = true;
        currentScrollRef.current = window.scrollY;
        rafRef.current = requestAnimationFrame(smoothScroll);
      }
    };

    // Initialise refs to current position (handles page refresh mid-page)
    targetScrollRef.current  = window.scrollY;
    currentScrollRef.current = window.scrollY;

    window.addEventListener("scroll",  handleScroll,  { passive: true });
    window.addEventListener("wheel",   handleWheel,   { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll",  handleScroll);
      window.removeEventListener("wheel",   handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <>{children}</>;
}
