"use client";

import { useEffect, useRef, useCallback } from "react";
import styles from "./CursorGlow.module.css";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = glowRef.current;
    if (!el) return;
    el.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
    if (!visibleRef.current) {
      visibleRef.current = true;
      el.classList.add(styles.visible);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = glowRef.current;
    if (!el) return;
    visibleRef.current = false;
    el.classList.remove(styles.visible);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return <div ref={glowRef} className={styles.glow} />;
}
