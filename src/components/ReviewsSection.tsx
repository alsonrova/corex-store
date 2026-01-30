"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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

// Scrolling text — 7 rows, each with its own phrases, varied lengths, authentic diverse content
const ROW_PHRASES: string[][] = [
  [
    "Absolutely stunning build quality 🔥",
    "worth it",
    "Best PC I've ever owned honestly",
    "cable management is next level",
    "INSANE performance",
    "this thing is silent???",
    "10/10 would buy again",
    "COREX changed the game for me",
  ],
  [
    "livraison rapide",
    "THE AIRFLOW ON THIS THING 💀",
    "no regrets",
    "My friends are so jealous lmao",
    "runs everything on ultra",
    "service client au top",
    "bought one for my brother too",
    "premium",
  ],
  [
    "clean af",
    "I was skeptical but wow this is different",
    "meilleur achat de l'année",
    "ZERO noise. ZERO.",
    "they really care about details",
    "built like a tank",
    "aesthetic perfection",
    "je recommande à 100%",
  ],
  [
    "the packaging alone was an experience",
    "FIRE 🔥🔥🔥",
    "can't go back to anything else now",
    "absolute unit",
    "my setup is finally complete",
    "qualité irréprochable",
    "runs cooler than expected",
    "this is the one",
  ],
  [
    "ok i'm obsessed",
    "Customer support replied in 10 min. 10. MINUTES.",
    "magnifique",
    "worth every single cent",
    "BEAST MODE",
    "the rgb integration is so clean",
    "built different fr",
    "told everyone at work about it",
  ],
  [
    "S-tier build",
    "je suis fan",
    "finally a PC that matches my setup aesthetic",
    "GODLIKE cooling",
    "trusted the reviews and wasn't disappointed",
    "no bloatware, just pure performance",
    "shipped faster than Amazon lol",
    "incroyable",
  ],
  [
    "this >>> everything else",
    "took a risk on a boutique brand, best decision ever",
    "bravo COREX",
    "dead silent even under load",
    "ELITE",
    "my wallet cried but my eyes are happy",
    "they even followed up after delivery",
    "build quality speaks for itself",
  ],
];

// Row configs: 7 rows, varied sizes, opacities, speeds, and directions
const ROW_CONFIGS = [
  { speed: 55, size: 22, opacity: 0.85, top: 4, reverse: false },
  { speed: 40, size: 12, opacity: 0.3, top: 16, reverse: true },
  { speed: 48, size: 18, opacity: 0.65, top: 30, reverse: false },
  { speed: 35, size: 10, opacity: 0.2, top: 44, reverse: true },
  { speed: 52, size: 24, opacity: 0.9, top: 58, reverse: false },
  { speed: 38, size: 13, opacity: 0.35, top: 74, reverse: true },
  { speed: 45, size: 16, opacity: 0.55, top: 88, reverse: false },
];

// Phase 4 scattered positions (vw, vh) — positioned higher in viewport
const NETWORK_POSITIONS = [
  { x: 6, y: 18 },
  { x: 68, y: 10 },
  { x: 32, y: 38 },
  { x: 58, y: 28 },
  { x: 14, y: 55 },
];

const CARD_ENTRY_THRESHOLDS = [0.0, 0.22, 0.28, 0.34, 0.40];

// Pre-compute doubled phrases (static — no need to recreate on every render)
const DOUBLED_PHRASES = ROW_PHRASES.map((phrases) => [...phrases, ...phrases]);

// ── Component ──

