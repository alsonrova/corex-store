"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import ReviewCard from "./ReviewCard";
import styles from "./ReviewsSection.module.css";

// ── Data ──

interface Review {
  id: string;
  avatarColor: string;
  initials: string;
  username: string;
  handle: string;
  image: string;
  likes: number;
  text: string;
  date: string;
}

const reviews: Review[] = [
  {
    id: "r1",
    avatarColor: "#5cffb1",
    initials: "AK",
    username: "alex.k",
    handle: "@alexkbuilds",
    image: "/vecteezy_modern-gaming-pc-isolated-on-transparent_48412735.png",
    likes: 2847,
    text: "The build quality is insane. Every cable was routed perfectly, zero compromise on aesthetics. This is art.",
    date: "2d",
  },
  {
    id: "r2",
    avatarColor: "#4d9fff",
    initials: "SM",
    username: "sarah.m",
    handle: "@sarahsetups",
    image: "/vecteezy_modern-gaming-pc-isolated-on-transparent_48412770.png",
    likes: 1523,
    text: "Ordered a custom config. Arrived in 3 days, runs flawlessly. COREX doesn't play around.",
    date: "5d",
  },
  {
    id: "r3",
    avatarColor: "#ff6b9d",
    initials: "DJ",
    username: "david.j",
    handle: "@djtech_",
    image: "/corex_inside.png",
    likes: 4210,
    text: "Look at those internals. Best customer service I've experienced — they answered every single question I had before and after purchase.",
    date: "1w",
  },
  {
    id: "r4",
    avatarColor: "#ffd93d",
    initials: "EL",
    username: "emma.l",
    handle: "@emmabuilds",
    image: "/vecteezy_modern-gaming-pc-isolated-on-transparent_48412788.png",
    likes: 987,
    text: "My setup looks incredible. Friends keep asking where I got it. Silent and powerful.",
    date: "1w",
  },
  {
    id: "r5",
    avatarColor: "#a78bfa",
    initials: "MP",
    username: "marcus.p",
    handle: "@marcusp.gg",
    image: "/client_and_customer.png",
    likes: 3156,
    text: "Silent, powerful, beautiful. COREX nailed it. This is what premium looks like.",
    date: "2w",
  },
];

// Scrolling comments — each one isolated on its own row, staggered delays
const SCROLL_COMMENTS = [
  { text: "Absolutely stunning build quality \u{1F525}", y: 4, speed: 22, size: 17, op: 0.6, delay: 0 },
  { text: "INSANE performance", y: 12, speed: 26, size: 21, op: 0.75, delay: 4 },
  { text: "this thing is silent???", y: 20, speed: 18, size: 12, op: 0.3, delay: 9 },
  { text: "FIRE \u{1F525}\u{1F525}\u{1F525}", y: 28, speed: 16, size: 24, op: 0.85, delay: 1 },
  { text: "livraison rapide", y: 35, speed: 24, size: 11, op: 0.25, delay: 11 },
  { text: "worth it", y: 42, speed: 15, size: 14, op: 0.4, delay: 6 },
  { text: "ZERO noise. ZERO.", y: 49, speed: 20, size: 19, op: 0.6, delay: 3 },
  { text: "clean af", y: 55, speed: 14, size: 15, op: 0.4, delay: 8 },
  { text: "BEAST MODE", y: 62, speed: 21, size: 26, op: 0.85, delay: 2 },
  { text: "meilleur achat de l'ann\u00e9e", y: 68, speed: 23, size: 13, op: 0.3, delay: 10 },
  { text: "built different fr", y: 74, speed: 17, size: 16, op: 0.5, delay: 5 },
  { text: "S-tier build", y: 80, speed: 20, size: 20, op: 0.7, delay: 7 },
  { text: "ELITE", y: 86, speed: 15, size: 28, op: 0.9, delay: 3 },
  { text: "aesthetic perfection", y: 92, speed: 22, size: 18, op: 0.55, delay: 9 },
  { text: "10/10 would buy again", y: 8, speed: 25, size: 15, op: 0.45, delay: 13 },
  { text: "GODLIKE cooling", y: 38, speed: 19, size: 13, op: 0.3, delay: 15 },
  { text: "premium", y: 58, speed: 16, size: 19, op: 0.5, delay: 12 },
  { text: "magnifique", y: 46, speed: 21, size: 12, op: 0.25, delay: 14 },
  { text: "ok i'm obsessed", y: 17, speed: 18, size: 15, op: 0.4, delay: 7 },
  { text: "cable management is next level", y: 76, speed: 24, size: 10, op: 0.2, delay: 16 },
];

