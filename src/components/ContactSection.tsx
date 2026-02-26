"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import styles from "./ContactSection.module.css";

// ── Types ───────────────────────────────────────────────────────────

type FormStatus = "idle" | "sending" | "sent";

interface FormFields {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface NetworkNode {
  id: string;
  type: "server" | "pc" | "smartphone";
  x: number;
  y: number;
  label: string;
}

interface Connection {
  from: string;
  to: string;
  packetDur: number;
  packetDelay: number;
}

interface DataLabel {
  id: number;
  text: string;
  x: number;
  y: number;
  phase: "typing" | "idle" | "exploding";
  visibleChars: number;
}

// ── Network data (module-level — computed once) ──────────────────────

const NETWORK_NODES: NetworkNode[] = [
  { id: "srv1", type: "server",     x: 100, y: 160, label: "SRV-01" },
  { id: "srv2", type: "server",     x: 90,  y: 370, label: "SRV-02" },
  { id: "srv3", type: "server",     x: 200, y: 280, label: "SRV-03" },
  { id: "pc1",  type: "pc",         x: 410, y: 100, label: "WS-01"  },
  { id: "pc2",  type: "pc",         x: 800, y: 460, label: "WS-02"  },
  { id: "mob1", type: "smartphone", x: 890, y: 130, label: "MOB-01" },
  { id: "mob2", type: "smartphone", x: 700, y: 520, label: "MOB-02" },
];

const CONNECTIONS: Connection[] = [
  { from: "srv1", to: "srv3",  packetDur: 3.2, packetDelay: 0    },
  { from: "srv2", to: "srv3",  packetDur: 2.8, packetDelay: 0.8  },
  { from: "srv3", to: "pc1",   packetDur: 4.0, packetDelay: 1.4  },
  { from: "srv1", to: "pc1",   packetDur: 5.0, packetDelay: 0.5  },
  { from: "pc1",  to: "mob1",  packetDur: 3.8, packetDelay: 1.8  },
  { from: "mob1", to: "pc2",   packetDur: 5.5, packetDelay: 2.5  },
  { from: "pc2",  to: "mob2",  packetDur: 3.0, packetDelay: 0.3  },
  { from: "srv2", to: "mob2",  packetDur: 6.0, packetDelay: 3.2  },
  { from: "srv3", to: "pc2",   packetDur: 4.8, packetDelay: 1.0  },
];

function bezierPath(
  x1: number, y1: number,
  x2: number, y2: number,
  curvature = 0.3
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = mx - dy * curvature;
  const cy = my + dx * curvature;
  return `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;
}

const CONNECTION_PATHS: string[] = CONNECTIONS.map((conn) => {
  const from = NETWORK_NODES.find((n) => n.id === conn.from)!;
  const to   = NETWORK_NODES.find((n) => n.id === conn.to)!;
  return bezierPath(from.x, from.y, to.x, to.y, 0.3);
});

// Midpoint of each bezier at t = 0.5
function bezierMidpt(x1: number, y1: number, x2: number, y2: number, curvature = 0.3) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  return {
    x: 0.25 * x1 + 0.5 * (mx - dy * curvature) + 0.25 * x2,
    y: 0.25 * y1 + 0.5 * (my + dx * curvature) + 0.25 * y2,
  };
}

const CONNECTION_MIDPOINTS = CONNECTIONS.map((c) => {
  const f = NETWORK_NODES.find((n) => n.id === c.from)!;
  const t = NETWORK_NODES.find((n) => n.id === c.to)!;
  return bezierMidpt(f.x, f.y, t.x, t.y, 0.3);
});

const LABEL_TEXTS = [
  "192.168.0.1", "RTT: 2ms", "PING ›", "SYN/ACK",
  "64 bytes",    "TCP 443",  "0xFF3E", "TX: 1.4G",
  "ARP req",     "XFER: OK", "> corex", "256-bit",
];

const labelDelay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ── SVG Node Icons ───────────────────────────────────────────────────

function ServerIcon() {
  return (
    <>
      {/* Chassis body */}
      <rect x="-18" y="-13" width="36" height="26" rx="3"
        fill="rgba(11,15,22,0.9)" stroke="rgba(92,255,177,0.55)" strokeWidth="1.2" />
      {/* Rack ears */}
      <rect x="-22" y="-10" width="4" height="20" rx="1" fill="rgba(92,255,177,0.15)" />
      <rect x="18"  y="-10" width="4" height="20" rx="1" fill="rgba(92,255,177,0.15)" />
      {/* Drive bay stripes */}
      <rect x="-14" y="-8" width="20" height="4" rx="1" fill="rgba(92,255,177,0.08)" />
      <rect x="-14" y="-1" width="20" height="4" rx="1" fill="rgba(92,255,177,0.08)" />
      <rect x="-14" y="6"  width="20" height="4" rx="1" fill="rgba(92,255,177,0.08)" />
      {/* Status LEDs */}
      <circle cx="10" cy="-7" r="2" fill="#5cffb1" className={styles.nodeLed} />
      <circle cx="14" cy="-7" r="2" fill="rgba(92,255,177,0.3)" />
    </>
  );
}

function MonitorIcon() {
  return (
    <>
      {/* Screen bezel */}
      <rect x="-20" y="-16" width="40" height="26" rx="3"
        fill="rgba(11,15,22,0.9)" stroke="rgba(92,255,177,0.5)" strokeWidth="1.2" />
      {/* Screen glow area */}
      <rect x="-16" y="-12" width="32" height="18" rx="2"
        fill="rgba(92,255,177,0.04)" />
      {/* Scan lines inside screen */}
      <line x1="-11" y1="-5" x2="11"  y2="-5" stroke="rgba(92,255,177,0.28)" strokeWidth="0.8" />
      <line x1="-11" y1="0"  x2="7"   y2="0"  stroke="rgba(92,255,177,0.16)" strokeWidth="0.8" />
      <line x1="-11" y1="5"  x2="9"   y2="5"  stroke="rgba(92,255,177,0.12)" strokeWidth="0.8" />
      {/* Stand */}
      <line x1="0" y1="10" x2="0" y2="17"
        stroke="rgba(92,255,177,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Base */}
      <line x1="-8" y1="17" x2="8" y2="17"
        stroke="rgba(92,255,177,0.4)" strokeWidth="1.5" strokeLinecap="round" />
    </>
  );
}

function SmartphoneIcon() {
  return (
    <>
      {/* Body */}
      <rect x="-11" y="-20" width="22" height="40" rx="5"
        fill="rgba(11,15,22,0.9)" stroke="rgba(92,255,177,0.5)" strokeWidth="1.2" />
      {/* Screen area */}
      <rect x="-8" y="-16" width="16" height="28" rx="2"
        fill="rgba(92,255,177,0.04)" />
      {/* Notch pill */}
      <rect x="-3" y="-19" width="6" height="3" rx="1.5"
        fill="rgba(92,255,177,0.25)" />
      {/* Home bar */}
      <line x1="-5" y1="15" x2="5" y2="15"
        stroke="rgba(92,255,177,0.4)" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

// ── FocusBorder ──────────────────────────────────────────────────────
// Draws two SVG paths that animate from bottom-center outward
// (simultaneously left and right) until they meet at top-center.

function FocusBorder({ focused }: { focused: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rightRef = useRef<SVGPathElement>(null);
  const [dims, setDims] = useState<{ w: number; h: number; r: number } | null>(null);
  const [len, setLen] = useState(0);

  // Step 1 — measure the parent wrapper's pixel dimensions
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const parent = svg.parentElement;
    if (!parent) return;
    const measure = () => {
      const rect = parent.getBoundingClientRect();
      if (rect.width === 0) return;
      const inp = parent.querySelector<HTMLElement>("input, textarea");
      const rawR = inp ? parseFloat(getComputedStyle(inp).borderTopLeftRadius) : 8;
      const r = isNaN(rawR) ? 8 : Math.min(rawR, Math.min(rect.width, rect.height) / 2);
      setDims({ w: rect.width, h: rect.height, r });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  // Step 2 — once paths are in the DOM, read the browser's actual path length.
  // useLayoutEffect runs before paint, preventing any visible flash.
  useLayoutEffect(() => {
    if (!dims || !rightRef.current) return;
    const l = rightRef.current.getTotalLength();
    if (l > 0) setLen(l);
  }, [dims]);

  // Before dimensions are known, render a bare SVG so the ref is attached.
  if (!dims) {
    return (
      <svg
        ref={svgRef}
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 3 }}
      />
    );
  }

  const { w, h, r } = dims;
  // `ready` becomes true after getTotalLength() resolves (before first paint with paths).
  const ready = len > 0;
  const dashVal = ready ? len : 9999;
  // dashoffset: len → 0 reveals stroke from P=0 (bottom-center) toward P=len (top-center).
  // dashoffset: 0 → len hides it back the same way on blur.
  const offset  = ready ? (focused ? 0 : len) : 9999;

  const pathStyle: React.CSSProperties = {
    fill: "none",
    // Keep stroke transparent until length is measured to avoid a brief flash.
    stroke: ready ? "var(--accent)" : "none",
    strokeWidth: 1.5,
    strokeLinecap: "butt",
    strokeDasharray: dashVal,
    strokeDashoffset: offset,
    // Strong ease-in-out: starts and ends with bursts of speed.
    transition: ready ? "stroke-dashoffset 0.6s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
  };

  return (
    <svg
      ref={svgRef}
      aria-hidden
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: 3 }}
    >
      {/* Right half: bottom-center → arc BR (sweep=0 = left turn = convex) → right edge → arc TR → top-center */}
      <path
        ref={rightRef}
        d={`M ${w / 2},${h} H ${w - r} A ${r},${r} 0 0 0 ${w},${h - r} V ${r} A ${r},${r} 0 0 0 ${w - r},0 H ${w / 2}`}
        style={pathStyle}
      />
      {/* Left half: bottom-center → arc BL (sweep=1 = right turn = convex) → left edge → arc TL → top-center */}
      <path
        d={`M ${w / 2},${h} H ${r} A ${r},${r} 0 0 1 0,${h - r} V ${r} A ${r},${r} 0 0 1 ${r},0 H ${w / 2}`}
        style={pathStyle}
      />
    </svg>
  );
}

// ── Validation ───────────────────────────────────────────────────────

function validate(fields: FormFields): FormErrors {
  const errs: FormErrors = {};
  if (!fields.name.trim()) errs.name = "Name is required";
  if (!fields.email.trim()) {
    errs.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errs.email = "Enter a valid email address";
  }
  if (!fields.message.trim()) errs.message = "Message is required";
  return errs;
}

// ── Component ────────────────────────────────────────────────────────

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [fields, setFields] = useState<FormFields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [dataLabels, setDataLabels] = useState<DataLabel[]>([]);
  const labelIdRef = useRef(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Floating data labels on network lines ──
  useEffect(() => {
    if (!isVisible) return;
    let cancelled = false;

    async function runLabel() {
      // Stagger initial start randomly
      await labelDelay(Math.random() * 2500);
      while (!cancelled) {
        const connIdx = Math.floor(Math.random() * CONNECTION_MIDPOINTS.length);
        const mid = CONNECTION_MIDPOINTS[connIdx];
        const text = LABEL_TEXTS[Math.floor(Math.random() * LABEL_TEXTS.length)];
        const id = ++labelIdRef.current;

        if (!cancelled) setDataLabels((p) => [...p, { id, text, x: mid.x, y: mid.y, phase: "typing", visibleChars: 0 }]);

        // Type characters one by one
        for (let i = 1; i <= text.length; i++) {
          await labelDelay(80 + Math.random() * 60);
          if (cancelled) return;
          setDataLabels((p) => p.map((l) => l.id === id ? { ...l, visibleChars: i } : l));
        }
        // Idle phase
        if (!cancelled) setDataLabels((p) => p.map((l) => l.id === id ? { ...l, phase: "idle" } : l));
        await labelDelay(1800 + Math.random() * 2500);
        if (cancelled) return;
        // Explode
        setDataLabels((p) => p.map((l) => l.id === id ? { ...l, phase: "exploding" } : l));
        await labelDelay(650);
        if (cancelled) return;
        setDataLabels((p) => p.filter((l) => l.id !== id));
        // Gap before next
        await labelDelay(400 + Math.random() * 1400);
      }
    }

    // Three concurrent runners with staggered starts
    const t1 = setTimeout(() => { if (!cancelled) runLabel(); }, 1800);
    const t2 = setTimeout(() => { if (!cancelled) runLabel(); }, 3800);
    const t3 = setTimeout(() => { if (!cancelled) runLabel(); }, 6500);
    return () => {
      cancelled = true;
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    };
  }, [isVisible]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1500);
  }

  const disabled = status === "sending" || status === "sent";

  return (
    <section className={styles.section} id="contact" ref={sectionRef}>

      {/* ── Network background SVG ── */}
      <div className={styles.networkBg} aria-hidden>
        <svg
          className={styles.networkSvg}
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="contactNodeGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="contactPacketGlow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection lines + data packets */}
          {CONNECTIONS.map((conn, i) => (
            <g key={`edge-${i}`}>
              {/* Base line (always visible, dim) */}
              <path
                d={CONNECTION_PATHS[i]}
                fill="none"
                stroke="rgba(92,255,177,0.10)"
                strokeWidth="0.8"
                vectorEffect="non-scaling-stroke"
              />
              {/* Primary data packet */}
              <circle r="3" fill="rgba(92,255,177,0.9)" filter="url(#contactPacketGlow)">
                <animateMotion
                  dur={`${conn.packetDur}s`}
                  begin={`${conn.packetDelay}s`}
                  repeatCount="indefinite"
                  path={CONNECTION_PATHS[i]}
                />
              </circle>
              {/* Secondary packet on longer connections */}
              {conn.packetDur > 4 && (
                <circle r="2.5" fill="rgba(92,255,177,0.6)" filter="url(#contactPacketGlow)">
                  <animateMotion
                    dur={`${conn.packetDur}s`}
                    begin={`${conn.packetDelay + conn.packetDur / 2}s`}
                    repeatCount="indefinite"
                    path={CONNECTION_PATHS[i]}
                  />
                </circle>
              )}
            </g>
          ))}

          {/* Network nodes */}
          {NETWORK_NODES.map((node, i) => (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              filter="url(#contactNodeGlow)"
            >
              {/* Pulse ring */}
              <circle
                cx="0" cy="0" r="26"
                fill="none"
                stroke="rgba(92,255,177,0.10)"
                strokeWidth="1"
                className={styles.nodePulseRing}
                style={{ animationDelay: `${i * 0.55}s` }}
              />
              {/* Icon */}
              {node.type === "server"     && <ServerIcon />}
              {node.type === "pc"         && <MonitorIcon />}
              {node.type === "smartphone" && <SmartphoneIcon />}
              {/* Label */}
              <text y="38" textAnchor="middle" className={styles.nodeLabel}>
                {node.label}
              </text>
            </g>
          ))}

          {/* ── Floating data labels on connection lines ── */}
          {dataLabels.map((label) => {
            const { id, text, x, y, phase, visibleChars } = label;
            const charW = 6;
            const pillW = text.length * charW + 14;

            if (phase !== "exploding") {
              return (
                <g key={id}>
                  <rect x={x - pillW / 2} y={y - 9} width={pillW} height={16} rx="2.5"
                    fill="rgba(4,6,10,0.88)" stroke="rgba(92,255,177,0.22)" strokeWidth="0.6" />
                  <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                    className={styles.dataLabelText}>
                    {text.slice(0, visibleChars)}
                    {phase === "typing" && <tspan className={styles.typingCursor}>_</tspan>}
                  </text>
                </g>
              );
            }

            // Explosion: scatter each character
            return (
              <g key={id}>
                {text.split("").map((char, i) => {
                  const angle = (i * 137.5) % 360;
                  const dist = 18 + (i * 11) % 28;
                  return (
                    <text
                      key={i}
                      x={x + (i - text.length / 2 + 0.5) * charW}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={styles.dataLabelChar}
                      style={{
                        "--sdx": `${Math.cos(angle * Math.PI / 180) * dist}px`,
                        "--sdy": `${Math.sin(angle * Math.PI / 180) * dist}px`,
                        animationDelay: `${i * 22}ms`,
                      } as React.CSSProperties}
                    >
                      {char}
                    </text>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Main content ── */}
      <div className={styles.content}>

        {/* Section header */}
        <div className={`${styles.sectionHeader} ${isVisible ? styles.visible : ""}`}>
          <span className="eyebrow">Get in Touch</span>
          <h2 className={styles.heading}>Start your build</h2>
          <p className={styles.subheading}>
            Tell us what you need — we&apos;ll spec the perfect system.
          </p>
        </div>

        {/* Form window */}
        <div className={`${styles.glitchFrame} ${isVisible ? styles.active : ""}`}>

          {/* Prism border animation */}
          <svg
            className={styles.borderPulse}
            viewBox="0 0 520 600"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="contactPrism1" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="rgba(92,255,177,0)" />
                <stop offset="30%"  stopColor="rgba(92,255,177,0.15)" />
                <stop offset="48%"  stopColor="rgba(150,255,200,0.7)" />
                <stop offset="50%"  stopColor="rgba(255,255,255,1)" />
                <stop offset="52%"  stopColor="rgba(150,255,200,0.7)" />
                <stop offset="70%"  stopColor="rgba(92,255,177,0.15)" />
                <stop offset="100%" stopColor="rgba(92,255,177,0)" />
              </linearGradient>
              <linearGradient id="contactPrism2" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="rgba(92,255,177,0)" />
                <stop offset="30%"  stopColor="rgba(92,255,177,0.1)" />
                <stop offset="48%"  stopColor="rgba(120,255,190,0.6)" />
                <stop offset="50%"  stopColor="rgba(220,255,240,0.9)" />
                <stop offset="52%"  stopColor="rgba(120,255,190,0.6)" />
                <stop offset="70%"  stopColor="rgba(92,255,177,0.1)" />
                <stop offset="100%" stopColor="rgba(92,255,177,0)" />
              </linearGradient>
              <filter id="contactPrismGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect x="1" y="1" width="518" height="598" rx="16" ry="16"
              fill="none" stroke="url(#contactPrism1)" strokeWidth="1.2"
              strokeDasharray="55 2232" strokeDashoffset="0"
              filter="url(#contactPrismGlow)" className={styles.prismLine1} />
            <rect x="1" y="1" width="518" height="598" rx="16" ry="16"
              fill="none" stroke="url(#contactPrism2)" strokeWidth="0.8"
              strokeDasharray="40 2232" strokeDashoffset="-1116"
              filter="url(#contactPrismGlow)" className={styles.prismLine2} />
          </svg>

          {/* Glitch noise overlay */}
          <div className={styles.glitchOverlay} aria-hidden />

          {/* Corner accents */}
          <div className={styles.frameCorner} data-pos="tl" />
          <div className={styles.frameCorner} data-pos="tr" />
          <div className={styles.frameCorner} data-pos="bl" />
          <div className={styles.frameCorner} data-pos="br" />

          {/* Content */}
          <div className={styles.innerContent}>
            {status === "sent" ? (
              <div className={styles.successState} role="status">
                <div className={styles.successIcon} aria-hidden>✓</div>
                <p className={styles.successTitle}>Message received</p>
                <p className={styles.successSub}>We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <form
                className={styles.form}
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact COREX"
              >
                {/* Name */}
                <div className={`field ${styles.formField}`}>
                  <label htmlFor="contact-name">Name</label>
                  <div
                    className={`${styles.inputWrapper}${focusedField === "name" ? ` ${styles.focused}` : ""}`}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                  >
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      className={`input${errors.name ? " input-error" : ""}`}
                      placeholder="Your name"
                      value={fields.name}
                      onChange={handleChange}
                      disabled={disabled}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                    />
                    <FocusBorder focused={focusedField === "name"} />
                  </div>
                  {errors.name && (
                    <span id="contact-name-error" className={styles.fieldError} role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className={`field ${styles.formField}`}>
                  <label htmlFor="contact-email">Email</label>
                  <div
                    className={`${styles.inputWrapper}${focusedField === "email" ? ` ${styles.focused}` : ""}`}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  >
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      className={`input${errors.email ? " input-error" : ""}`}
                      placeholder="your@email.com"
                      value={fields.email}
                      onChange={handleChange}
                      disabled={disabled}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                    />
                    <FocusBorder focused={focusedField === "email"} />
                  </div>
                  {errors.email && (
                    <span id="contact-email-error" className={styles.fieldError} role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className={`field ${styles.formField}`}>
                  <label htmlFor="contact-message">Message</label>
                  <div
                    className={`${styles.inputWrapper}${focusedField === "message" ? ` ${styles.focused}` : ""}`}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                  >
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      className={`input ${styles.textarea}${errors.message ? " input-error" : ""}`}
                      placeholder="Tell us about your build..."
                      value={fields.message}
                      onChange={handleChange}
                      disabled={disabled}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                    />
                    <FocusBorder focused={focusedField === "message"} />
                  </div>
                  {errors.message && (
                    <span id="contact-message-error" className={styles.fieldError} role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className={`btn btn-primary ${styles.submitBtn}`}
                  disabled={disabled}
                  aria-busy={status === "sending"}
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <span className={styles.submitArrow} aria-hidden>→</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
