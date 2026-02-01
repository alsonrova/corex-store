"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import ReviewCard from "./ReviewCard";
import styles from "./ReviewsSection.module.css";

// ── Decrypt text effect (rAF-based, fixed duration) ──

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`01";

function DecryptText({
  text,
  active,
  delay = 0,
  duration = 650,
  className,
}: {
  text: string;
  active: boolean;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState("");
  const started = useRef(false);
  const rafRef = useRef<number | null>(null);
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = useCallback(() => {
    const chars = text.split("");
    const total = chars.length;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Characters lock left-to-right based on time progress
      const locked = Math.floor(progress * total);

      let result = "";
      for (let i = 0; i < total; i++) {
        if (i < locked) {
          result += chars[i];
        } else if (chars[i] === " ") {
          result += " ";
        } else {
          result += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
      }
      setDisplay(result);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    // Start with all scrambled
    let scrambled = "";
    for (let i = 0; i < total; i++) {
      scrambled += chars[i] === " " ? " " : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }
    setDisplay(scrambled);
    rafRef.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    if (active && !started.current) {
      started.current = true;
      delayRef.current = setTimeout(run, delay);
    }
  }, [active, delay, run]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (delayRef.current) clearTimeout(delayRef.current);
    };
  }, []);

  if (!display) return <span className={className}>{"\u00A0"}</span>;
  return <span className={className}>{display}</span>;
}

// ── Data ──

interface Review {
  id: string;
  avatar: string;
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
    avatar: "https://i.pravatar.cc/80?img=12",
    username: "alex.k",
    handle: "@alexkbuilds",
    image: "/ChatGPT Image 31 janv. 2026, 12_31_52.png",
    likes: 2847,
    text: "The build quality is insane. Every cable was routed perfectly, zero compromise on aesthetics. This is art.",
    date: "2d",
  },
  {
    id: "r2",
    avatar: "https://i.pravatar.cc/80?img=5",
    username: "sarah.m",
    handle: "@sarahsetups",
    image: "/ChatGPT Image 31 janv. 2026, 12_31_58.png",
    likes: 1523,
    text: "Ordered a custom config. Arrived in 3 days, runs flawlessly. COREX doesn't play around.",
    date: "5d",
  },
  {
    id: "r3",
    avatar: "https://i.pravatar.cc/80?img=53",
    username: "david.j",
    handle: "@djtech_",
    image: "/ChatGPT Image 31 janv. 2026, 12_32_04.png",
    likes: 4210,
    text: "Look at those internals. Best customer service I've experienced — they answered every single question I had before and after purchase.",
    date: "1w",
  },
  {
    id: "r4",
    avatar: "https://i.pravatar.cc/80?img=9",
    username: "emma.l",
    handle: "@emmabuilds",
    image: "/ChatGPT Image 31 janv. 2026, 12_32_09.png",
    likes: 987,
    text: "My setup looks incredible. Friends keep asking where I got it. Silent and powerful.",
    date: "1w",
  },
  {
    id: "r5",
    avatar: "https://i.pravatar.cc/80?img=68",
    username: "marcus.p",
    handle: "@marcusp.gg",
    image: "/ChatGPT Image 31 janv. 2026, 12_32_13.png",
    likes: 3156,
    text: "Silent, powerful, beautiful. COREX nailed it. This is what premium looks like.",
    date: "2w",
  },
];

// Scrolling comments — fewer, well-spaced, realistic reviews
const SCROLL_COMMENTS = [
  { text: "Honestly I was skeptical at first but this PC completely blew my expectations, the airflow alone is worth the price", y: 6, speed: 34, size: 14, op: 0.35, delay: 0 },
  { text: "Ran Cyberpunk on ultra settings, 4K, ray tracing maxed out and this beast didn't even break a sweat", y: 20, speed: 30, size: 13, op: 0.3, delay: -4 },
  { text: "J'ai re\u00e7u ma commande en 3 jours, tout \u00e9tait emball\u00e9 avec soin et le cable management est impeccable", y: 36, speed: 38, size: 12, op: 0.25, delay: -11 },
  { text: "I've built PCs for 15 years and I can tell you the thermal design here is top-tier engineering", y: 52, speed: 32, size: 14, op: 0.3, delay: -14 },
  { text: "The RGB integration is so clean it looks like the whole case is breathing, nothing like cheap rainbow builds", y: 66, speed: 36, size: 13, op: 0.25, delay: -20 },
  { text: "Silent even during stress tests, I had to check twice that it was actually on because I couldn't hear a thing", y: 80, speed: 30, size: 14, op: 0.35, delay: -22 },
  { text: "Every single detail is thought through, from the custom backplate to the sleeved cables, this is premium", y: 93, speed: 34, size: 12, op: 0.2, delay: -29 },
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
  const [showCta, setShowCta] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const ctaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // ── CTA title: fire-once, 3s after comments first appear ──
  const commentsStarted = scrollProgress >= 0.62;
  const ctaFired = useRef(false);

  useEffect(() => {
    if (commentsStarted && !ctaFired.current) {
      ctaFired.current = true;
      ctaTimerRef.current = setTimeout(() => setShowCta(true), 1500);
    }
    return () => {
      if (ctaTimerRef.current) {
        clearTimeout(ctaTimerRef.current);
        ctaTimerRef.current = null;
      }
    };
  }, [commentsStarted]);

  // ── Derived values ──

  const visibleCount = CARD_ENTRY_THRESHOLDS.filter((t) => scrollProgress >= t).length;
  const shouldFloat = scrollProgress >= 0.58;

  const webOpacity =
    scrollProgress < 0.62
      ? 0
      : scrollProgress < 0.75
        ? ((scrollProgress - 0.62) / 0.13) * 0.4
        : scrollProgress < 0.90
          ? 0.4
          : 0.4 * Math.max(0, 1 - (scrollProgress - 0.90) / 0.10);

  const commentsOpacity =
    scrollProgress < 0.62
      ? 0
      : scrollProgress < 0.90
        ? Math.min((scrollProgress - 0.62) / 0.1, 1)
        : Math.max(0, 1 - (scrollProgress - 0.90) / 0.10);

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

  const webMesh = useMemo(() => {
    const w = 1400;
    const h = 1000;
    const cols = 18;
    const rows = 13;
    const colSpacing = w / cols;
    const rowSpacing = h / rows;
    const lineColor = "rgba(92, 255, 177, 0.25)";
    const nodeColor = "rgba(92, 255, 177, 0.40)";

    const base: React.ReactElement[] = [];
    const mask: React.ReactElement[] = [];

    for (let i = 0; i <= rows; i++) {
      const y = i * rowSpacing;
      base.push(<line key={`h${i}`} x1={0} y1={y} x2={w} y2={y} stroke={lineColor} strokeWidth={0.8} />);
      mask.push(<line key={`mh${i}`} x1={0} y1={y} x2={w} y2={y} stroke="white" strokeWidth={3} />);
    }

    for (let i = 0; i <= cols; i++) {
      const x = i * colSpacing;
      base.push(<line key={`v${i}`} x1={x} y1={0} x2={x} y2={h} stroke={lineColor} strokeWidth={0.8} />);
      mask.push(<line key={`mv${i}`} x1={x} y1={0} x2={x} y2={h} stroke="white" strokeWidth={3} />);
    }

    for (let iy = 0; iy <= rows; iy += 2) {
      for (let ix = 0; ix <= cols; ix += 2) {
        base.push(<circle key={`n${ix}-${iy}`} cx={ix * colSpacing} cy={iy * rowSpacing} r={1.5} fill={nodeColor} />);
        mask.push(<circle key={`mn${ix}-${iy}`} cx={ix * colSpacing} cy={iy * rowSpacing} r={4} fill="white" />);
      }
    }

    return { base: <g>{base}</g>, mask: <g>{mask}</g> };
  }, []);

  // ── Render ──

  return (
    <section className={styles.section} id="reviews" ref={sectionRef}>
      <div
        className={`${styles.fixedOverlay} ${isActive ? styles.active : ""} ${isAtBottom ? styles.atBottom : ""} ${shouldFloat ? styles.fadeBottom : ""}`}
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
              <defs>
                <filter id="glowBlur">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
                <mask id="meshMask">
                  <rect width="1400" height="1000" fill="black" />
                  <g filter="url(#glowBlur)">{webMesh.mask}</g>
                </mask>
                <linearGradient id="sweepGrad">
                  <stop offset="0%" stopColor="rgba(92,255,177,0)" />
                  <stop offset="42%" stopColor="rgba(92,255,177,0)" />
                  <stop offset="47%" stopColor="rgba(92,255,177,0.3)" />
                  <stop offset="49%" stopColor="rgba(92,255,177,1)" />
                  <stop offset="51%" stopColor="rgba(92,255,177,1)" />
                  <stop offset="53%" stopColor="rgba(92,255,177,0.3)" />
                  <stop offset="58%" stopColor="rgba(92,255,177,0)" />
                  <stop offset="100%" stopColor="rgba(92,255,177,0)" />
                </linearGradient>
              </defs>
              {webMesh.base}
              <rect
                x="0" y="0" width="100" height="1000"
                fill="url(#sweepGrad)"
                mask="url(#meshMask)"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-150 0"
                  to="1500 0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </rect>
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
                  avatar={review.avatar}
                  username={review.username}
                  handle={review.handle}
                  image={review.image}
                  likes={review.likes}
                  text={review.text}
                  date={review.date}
                  animate={scrollProgress >= (index === 0 ? 0.15 : CARD_ENTRY_THRESHOLDS[index] + 0.06)}
                  liveIncrement={scrollProgress >= 0.85}
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

        {/* CTA title — decrypt + glitch entrance */}
        <div
          className={`${styles.ctaTitle} ${showCta ? styles.ctaVisible : ""} ${showCta ? styles.ctaGlitching : ""}`}
          style={{ opacity: showCta ? commentsOpacity : 0, transition: "opacity 0.5s ease" }}
        >
          <DecryptText
            text="Built to impress."
            active={showCta}
            delay={0}
            duration={850}
            className={styles.ctaGlow}
          />
          <DecryptText
            text="Crafted for those who refuse ordinary."
            active={showCta}
            delay={300}
            duration={750}
            className={styles.ctaSub}
          />
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
