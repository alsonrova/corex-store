"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { motion, useSpring, useTransform, MotionValue } from "framer-motion";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const scrollY = useSpring(0, {
    stiffness: 400,
    damping: 20,
    mass: 0.1,
  });

  useEffect(() => {
    const updateHeight = () => {
      if (scrollRef.current) {
        setContentHeight(scrollRef.current.scrollHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    const resizeObserver = new ResizeObserver(updateHeight);
    if (scrollRef.current) {
      resizeObserver.observe(scrollRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateHeight);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  const y = useTransform(scrollY, (value) => -value);

  return (
    <>
      <div style={{ height: contentHeight }} />
      <motion.div
        ref={scrollRef}
        style={{
          y,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
