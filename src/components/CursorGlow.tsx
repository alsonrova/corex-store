"use client";

import { useEffect, useState } from "react";
import styles from "./CursorGlow.module.css";

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [visible]);

  return (
    <div
      className={`${styles.glow} ${visible ? styles.visible : ""}`}
      style={{
        left: position.x,
        top: position.y,
      }}
    />
  );
}

