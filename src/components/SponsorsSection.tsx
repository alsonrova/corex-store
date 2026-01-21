"use client";

import { useState, useEffect, useRef } from "react";
import SponsorsBanner from "./SponsorsBanner";
import styles from "./SponsorsSection.module.css";

const partners = [
  { id: "cpu", name: "CoreTech Industries", zone: "CPU Socket", description: "High-performance processors" },
  { id: "gpu", name: "NeonForge Graphics", zone: "GPU Lane", description: "Next-gen visual computing" },
  { id: "ram", name: "SwiftMemory Co.", zone: "Memory Slots", description: "Ultra-low latency DDR5" },
  { id: "power", name: "VoltStream Systems", zone: "Power Delivery", description: "Stable power solutions" },
  { id: "storage", name: "DataCore Storage", zone: "M.2 Slots", description: "Gen5 NVMe technology" },
  { id: "cooling", name: "ArcticFlow Thermal", zone: "VRM Heatsinks", description: "Advanced thermal management" },
];

export default function SponsorsSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [visiblePartners, setVisiblePartners] = useState<string[]>([]);
  const [showSponsors, setShowSponsors] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Check if section is active (top of section is at or above viewport top)
      // and bottom of section is still below viewport bottom
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      
      const active = sectionTop <= 0 && sectionBottom > windowHeight;
      const atBottom = sectionTop < 0 && sectionBottom <= windowHeight;
      
      setIsActive(active);
      setIsAtBottom(atBottom);
      
      if (!active && !atBottom) {
        if (sectionTop > 0) {
          // Section hasn't been reached yet
          setScrollProgress(0);
          setVisiblePartners([]);
          setShowSponsors(false);
        }
        return;
      }

      if (atBottom) {
        // Section is at bottom - show final state
        setScrollProgress(1);
        setVisiblePartners(partners.map(p => p.id));
        setShowSponsors(true);
        return;
      }

      // Calculate progress: 0 when section top hits viewport top, 1 when almost done
      const scrollableDistance = sectionHeight - windowHeight;
      const progress = Math.min(Math.abs(sectionTop) / scrollableDistance, 1);
      
      setScrollProgress(progress);

      // Reveal partners at different scroll points
      const partnerThresholds = [0.05, 0.15, 0.28, 0.40, 0.52, 0.64];
      const newVisible = partners
        .filter((_, i) => progress >= partnerThresholds[i])
        .map(p => p.id);
      setVisiblePartners(newVisible);

      // Show sponsors at the end
      setShowSponsors(progress >= 0.78);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate transforms based on scroll - much bigger initial zoom
  const scale = 2.2 - (scrollProgress * 1.2); // 2.2 -> 1.0
  const rotateX = 35 - (scrollProgress * 35); // 35deg -> 0deg
  const rotateY = -12 + (scrollProgress * 12); // -12deg -> 0deg
  const translateY = -15 + (scrollProgress * 15); // Start slightly up

  return (
    <section className={styles.section} id="sponsors" ref={sectionRef}>
      {/* Fixed overlay that appears when section is active, becomes static when at bottom */}
      <div className={`${styles.fixedOverlay} ${isActive ? styles.active : ""} ${isAtBottom ? styles.atBottom : ""}`}>
        {/* Section header */}
        <div className={styles.sectionHeader} style={{ opacity: Math.max(0, 1 - scrollProgress * 2.5) }}>
          <p className={styles.eyebrow}>Ecosystem</p>
          <h2 className={styles.title}>Producers & Partners</h2>
          <p className={styles.subtitle}>The technological backbone of COREX</p>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator} style={{ opacity: Math.max(0, 1 - scrollProgress * 3) }}>
          <span>Scroll to explore</span>
          <div className={styles.scrollArrow}>↓</div>
        </div>

        {/* Motherboard scene */}
        <div className={styles.scene}>
          <div 
            className={styles.motherboard}
            style={{
              transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale}) translateY(${translateY}%)`,
            }}
          >
            {/* SVG Motherboard */}
            <svg className={styles.boardSvg} viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="traceGradSponsors" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(92, 255, 177, 0.1)" />
                  <stop offset="50%" stopColor="rgba(92, 255, 177, 0.4)" />
                  <stop offset="100%" stopColor="rgba(92, 255, 177, 0.1)" />
                </linearGradient>
                <filter id="boardGlowSponsors">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Board background */}
              <rect x="50" y="50" width="900" height="600" rx="8" 
                fill="rgba(12, 16, 24, 0.95)" 
                stroke="rgba(92, 255, 177, 0.2)" 
                strokeWidth="2"
              />

              {/* Main circuit traces */}
              <g className={styles.traces} filter="url(#boardGlowSponsors)">
                <line x1="100" y1="150" x2="900" y2="150" stroke="url(#traceGradSponsors)" strokeWidth="1.5" />
                <line x1="100" y1="350" x2="900" y2="350" stroke="url(#traceGradSponsors)" strokeWidth="1.5" />
                <line x1="100" y1="550" x2="900" y2="550" stroke="url(#traceGradSponsors)" strokeWidth="1.5" />
                <line x1="200" y1="100" x2="200" y2="600" stroke="url(#traceGradSponsors)" strokeWidth="1.5" />
                <line x1="500" y1="100" x2="500" y2="600" stroke="url(#traceGradSponsors)" strokeWidth="1.5" />
                <line x1="800" y1="100" x2="800" y2="600" stroke="url(#traceGradSponsors)" strokeWidth="1.5" />
                <path d="M250,200 L350,200 L350,300 L450,300" stroke="rgba(92, 255, 177, 0.5)" strokeWidth="1" fill="none" />
                <path d="M250,250 L300,250 L300,320 L400,320" stroke="rgba(92, 255, 177, 0.3)" strokeWidth="1" fill="none" />
                <path d="M550,400 L700,400 L700,500 L850,500" stroke="rgba(92, 255, 177, 0.5)" strokeWidth="1" fill="none" />
                <path d="M600,450 L750,450 L750,480" stroke="rgba(92, 255, 177, 0.3)" strokeWidth="1" fill="none" />
                <path d="M700,150 L700,280" stroke="rgba(92, 255, 177, 0.4)" strokeWidth="1" fill="none" />
                <path d="M720,150 L720,280" stroke="rgba(92, 255, 177, 0.4)" strokeWidth="1" fill="none" />
                <path d="M740,150 L740,280" stroke="rgba(92, 255, 177, 0.4)" strokeWidth="1" fill="none" />
                <path d="M760,150 L760,280" stroke="rgba(92, 255, 177, 0.4)" strokeWidth="1" fill="none" />
                <path d="M100,200 L180,200 L180,400 L100,400" stroke="rgba(92, 255, 177, 0.5)" strokeWidth="2" fill="none" />
                <path d="M550,550 L550,480 L650,480" stroke="rgba(92, 255, 177, 0.4)" strokeWidth="1" fill="none" />
              </g>

              {/* CPU Socket */}
              <g>
                <rect x="280" y="180" width="140" height="140" rx="4" fill="rgba(18, 22, 32, 0.9)" stroke="rgba(92, 255, 177, 0.4)" strokeWidth="2"/>
                <rect x="300" y="200" width="100" height="100" rx="2" fill="rgba(25, 30, 40, 0.9)" stroke="rgba(92, 255, 177, 0.2)" strokeWidth="1"/>
                {Array.from({ length: 5 }).map((_, i) =>
                  Array.from({ length: 5 }).map((_, j) => (
                    <circle key={`pin-${i}-${j}`} cx={315 + i * 18} cy={215 + j * 18} r="3" fill="rgba(92, 255, 177, 0.3)"/>
                  ))
                )}
              </g>

              {/* GPU Slot */}
              <g>
                <rect x="550" y="380" width="300" height="60" rx="4" fill="rgba(18, 22, 32, 0.9)" stroke="rgba(92, 255, 177, 0.4)" strokeWidth="2"/>
                <rect x="560" y="390" width="280" height="40" rx="2" fill="rgba(22, 27, 38, 0.9)" stroke="rgba(92, 255, 177, 0.2)" strokeWidth="1"/>
                {Array.from({ length: 16 }).map((_, i) => (
                  <rect key={`pcie-${i}`} x={570 + i * 16} y="400" width="10" height="20" rx="1" fill="rgba(92, 255, 177, 0.2)"/>
                ))}
              </g>

              {/* RAM Slots */}
              <g>
                {Array.from({ length: 4 }).map((_, i) => (
                  <g key={`ram-${i}`}>
                    <rect x={690 + i * 25} y="120" width="18" height="180" rx="2" fill="rgba(18, 22, 32, 0.9)" stroke="rgba(92, 255, 177, 0.4)" strokeWidth="1"/>
                    <rect x={693 + i * 25} y="140" width="12" height="140" rx="1" fill="rgba(92, 255, 177, 0.15)"/>
                  </g>
                ))}
              </g>

              {/* Power Delivery */}
              <g>
                <rect x="100" y="180" width="80" height="250" rx="4" fill="rgba(18, 22, 32, 0.9)" stroke="rgba(92, 255, 177, 0.4)" strokeWidth="2"/>
                {Array.from({ length: 8 }).map((_, i) => (
                  <rect key={`vrm-${i}`} x="110" y={195 + i * 28} width="60" height="20" rx="2" fill="rgba(92, 255, 177, 0.2)" stroke="rgba(92, 255, 177, 0.3)" strokeWidth="1"/>
                ))}
              </g>

              {/* M.2 Storage */}
              <g>
                <rect x="480" y="500" width="120" height="30" rx="3" fill="rgba(18, 22, 32, 0.9)" stroke="rgba(92, 255, 177, 0.4)" strokeWidth="1.5"/>
                <rect x="490" y="507" width="100" height="16" rx="2" fill="rgba(92, 255, 177, 0.15)"/>
              </g>

              {/* Chipset */}
              <g>
                <rect x="380" y="450" width="80" height="80" rx="4" fill="rgba(18, 22, 32, 0.9)" stroke="rgba(92, 255, 177, 0.4)" strokeWidth="2"/>
                <circle cx="420" cy="490" r="25" fill="rgba(22, 27, 38, 0.9)" stroke="rgba(92, 255, 177, 0.3)" strokeWidth="1"/>
                <circle cx="420" cy="490" r="15" fill="rgba(92, 255, 177, 0.1)"/>
              </g>

              {/* Corner mounting holes */}
              <circle cx="80" cy="80" r="8" fill="none" stroke="rgba(92, 255, 177, 0.3)" strokeWidth="2" />
              <circle cx="920" cy="80" r="8" fill="none" stroke="rgba(92, 255, 177, 0.3)" strokeWidth="2" />
              <circle cx="80" cy="620" r="8" fill="none" stroke="rgba(92, 255, 177, 0.3)" strokeWidth="2" />
              <circle cx="920" cy="620" r="8" fill="none" stroke="rgba(92, 255, 177, 0.3)" strokeWidth="2" />
            </svg>

            {/* Partner overlays */}
            {partners.map((partner) => (
              <div 
                key={partner.id}
                className={`${styles.partnerCard} ${styles[partner.id]} ${visiblePartners.includes(partner.id) ? styles.visible : ""}`}
              >
                <div className={styles.partnerZone}>{partner.zone}</div>
                <div className={styles.partnerName}>{partner.name}</div>
                <div className={styles.partnerDesc}>{partner.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress indicator */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ height: `${scrollProgress * 100}%` }} />
        </div>

        {/* Sponsor banner with infinite scroll */}
        <div className={`${styles.sponsorBandWrapper} ${showSponsors ? styles.visible : ""}`}>
          <SponsorsBanner />
        </div>
      </div>
    </section>
  );
}