// Phase 4 scattered card positions (vw, vh)
const SCATTER_POSITIONS = [
  { x: 6, y: 18 },
  { x: 68, y: 10 },
  { x: 32, y: 38 },
  { x: 58, y: 28 },
  { x: 14, y: 55 },
];

const CARD_ENTRY_THRESHOLDS = [0.0, 0.22, 0.28, 0.34, 0.40];

// Spring configs
const SPRING_ENTRY = { type: "spring" as const, stiffness: 120, damping: 14, mass: 0.8 };
const SPRING_SCATTER = { type: "spring" as const, stiffness: 80, damping: 18, mass: 1 };
const SPRING_REPOSITION = { type: "spring" as const, stiffness: 200, damping: 22 };

// ── Component ──

export default function ReviewsSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  // Window size tracking
  useEffect(() => {
    const update = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Scroll handler (throttled via rAF)
  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const el = sectionRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const sectionHeight = el.offsetHeight;
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;

        const active = sectionTop <= 0 && sectionBottom > windowHeight;
        const atBottom = sectionTop < 0 && sectionBottom <= windowHeight;

        setIsActive(active);
        setIsAtBottom(atBottom);

        if (!active && !atBottom) {
          if (sectionTop > 0) setScrollProgress(0);
          return;
        }

        if (atBottom) {
          setScrollProgress(1);
          return;
        }

        const scrollableDistance = sectionHeight - windowHeight;
        const progress = Math.min(Math.abs(sectionTop) / scrollableDistance, 1);
        setScrollProgress(progress);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // ── Derived values ──

  const visibleCount = CARD_ENTRY_THRESHOLDS.filter((t) => scrollProgress >= t).length;
  const shouldFloat = scrollProgress >= 0.58;

  const webOpacity =
    scrollProgress < 0.62
      ? 0
      : scrollProgress < 0.75
        ? ((scrollProgress - 0.62) / 0.13) * 0.4
        : 0.4;

  const commentsOpacity =
    scrollProgress < 0.62 ? 0 : Math.min((scrollProgress - 0.62) / 0.1, 1);

  const headerOpacity = Math.max(0, 1 - scrollProgress * 3);
  const indicatorOpacity = Math.max(0, 1 - scrollProgress * 4);

  // ── Card animation target (pixel values for Framer Motion) ──

  function getCardTarget(index: number) {
    const { w, h } = windowSize;
    if (w === 0) return { x: 1500, y: 0, opacity: 0, scale: 0.8 };

    const threshold = CARD_ENTRY_THRESHOLDS[index];

    if (index > 0 && scrollProgress < threshold) {
      return { x: w + 100, y: 0, opacity: 0, scale: 0.8 };
    }

    if (scrollProgress >= 0.58) {
      const pos = SCATTER_POSITIONS[index];
      const x = (pos.x / 100) * w;
      const y = ((pos.y - 50) / 100) * h + 160;
      return { x, y, opacity: 1, scale: 1 };
    }

    if (scrollProgress < 0.08) {
      if (index > 0) return { x: w + 100, y: 0, opacity: 0, scale: 0.8 };
      const p = scrollProgress / 0.08;
      const x = ((100 - p * 40) / 100) * w;
      return { x, y: 0, opacity: Math.min(p * 2, 1), scale: 0.9 + p * 0.1 };
    }

    if (scrollProgress < 0.18) {
      if (index > 0) return { x: w + 100, y: 0, opacity: 0, scale: 0.8 };
      const p = (scrollProgress - 0.08) / 0.1;
      const x = ((60 - p * 23) / 100) * w;
      return { x, y: 0, opacity: 1, scale: 1 };
    }

    const totalWidth = 80;
    const startX = 10;
    const count = Math.max(visibleCount, 1);
    const spacing = totalWidth / (count + 1);
    const targetVw = startX + spacing * (index + 1) - 10;
    const targetX = (targetVw / 100) * w;

    if (index >= 1) {
      const threshold = CARD_ENTRY_THRESHOLDS[index];
      const entryEnd = threshold + 0.04;
      if (scrollProgress < threshold) {
        return { x: w + 100, y: 0, opacity: 0, scale: 0.8 };
      }
      if (scrollProgress < entryEnd) {
        const ep = (scrollProgress - threshold) / 0.04;
        const currentX = w + 100 - ep * (w + 100 - targetX);
        return { x: currentX, y: 0, opacity: Math.min(ep * 2, 1), scale: 0.85 + ep * 0.15 };
      }
    }

    return { x: targetX, y: 0, opacity: 1, scale: 1 };
  }

  // ── Card spring config ──

  function getCardSpring(index: number) {
    const threshold = CARD_ENTRY_THRESHOLDS[index];
    if (index === 0 && scrollProgress < 0.18) return SPRING_ENTRY;
    if (index >= 1 && scrollProgress >= threshold && scrollProgress < threshold + 0.06) return SPRING_ENTRY;
    if (scrollProgress >= 0.53 && scrollProgress <= 0.68) return SPRING_SCATTER;
    return SPRING_REPOSITION;
  }

  // ── Web mesh SVG (memoized — full-screen grid) ──

  const webMeshContent = useMemo(() => {
    const w = 1400;
    const h = 1000;
    const cols = 18;
    const rows = 13;
    const colSpacing = w / cols;
    const rowSpacing = h / rows;
    const lineColor = "rgba(92, 255, 177, 0.07)";
    const nodeColor = "rgba(92, 255, 177, 0.14)";

    const elements: React.ReactElement[] = [];

    for (let i = 0; i <= rows; i++) {
      const y = i * rowSpacing;
      elements.push(
        <line key={`h${i}`} x1={0} y1={y} x2={w} y2={y} stroke={lineColor} strokeWidth={0.8} />
      );
    }

    for (let i = 0; i <= cols; i++) {
      const x = i * colSpacing;
      elements.push(
        <line key={`v${i}`} x1={x} y1={0} x2={x} y2={h} stroke={lineColor} strokeWidth={0.8} />
      );
    }

    for (let iy = 0; iy <= rows; iy += 2) {
      for (let ix = 0; ix <= cols; ix += 2) {
        elements.push(
          <circle
            key={`n${ix}-${iy}`}
            cx={ix * colSpacing}
            cy={iy * rowSpacing}
            r={1.5}
            fill={nodeColor}
          />
        );
      }
    }

    return <g>{elements}</g>;
  }, []);

  // ── Render ──

  return (
    <section className={styles.section} id="reviews" ref={sectionRef}>
      <div
        className={`${styles.fixedOverlay} ${isActive ? styles.active : ""} ${isAtBottom ? styles.atBottom : ""}`}
      >
        {/* Section header */}
        <div className={styles.sectionHeader} style={{ opacity: headerOpacity }}>
          <p className={styles.eyebrow}>Community</p>
          <h2 className={styles.title}>What Builders Say</h2>
          <p className={styles.subtitle}>Real feedback from the COREX community</p>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator} style={{ opacity: indicatorOpacity }}>
          <span>Scroll to explore</span>
          <div className={styles.scrollArrow}>&#8595;</div>
        </div>

        {/* Full-screen web mesh — flat grid curved by CSS perspective */}
        <div className={styles.webBg} style={{ opacity: webOpacity }}>
          <div className={styles.webInner}>
            <svg
              className={styles.webSvg}
              viewBox="0 0 1400 1000"
              preserveAspectRatio="xMidYMid slice"
            >
              {webMeshContent}
            </svg>
          </div>
        </div>

        {/* Review cards */}
        <div className={styles.cardsLayer}>
          {reviews.map((review, index) => {
            const target = getCardTarget(index);
            const spring = getCardSpring(index);
            return (
              <motion.div
                key={review.id}
                className={`${styles.cardWrapper} ${shouldFloat ? styles.floating : ""}`}
                animate={{
                  x: target.x,
                  y: target.y,
                  opacity: target.opacity,
                  scale: target.scale,
                }}
                transition={spring}
                style={
                  {
                    "--float-delay": `${index * -1.5}s`,
                    "--float-x": `${(index % 2 === 0 ? 1 : -1) * (3 + index)}px`,
                    "--float-y": `${(index % 2 === 0 ? -1 : 1) * (4 + index * 2)}px`,
                  } as React.CSSProperties
                }
              >
                <ReviewCard
                  avatarColor={review.avatarColor}
                  initials={review.initials}
                  username={review.username}
                  handle={review.handle}
                  image={review.image}
                  likes={review.likes}
                  text={review.text}
                  date={review.date}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Scrolling comments — each isolated, right to left */}
        <div className={styles.commentsLayer} style={{ opacity: commentsOpacity }}>
          {SCROLL_COMMENTS.map((c, i) => (
            <span
              key={i}
              className={styles.scrollComment}
              style={
                {
                  top: `${c.y}%`,
                  fontSize: `${c.size}px`,
                  opacity: c.op,
                  "--scroll-speed": `${c.speed}s`,
                  "--scroll-delay": `${c.delay}s`,
                } as React.CSSProperties
              }
            >
              {c.text}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
