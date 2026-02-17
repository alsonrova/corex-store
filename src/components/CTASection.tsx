"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./CTASection.module.css";

// ── Glitch/Decrypt text — letter-by-letter reveal ──
const GLITCH_CHARS = "!@#$%^&*<>[]{}|01";

function GlitchText({
  text,
  active,
  delay = 0,
  duration = 900,
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

// ── Particle system — seeded PRNG for SSR/client consistency ──

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  blur: number;
  delay: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateParticles(count: number): Particle[] {
  const rand = seededRandom(42);
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2;
    const radius = rand() * 35 + 5;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;

    particles.push({
      id: i,
      x: Math.max(2, Math.min(98, x)),
      y: Math.max(5, Math.min(95, y)),
      size: rand() < 0.4 ? 1 + rand() * 1.5 : 2.5 + rand() * 2,
      opacity: rand() < 0.3 ? 0.15 + rand() * 0.2 : 0.3 + rand() * 0.5,
      speed: 8 + rand() * 14,
      blur: rand() < 0.35 ? 1.5 + rand() * 2 : 0,
      delay: rand() * -20,
    });
  }
  return particles;
}

const PARTICLES = generateParticles(55);

// ── Circuit paths (static) ──
const CIRCUIT_PATHS = [
  { d: "M 5% 15% L 35% 15%", delay: 0, duration: 2.5, opacity: 0.25 },
  { d: "M 45% 15% L 75% 15%", delay: 0.3, duration: 3, opacity: 0.3 },
  { d: "M 85% 15% L 95% 15%", delay: 0.6, duration: 2.8, opacity: 0.2 },
  { d: "M 10% 30% L 25% 30%", delay: 0.3, duration: 3.2, opacity: 0.28 },
  { d: "M 35% 30% L 55% 30%", delay: 0.6, duration: 2.6, opacity: 0.22 },
  { d: "M 65% 30% L 90% 30%", delay: 0.9, duration: 3.5, opacity: 0.32 },
  { d: "M 0% 50% L 20% 50%", delay: 0.6, duration: 2.4, opacity: 0.26 },
  { d: "M 30% 50% L 45% 50%", delay: 0.9, duration: 3.1, opacity: 0.24 },
  { d: "M 55% 50% L 70% 50%", delay: 1.2, duration: 2.9, opacity: 0.3 },
  { d: "M 80% 50% L 100% 50%", delay: 1.5, duration: 3.3, opacity: 0.28 },
  { d: "M 15% 70% L 40% 70%", delay: 0.9, duration: 2.7, opacity: 0.22 },
  { d: "M 50% 70% L 85% 70%", delay: 1.2, duration: 3.4, opacity: 0.26 },
  { d: "M 5% 85% L 30% 85%", delay: 1.2, duration: 3, opacity: 0.24 },
  { d: "M 40% 85% L 60% 85%", delay: 1.5, duration: 2.8, opacity: 0.3 },
  { d: "M 70% 85% L 95% 85%", delay: 1.8, duration: 3.2, opacity: 0.2 },
  { d: "M 20% 15% L 20% 50%", delay: 1.5, duration: 3, opacity: 0.22 },
  { d: "M 35% 30% L 35% 70%", delay: 2, duration: 3.5, opacity: 0.26 },
  { d: "M 55% 15% L 55% 85%", delay: 2.5, duration: 3.2, opacity: 0.3 },
  { d: "M 75% 30% L 75% 50%", delay: 3, duration: 2.8, opacity: 0.24 },
  { d: "M 90% 50% L 90% 85%", delay: 3.5, duration: 3.4, opacity: 0.28 },
  { d: "M 35% 30% L 45% 50%", delay: 2.7, duration: 2, opacity: 0.18 },
  { d: "M 55% 50% L 65% 70%", delay: 3.4, duration: 2.2, opacity: 0.2 },
  { d: "M 75% 50% L 85% 70%", delay: 4.1, duration: 1.8, opacity: 0.16 },
  { d: "M 20% 50% L 35% 70%", delay: 4.8, duration: 2.4, opacity: 0.22 },
];

const CIRCUIT_NODES = [
  { x: 20, y: 15 }, { x: 20, y: 50 },
  { x: 35, y: 30 }, { x: 35, y: 70 },
  { x: 55, y: 15 }, { x: 55, y: 50 }, { x: 55, y: 85 },
  { x: 75, y: 30 }, { x: 75, y: 50 },
  { x: 90, y: 50 }, { x: 90, y: 85 },
  { x: 45, y: 50 }, { x: 65, y: 70 }, { x: 85, y: 70 },
];

// ── Tech decorative fragments ──
const CODE_FRAGMENTS = [
  { text: "0x5CFF", x: 4, y: 22, rot: 0 },
  { text: "sys.init()", x: 82, y: 18, rot: -2 },
  { text: ">> READY", x: 8, y: 78, rot: 1 },
  { text: "0b1010", x: 88, y: 75, rot: -1 },
  { text: "config.load", x: 6, y: 50, rot: 0 },
  { text: "ACK:200", x: 86, y: 48, rot: 1 },
];

const HEX_SYMBOLS = [
  { x: 12, y: 35, size: 18 },
  { x: 90, y: 32, size: 14 },
  { x: 15, y: 68, size: 16 },
  { x: 85, y: 65, size: 12 },
];

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Tron grid (memoized)
  const tronGrid = useMemo(() => {
    const cols = 24;
    const rows = 16;
    const w = 1200;
    const h = 800;
    const colW = w / cols;
    const rowH = h / rows;
    const lines: React.ReactElement[] = [];

    for (let i = 0; i <= rows; i++) {
      const y = i * rowH;
      lines.push(
        <line key={`gh${i}`} x1={0} y1={y} x2={w} y2={y}
          stroke="rgba(92, 255, 177, 0.08)" strokeWidth={0.6} />
      );
    }
    for (let i = 0; i <= cols; i++) {
      const x = i * colW;
      lines.push(
        <line key={`gv${i}`} x1={x} y1={0} x2={x} y2={h}
          stroke="rgba(92, 255, 177, 0.08)" strokeWidth={0.6} />
      );
    }
    // Brighter center lines
    lines.push(
      <line key="gc-h" x1={0} y1={h / 2} x2={w} y2={h / 2}
        stroke="rgba(92, 255, 177, 0.18)" strokeWidth={1} />,
      <line key="gc-v" x1={w / 2} y1={0} x2={w / 2} y2={h}
        stroke="rgba(92, 255, 177, 0.18)" strokeWidth={1} />
    );

    return <g>{lines}</g>;
  }, []);

  // Hexagon path helper
  const hexPath = useCallback((cx: number, cy: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return `M ${pts.join(" L ")} Z`;
  }, []);

  return (
    <section className={styles.section} id="cta" ref={sectionRef}>
      {/* ── Tron perspective grid background ── */}
      <motion.div className={styles.tronBg} style={{ y: bgY }}>
        <div className={styles.tronInner}>
          <svg className={styles.tronSvg} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            {tronGrid}
            {/* Horizon glow line */}
            <line x1={0} y1={400} x2={1200} y2={400}
              stroke="rgba(92, 255, 177, 0.25)" strokeWidth={2}>
              <animate attributeName="stroke-opacity" values="0.15;0.35;0.15" dur="3s" repeatCount="indefinite" />
            </line>
          </svg>
        </div>
        {/* Radial depth gradient */}
        <div className={styles.radialDepth} />
      </motion.div>

      {/* ── Circuit background ── */}
      <motion.div className={styles.circuitBg} style={{ y: bgY }}>
        <svg className={styles.circuitSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="circuitGlow">
              <feGaussianBlur stdDeviation="0.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(92, 255, 177, 0)" />
              <stop offset="40%" stopColor="rgba(92, 255, 177, 0.8)" />
              <stop offset="60%" stopColor="rgba(92, 255, 177, 1)" />
              <stop offset="100%" stopColor="rgba(92, 255, 177, 0)" />
            </linearGradient>
          </defs>

          {CIRCUIT_PATHS.map((path, i) => (
            <g key={i}>
              <path d={path.d} fill="none" stroke="rgba(92, 255, 177, 0.08)"
                strokeWidth="0.15" vectorEffect="non-scaling-stroke" />
              <path d={path.d} fill="none"
                stroke={`rgba(92, 255, 177, ${path.opacity})`}
                strokeWidth="0.2" vectorEffect="non-scaling-stroke"
                filter="url(#circuitGlow)" className={styles.circuitLine}
                style={{ animationDelay: `${path.delay}s`, animationDuration: `${path.duration}s` }} />
            </g>
          ))}

          {CIRCUIT_NODES.map((node, i) => (
            <g key={`node-${i}`}>
              <circle cx={`${node.x}%`} cy={`${node.y}%`} r="0.4" fill="rgba(92, 255, 177, 0.15)" />
              <circle cx={`${node.x}%`} cy={`${node.y}%`} r="0.25"
                fill="rgba(92, 255, 177, 0.4)" className={styles.circuitNode}
                style={{ animationDelay: `${i * 0.2}s` }} />
            </g>
          ))}

          <circle r="0.6" fill="url(#pulseGrad)" className={styles.energyPulse}>
            <animateMotion dur="4s" repeatCount="indefinite" path="M 0,50 L 100,50" />
          </circle>
          <circle r="0.6" fill="url(#pulseGrad)" className={styles.energyPulse}>
            <animateMotion dur="4s" repeatCount="indefinite" path="M 0,30 L 100,30" begin="2s" />
          </circle>
        </svg>
        <div className={styles.scanlines} />
      </motion.div>

      {/* ── Particles — upward-moving data ── */}
      <div className={styles.particleLayer}>
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className={styles.particle}
            style={{
              "--px": `${p.x}%`,
              "--py": `${p.y}%`,
              "--psize": `${p.size}px`,
              "--pop": p.opacity,
              "--pspeed": `${p.speed}s`,
              "--pblur": `${p.blur}px`,
              "--pdelay": `${p.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ── Global horizontal scan line ── */}
      <div className={styles.globalScanLine} />

      {/* ── Main content ── */}
      <motion.div className={styles.content} style={{ y: contentY }}>
        {/* Tech decorative elements */}
        <div className={styles.techDecor}>
          {CODE_FRAGMENTS.map((frag, i) => (
            <span
              key={`code-${i}`}
              className={styles.codeFragment}
              style={{
                left: `${frag.x}%`,
                top: `${frag.y}%`,
                transform: `rotate(${frag.rot}deg)`,
                animationDelay: `${i * 0.6}s`,
              }}
            >
              {frag.text}
            </span>
          ))}

          {/* Hexagon symbols */}
          <svg className={styles.hexSvg} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            {HEX_SYMBOLS.map((hex, i) => (
              <path
                key={`hex-${i}`}
                d={hexPath(hex.x, hex.y, hex.size / 10)}
                fill="none"
                stroke="rgba(92, 255, 177, 0.1)"
                strokeWidth="0.15"
                className={styles.hexSymbol}
                style={{ animationDelay: `${i * 1.2}s` }}
              />
            ))}
          </svg>
        </div>

        {/* Glitch frame */}
        <div className={`${styles.glitchFrame} ${isVisible ? styles.active : ""}`}>
          {/* Energy border pulse — 2 thin light prisms */}
          <svg className={styles.borderPulse} viewBox="0 0 400 300" preserveAspectRatio="none">
            <defs>
              <linearGradient id="prism1" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(92,255,177,0)" />
                <stop offset="30%" stopColor="rgba(92,255,177,0.15)" />
                <stop offset="48%" stopColor="rgba(150,255,200,0.7)" />
                <stop offset="50%" stopColor="rgba(255,255,255,1)" />
                <stop offset="52%" stopColor="rgba(150,255,200,0.7)" />
                <stop offset="70%" stopColor="rgba(92,255,177,0.15)" />
                <stop offset="100%" stopColor="rgba(92,255,177,0)" />
              </linearGradient>
              <linearGradient id="prism2" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(92,255,177,0)" />
                <stop offset="30%" stopColor="rgba(92,255,177,0.1)" />
                <stop offset="48%" stopColor="rgba(120,255,190,0.6)" />
                <stop offset="50%" stopColor="rgba(220,255,240,0.9)" />
                <stop offset="52%" stopColor="rgba(120,255,190,0.6)" />
                <stop offset="70%" stopColor="rgba(92,255,177,0.1)" />
                <stop offset="100%" stopColor="rgba(92,255,177,0)" />
              </linearGradient>
              <filter id="prismGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Prism 1 — clockwise */}
            <rect x="1" y="1" width="398" height="298" rx="16" ry="16"
              fill="none" stroke="url(#prism1)" strokeWidth="1.2"
              strokeDasharray="60 1300" strokeDashoffset="0"
              filter="url(#prismGlow)" className={styles.prismLine1} />
            {/* Prism 2 — offset, slightly slower */}
            <rect x="1" y="1" width="398" height="298" rx="16" ry="16"
              fill="none" stroke="url(#prism2)" strokeWidth="0.8"
              strokeDasharray="45 1300" strokeDashoffset="-680"
              filter="url(#prismGlow)" className={styles.prismLine2} />
          </svg>

          {/* Glitch overlay effect */}
          <div className={styles.glitchOverlay} aria-hidden />

          <div className={styles.frameCorner} data-pos="tl" />
          <div className={styles.frameCorner} data-pos="tr" />
          <div className={styles.frameCorner} data-pos="bl" />
          <div className={styles.frameCorner} data-pos="br" />

          <div className={styles.innerContent}>
            {/* Title */}
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlitchText
                text="Ready to build"
                active={isVisible}
                delay={300}
                className={styles.titleLine}
              />
              <GlitchText
                text="the extraordinary?"
                active={isVisible}
                delay={600}
                className={`${styles.titleLine} ${styles.titleAccent}`}
              />
            </motion.h2>

            {/* Tagline */}
            <motion.p
              className={styles.tagline}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Premium gaming gear for builders who demand perfection
            </motion.p>

            {/* CTA Button */}
            <motion.div
              className={styles.ctaWrapper}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <a href="/store" className={styles.ctaButton}>
                <span className={styles.ctaText}>Enter the store</span>
                <span className={styles.ctaArrow}>&rarr;</span>
                <div className={styles.ctaGlow} />
                <div className={styles.ctaShine} />
                <div className={styles.ctaScan} />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Floating orbs */}
        <div className={styles.floatingOrb} style={{ "--orb-delay": "0s" } as React.CSSProperties} />
        <div className={styles.floatingOrb} style={{ "--orb-delay": "-2s" } as React.CSSProperties} />
        <div className={styles.floatingOrb} style={{ "--orb-delay": "-4s" } as React.CSSProperties} />
      </motion.div>

      {/* Vignette */}
      <div className={styles.vignette} />
    </section>
  );
}
