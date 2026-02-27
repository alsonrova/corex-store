"use client";

import styles from "./HeroShowcase.module.css";

export default function HeroShowcase() {
  return (
    <section className={styles.hero} id="hero">
      {/* ECG Heartbeat line behind */}
      <div className={styles.ecgContainer} aria-hidden>
        <svg className={styles.ecgSvg} viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path
            className={styles.ecgPath}
            d="M0,50 L200,50 L220,50 L240,20 L260,80 L280,10 L300,90 L320,50 L340,50 L600,50 L620,50 L640,25 L660,75 L680,15 L700,85 L720,50 L740,50 L1000,50 L1020,50 L1040,30 L1060,70 L1080,20 L1100,80 L1120,50 L1200,50"
            fill="none"
            stroke="rgba(92, 255, 177, 0.15)"
            strokeWidth="2"
          />
          <path
            className={styles.ecgPathGlow}
            d="M0,50 L200,50 L220,50 L240,20 L260,80 L280,10 L300,90 L320,50 L340,50 L600,50 L620,50 L640,25 L660,75 L680,15 L700,85 L720,50 L740,50 L1000,50 L1020,50 L1040,30 L1060,70 L1080,20 L1100,80 L1120,50 L1200,50"
            fill="none"
            stroke="rgba(92, 255, 177, 0.4)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Logo frame with rotating lights */}
      <div className={styles.logoFrame}>
        <div className={styles.frameOuter}>
          <div className={styles.rotatingLight1} />
          <div className={styles.rotatingLight2} />
        </div>
        <div className={styles.frameInner}>
          <h1 className={styles.logoText}>
            <span className={styles.logoCorex}>Corex</span>
            <span className={styles.logoStore}>Store</span>
          </h1>
        </div>
      </div>

      {/* Tagline */}
      <div className={styles.tagline}>
        <p className={styles.slogan}>Power at the Core</p>
        <p className={styles.subtitle}>
          Engineered for those who build without compromise.
        </p>
      </div>

      {/* CTA */}
      <div className={styles.ctaBlock}>
        <a className={styles.ctaPrimary} href="/shop">
          Explore the store
        </a>
        <a className={styles.ctaSecondary} href="#concept">
          Discover the vision
        </a>
      </div>
    </section>
  );
}