export default function ReviewsSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const visibleCount = CARD_ENTRY_THRESHOLDS.filter(
    (t) => scrollProgress >= t
  ).length;
  const shouldFloat = scrollProgress >= 0.45;

  // Network bg opacity (Phase 5: 0.50 → 0.65) — increased max opacity
  const networkOpacity =
    scrollProgress < 0.5
      ? 0
      : scrollProgress < 0.65
        ? ((scrollProgress - 0.5) / 0.15) * 0.35
        : 0.35;

  // Scrolling text opacity (starts at 0.50 now, not 0.78)
  const scrollTextOpacity =
    scrollProgress < 0.5 ? 0 : Math.min((scrollProgress - 0.5) / 0.1, 1);

  // Header fades out as scroll starts
  const headerOpacity = Math.max(0, 1 - scrollProgress * 3);
  const indicatorOpacity = Math.max(0, 1 - scrollProgress * 4);

  // ── Card position calculator ──

  function getCardTransform(index: number): React.CSSProperties {
    const threshold = CARD_ENTRY_THRESHOLDS[index];

    // Not yet visible
    if (index > 0 && scrollProgress < threshold) {
      return { transform: "translateX(100vw)", opacity: 0 };
    }

    // Phase 4+: network scattered positions — compensate for CSS top: 50% / margin-top: -160px
    if (scrollProgress >= 0.45) {
      const pos = NETWORK_POSITIONS[index];
      return {
        transform: `translate(${pos.x}vw, calc(${pos.y - 50}vh + 160px))`,
        opacity: 1,
      };
    }

    // Phase 1: first card enters from right (0 → 0.08)
    if (scrollProgress < 0.08) {
      if (index > 0) return { transform: "translateX(100vw)", opacity: 0 };
      const p = scrollProgress / 0.08;
      const x = 100 - p * 40;
      return { transform: `translateX(${x}vw)`, opacity: Math.min(p * 2, 1) };
    }

    // Phase 2: first card centers (0.08 → 0.18)
    if (scrollProgress < 0.18) {
      if (index > 0) return { transform: "translateX(100vw)", opacity: 0 };
      const p = (scrollProgress - 0.08) / 0.1;
      const x = 60 - p * 23;
      return { transform: `translateX(${x}vw)`, opacity: 1 };
    }

    // Phase 3: accumulation (0.18 → 0.45)
    const totalWidth = 80;
    const startX = 10;
    const count = Math.max(visibleCount, 1);
    const spacing = totalWidth / (count + 1);
    const targetX = startX + spacing * (index + 1) - 10;

    // Entry animation for cards 1-4
    if (index >= 1) {
      const entryEnd = threshold + 0.04;
      if (scrollProgress < threshold) {
        return { transform: "translateX(100vw)", opacity: 0 };
      }
      if (scrollProgress < entryEnd) {
        const ep = (scrollProgress - threshold) / 0.04;
        const currentX = 100 - ep * (100 - targetX);
        return {
          transform: `translateX(${currentX}vw)`,
          opacity: Math.min(ep * 2, 1),
        };
      }
    }

    return { transform: `translateX(${targetX}vw)`, opacity: 1 };
  }

  // ── Network SVG (memoized — static content) ──
  const networkSvgContent = useMemo(() => {
    const lines: [number, number][] = [
      [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4],
      [0, 3], [1, 4],
    ];

    const lineElements = lines.map(([a, b], i) => {
      const pa = NETWORK_POSITIONS[a];
      const pb = NETWORK_POSITIONS[b];
      const x1 = (pa.x / 100) * 1200;
      const y1 = (pa.y / 100) * 800;
      const x2 = (pb.x / 100) * 1200;
      const y2 = (pb.y / 100) * 800;
      const isSecondary = i >= 6;

      return (
        <line
          key={`l${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(92, 255, 177, 0.5)"
          strokeWidth={isSecondary ? 1 : 1.5}
          className={styles.networkLine}
        />
      );
    });

    const cardNodes = NETWORK_POSITIONS.map((p) => ({
      cx: (p.x / 100) * 1200,
      cy: (p.y / 100) * 800,
      r: 5,
    }));

    const extraNodes = [
      { cx: 300, cy: 200, r: 2.5 },
      { cx: 600, cy: 150, r: 2.5 },
      { cx: 540, cy: 500, r: 2.5 },
      { cx: 150, cy: 350, r: 2.5 },
      { cx: 900, cy: 300, r: 2.5 },
      { cx: 480, cy: 280, r: 2.5 },
      { cx: 1050, cy: 180, r: 2 },
      { cx: 100, cy: 600, r: 2 },
    ];

    const nodeElements = [...cardNodes, ...extraNodes].map((node, i) => (
      <circle
        key={`n${i}`}
        cx={node.cx}
        cy={node.cy}
        r={node.r}
        fill="rgba(92, 255, 177, 0.6)"
        className={styles.networkNode}
        style={{ "--node-delay": `${i * 0.25}s` } as React.CSSProperties}
      />
    ));

    return (
      <g>
        {lineElements}
        {nodeElements}
      </g>
    );
  }, []);

  // ── Render ──

  return (
    <section className={styles.section} id="reviews" ref={sectionRef}>
      <div
        className={`${styles.fixedOverlay} ${isActive ? styles.active : ""} ${isAtBottom ? styles.atBottom : ""}`}
      >
        {/* Section header */}
        <div
          className={styles.sectionHeader}
          style={{ opacity: headerOpacity }}
        >
          <p className={styles.eyebrow}>Community</p>
          <h2 className={styles.title}>What Builders Say</h2>
          <p className={styles.subtitle}>
            Real feedback from the COREX community
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className={styles.scrollIndicator}
          style={{ opacity: indicatorOpacity }}
        >
          <span>Scroll to explore</span>
          <div className={styles.scrollArrow}>&#8595;</div>
        </div>

        {/* Network mesh background (Phase 5+) */}
        <div className={styles.networkBg} style={{ opacity: networkOpacity }}>
          <svg
            className={styles.networkSvg}
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
          >
            {networkSvgContent}
          </svg>
        </div>

        {/* Review cards */}
        <div className={styles.cardsLayer}>
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`${styles.cardWrapper} ${shouldFloat ? styles.floating : ""}`}
              style={
                {
                  ...getCardTransform(index),
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
            </div>
          ))}
        </div>

        {/* Scrolling text rows (starts at progress ~0.50) */}
        <div
          className={`${styles.scrollingTextLayer} ${scrollTextOpacity === 0 ? styles.scrollingPaused : ""}`}
          style={{ opacity: scrollTextOpacity }}
        >
          {ROW_CONFIGS.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={styles.scrollingRow}
              style={
                {
                  top: `${row.top}%`,
                  "--scroll-duration": `${row.speed}s`,
                  "--row-opacity": row.opacity,
                  fontSize: `${row.size}px`,
                } as React.CSSProperties
              }
            >
              <div
                className={`${styles.scrollingContent} ${row.reverse ? styles.scrollReverse : ""}`}
              >
                {DOUBLED_PHRASES[rowIndex].map((phrase, i) => (
                  <span key={i} className={styles.scrollingPhrase}>
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
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
