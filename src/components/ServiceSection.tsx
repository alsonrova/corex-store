"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./ServiceSection.module.css";

const steps = [
  {
    id: "order",
    number: "01",
    title: "Order",
    description: "Select your components through our curated catalog. Our system validates compatibility and optimizes your build configuration in real-time.",
    image: "/step1.png",
  },
  {
    id: "build",
    number: "02",
    title: "Build",
    description: "Expert technicians assemble your system in our certified lab. Every connection is tested, every component stress-validated.",
    image: "/step2.png",
  },
  {
    id: "delivery",
    number: "03",
    title: "Delivery",
    description: "Secure packaging with real-time tracking. Your system arrives ready to deploy, with full documentation and warranty activation.",
    image: "/step3.png",
  },
];

export default function ServiceSection() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [litSteps, setLitSteps] = useState<string[]>([]);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [glitchIndex, setGlitchIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const titleText = "SERVICE PIPELINE";

  // Track if hover is active (separate from glitchIndex to allow priority)
  const [isHovering, setIsHovering] = useState(false);
  const [temperature, setTemperature] = useState(32);

  // Simulate temperature based on animation phase
  useEffect(() => {
    const baseTemp = 32;
    const targetTemp = animationPhase === 0 ? baseTemp : 
                       animationPhase === 1 ? 38 : 
                       animationPhase === 2 ? 45 : 52;
    
    // Smooth temperature transition
    const tempInterval = setInterval(() => {
      setTemperature(prev => {
        if (Math.abs(prev - targetTemp) < 0.5) return targetTemp;
        return prev + (targetTemp > prev ? 0.8 : -0.8);
      });
    }, 100);

    return () => clearInterval(tempInterval);
  }, [animationPhase]);

  // Auto-glitch effect every 10 seconds on a random letter (only if not hovering)
  useEffect(() => {
    const triggerRandomGlitch = () => {
      if (isHovering) return; // Don't trigger if user is hovering
      
      // Get indices of non-space characters only
      const validIndices = titleText.split("").map((char, i) => char !== " " ? i : -1).filter(i => i !== -1);
      const randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
      setGlitchIndex(randomIndex);
      
      // Clear the glitch after 500ms
      setTimeout(() => {
        setGlitchIndex((current) => current === randomIndex ? null : current);
      }, 500);
    };

    const interval = setInterval(triggerRandomGlitch, 10000);
    
    // Trigger once on mount after a short delay
    const initialTimeout = setTimeout(triggerRandomGlitch, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [isHovering]);

  // Looping animation - lights up steps progressively in a cycle
  // Phase 0: all off, Phase 1: step 1 lit, Phase 2: steps 1+2 lit, Phase 3: steps 1+2+3 lit
  useEffect(() => {
    const phaseDurations = [800, 1200, 1200, 10000]; // Duration for each phase in ms (phase 3 = 10s)
    
    const advancePhase = () => {
      setAnimationPhase((prev) => (prev + 1) % 4);
    };

    const timer = setTimeout(advancePhase, phaseDurations[animationPhase]);

    // Update lit steps based on current phase
    const phaseSteps: string[][] = [
      [],                                    // Phase 0: all off
      ["order"],                             // Phase 1: step 1
      ["order", "build"],                    // Phase 2: steps 1+2
      ["order", "build", "delivery"],        // Phase 3: steps 1+2+3
    ];
    setLitSteps(phaseSteps[animationPhase]);

    return () => clearTimeout(timer);
  }, [animationPhase]);

  // Calculate flow progress based on animation phase
  const flowProgress = animationPhase === 0 ? 0 : animationPhase === 1 ? 0.35 : animationPhase === 2 ? 0.7 : 1;

  // Typing effect for description
  useEffect(() => {
    if (typingRef.current) {
      clearTimeout(typingRef.current);
    }

    if (!activeStep) {
      setTypedText("");
      setIsTyping(false);
      return;
    }

    const step = steps.find((s) => s.id === activeStep);
    if (!step) return;

    const text = step.description;
    setTypedText("");
    setIsTyping(true);

    let index = 0;
    const typeChar = () => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1));
        index++;
        typingRef.current = setTimeout(typeChar, 18);
      } else {
        setIsTyping(false);
      }
    };

    // Small delay before starting to type
    typingRef.current = setTimeout(typeChar, 100);

    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, [activeStep]);

  const handleMouseEnter = (stepId: string) => {
    setActiveStep(stepId);
  };

  const handleMouseLeave = () => {
    setActiveStep(null);
  };

  return (
    <section className={styles.section} id="service" ref={sectionRef}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.eyebrowWrapper}>
            <div className={styles.cryptoTextTrack}>
              <span className={styles.cryptoText}>◆ SYS.INIT ◆ PROCESS.RUN ◆ BUILD.EXEC ◆ DEPLOY.OK ◆ VERIFY.PASS ◆ CORE.ACTIVE ◆ SYS.INIT ◆ PROCESS.RUN ◆ BUILD.EXEC ◆ DEPLOY.OK ◆ VERIFY.PASS ◆ CORE.ACTIVE ◆</span>
            </div>
            <p className={styles.eyebrow}>Process</p>
          </div>
          <h2 className={styles.title}>
            <span className={styles.titleAccent}>Our</span>{" "}
            <span className={styles.glitchTitle}>
              {titleText.split("").map((char, index) => (
                <span
                  key={index}
                  className={`${styles.glitchChar} ${glitchIndex === index && char !== " " ? styles.glitching : ""}`}
                  onMouseEnter={() => { if (char !== " ") { setIsHovering(true); setGlitchIndex(index); } }}
                  onMouseLeave={() => { setIsHovering(false); setGlitchIndex(null); }}
                  data-char={char}
                >
                  {char === " " ? "\u00A0" : char}
                  {glitchIndex === index && char !== " " && (
                    <>
                      <span className={styles.glitchPixel} style={{ top: '15%', left: '5%' }} />
                      <span className={styles.glitchPixel} style={{ top: '65%', left: '85%' }} />
                      <span className={styles.glitchPixel} style={{ top: '35%', left: '25%' }} />
                      <span className={styles.glitchPixel} style={{ top: '85%', left: '55%' }} />
                      <span className={styles.glitchPixel} style={{ top: '5%', left: '75%' }} />
                      <span className={styles.glitchPixel} style={{ top: '50%', left: '0%' }} />
                      <span className={styles.glitchPixel} style={{ top: '25%', left: '95%' }} />
                      <span className={styles.glitchPixel} style={{ top: '75%', left: '15%' }} />
                    </>
                  )}
                </span>
              ))}
            </span>
          </h2>
          <p className={styles.subtitle}>From order to delivery, experience seamless precision</p>
        </div>

        {/* Pipeline Container */}
        <div className={styles.pipeline}>
          {/* Watercooling tube system - diagonal layout */}
          <div className={styles.tubeContainer}>
            <svg className={styles.tubeSvg} viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet">
              <defs>
                {/* Tube outer gradient - glass-like appearance */}
                <linearGradient id="tubeOuter" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(92, 255, 177, 0.15)" />
                  <stop offset="50%" stopColor="rgba(92, 255, 177, 0.05)" />
                  <stop offset="100%" stopColor="rgba(92, 255, 177, 0.12)" />
                </linearGradient>
                
                {/* Tube inner - darker core */}
                <linearGradient id="tubeInner" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(4, 8, 16, 0.9)" />
                  <stop offset="50%" stopColor="rgba(8, 12, 20, 0.95)" />
                  <stop offset="100%" stopColor="rgba(4, 8, 16, 0.9)" />
                </linearGradient>
                
                {/* Coolant liquid gradient */}
                <linearGradient id="coolantGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(92, 255, 177, 0.6)" />
                  <stop offset="50%" stopColor="rgba(122, 255, 196, 0.8)" />
                  <stop offset="100%" stopColor="rgba(92, 255, 177, 0.6)" />
                </linearGradient>
                
                {/* Glow filter for liquid */}
                <filter id="liquidGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                {/* Bubble glow */}
                <filter id="bubbleGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                {/* Fitting metallic gradient */}
                <linearGradient id="fittingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(92, 255, 177, 0.4)" />
                  <stop offset="50%" stopColor="rgba(92, 255, 177, 0.15)" />
                  <stop offset="100%" stopColor="rgba(92, 255, 177, 0.3)" />
                </linearGradient>
              </defs>
              
              {/* Tube path - Step 1 to Step 2 */}
              {/* Exit from middle-right of Step 1, go right, then down with rounded corner, then right to Step 2 */}
              <g className={styles.tubeSegment}>
                {/* Outer tube (glass) */}
                <path
                  d="M 270 120 L 340 120 Q 370 120 370 150 L 370 320 Q 370 350 400 350 L 430 350"
                  stroke="url(#tubeOuter)"
                  strokeWidth="14"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Inner tube (dark core) */}
                <path
                  d="M 270 120 L 340 120 Q 370 120 370 150 L 370 320 Q 370 350 400 350 L 430 350"
                  stroke="url(#tubeInner)"
                  strokeWidth="9"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Flowing coolant */}
                <path
                  d="M 270 120 L 340 120 Q 370 120 370 150 L 370 320 Q 370 350 400 350 L 430 350"
                  stroke="url(#coolantGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#liquidGlow)"
                  strokeDasharray="12 20"
                  style={{ 
                    opacity: flowProgress > 0.2 ? 0.9 : 0.1,
                    transition: 'opacity 0.6s ease'
                  }}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-32"
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
              
              {/* Tube path - Step 2 to Step 3 */}
              {/* Exit from middle-right of Step 2, go right, then down with rounded corner, then right to Step 3 */}
              <g className={styles.tubeSegment}>
                {/* Outer tube (glass) */}
                <path
                  d="M 570 350 L 640 350 Q 670 350 670 380 L 670 550 Q 670 580 700 580 L 730 580"
                  stroke="url(#tubeOuter)"
                  strokeWidth="14"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Inner tube (dark core) */}
                <path
                  d="M 570 350 L 640 350 Q 670 350 670 380 L 670 550 Q 670 580 700 580 L 730 580"
                  stroke="url(#tubeInner)"
                  strokeWidth="9"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Flowing coolant */}
                <path
                  d="M 570 350 L 640 350 Q 670 350 670 380 L 670 550 Q 670 580 700 580 L 730 580"
                  stroke="url(#coolantGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#liquidGlow)"
                  strokeDasharray="12 20"
                  style={{ 
                    opacity: flowProgress > 0.6 ? 0.9 : 0.1,
                    transition: 'opacity 0.6s ease'
                  }}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-32"
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
              
              {/* Return tube - Step 3 UP to Step 1 (following red line path) */}
              {/* Exit from bottom-left of Step 3, go down, turn left, go along bottom, turn up to bottom-left of Step 1 */}
              <g className={styles.tubeSegment}>
                {/* Outer tube (glass) */}
                <path
                  d="M 900 620 L 900 680 Q 900 710 870 710 L 130 710 Q 100 710 100 680 L 100 180"
                  stroke="url(#tubeOuter)"
                  strokeWidth="14"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Inner tube (dark core) */}
                <path
                  d="M 900 620 L 900 680 Q 900 710 870 710 L 130 710 Q 100 710 100 680 L 100 180"
                  stroke="url(#tubeInner)"
                  strokeWidth="9"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Flowing coolant - return flow (3 to 1) */}
                <path
                  d="M 900 620 L 900 680 Q 900 710 870 710 L 130 710 Q 100 710 100 680 L 100 180"
                  stroke="url(#coolantGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#liquidGlow)"
                  strokeDasharray="12 20"
                  style={{ 
                    opacity: flowProgress > 0.9 ? 0.9 : 0.1,
                    transition: 'opacity 0.6s ease'
                  }}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-32"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
              
              {/* Animated bubbles/particles in the coolant - always rendered, opacity controlled */}
              <g className={styles.bubbles} filter="url(#bubbleGlow)">
                {/* Segment 1 bubbles */}
                <g style={{ opacity: flowProgress > 0.2 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                  <circle className={styles.bubble1} r="3" fill="var(--accent-strong)">
                    <animateMotion
                      dur="2.5s"
                      repeatCount="indefinite"
                      path="M 270 120 L 340 120 Q 370 120 370 150 L 370 320 Q 370 350 400 350 L 430 350"
                    />
                  </circle>
                  <circle className={styles.bubble2} r="2.5" fill="var(--accent)">
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      begin="0.6s"
                      path="M 270 120 L 340 120 Q 370 120 370 150 L 370 320 Q 370 350 400 350 L 430 350"
                    />
                  </circle>
                  <circle className={styles.bubble3} r="2" fill="rgba(122, 255, 196, 0.8)">
                    <animateMotion
                      dur="3.5s"
                      repeatCount="indefinite"
                      begin="1.2s"
                      path="M 270 120 L 340 120 Q 370 120 370 150 L 370 320 Q 370 350 400 350 L 430 350"
                    />
                  </circle>
                </g>
                {/* Segment 2 bubbles */}
                <g style={{ opacity: flowProgress > 0.6 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                  <circle className={styles.bubble1} r="3" fill="var(--accent-strong)">
                    <animateMotion
                      dur="2.8s"
                      repeatCount="indefinite"
                      path="M 570 350 L 640 350 Q 670 350 670 380 L 670 550 Q 670 580 700 580 L 730 580"
                    />
                  </circle>
                  <circle className={styles.bubble2} r="2.5" fill="var(--accent)">
                    <animateMotion
                      dur="3.2s"
                      repeatCount="indefinite"
                      begin="0.5s"
                      path="M 570 350 L 640 350 Q 670 350 670 380 L 670 550 Q 670 580 700 580 L 730 580"
                    />
                  </circle>
                  <circle className={styles.bubble3} r="2" fill="rgba(122, 255, 196, 0.8)">
                    <animateMotion
                      dur="3.8s"
                      repeatCount="indefinite"
                      begin="1s"
                      path="M 570 350 L 640 350 Q 670 350 670 380 L 670 550 Q 670 580 700 580 L 730 580"
                    />
                  </circle>
                </g>
                {/* Return tube bubbles (Step 3 UP to Step 1) */}
                <g style={{ opacity: flowProgress > 0.9 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                  <circle className={styles.bubble1} r="3" fill="var(--accent-strong)">
                    <animateMotion
                      dur="5s"
                      repeatCount="indefinite"
                      path="M 900 620 L 900 680 Q 900 710 870 710 L 130 710 Q 100 710 100 680 L 100 180"
                    />
                  </circle>
                  <circle className={styles.bubble2} r="2.5" fill="var(--accent)">
                    <animateMotion
                      dur="5.5s"
                      repeatCount="indefinite"
                      begin="1s"
                      path="M 900 620 L 900 680 Q 900 710 870 710 L 130 710 Q 100 710 100 680 L 100 180"
                    />
                  </circle>
                  <circle className={styles.bubble3} r="2" fill="rgba(122, 255, 196, 0.8)">
                    <animateMotion
                      dur="6s"
                      repeatCount="indefinite"
                      begin="2s"
                      path="M 900 620 L 900 680 Q 900 710 870 710 L 130 710 Q 100 710 100 680 L 100 180"
                    />
                  </circle>
                </g>
              </g>
              
              {/* Connection fittings at tube junctions */}
              {/* Fitting at Step 1 exit (right side) */}
              <g className={`${styles.fitting} ${litSteps.includes("order") ? styles.fittingLit : ""}`}>
                <rect x="258" y="110" width="20" height="20" rx="3" fill="var(--panel-strong)" stroke="url(#fittingGradient)" strokeWidth="2" />
                <rect x="263" y="115" width="10" height="10" rx="2" fill={litSteps.includes("order") ? "var(--accent)" : "rgba(92, 255, 177, 0.2)"} className={litSteps.includes("order") ? styles.fittingCore : ""} />
              </g>
              
              {/* Fitting at Step 1 exit for return tube (bottom-left) */}
              <g className={`${styles.fitting} ${litSteps.includes("order") ? styles.fittingLit : ""}`}>
                <rect x="90" y="170" width="20" height="20" rx="3" fill="var(--panel-strong)" stroke="url(#fittingGradient)" strokeWidth="2" />
                <rect x="95" y="175" width="10" height="10" rx="2" fill={litSteps.includes("order") ? "var(--accent)" : "rgba(92, 255, 177, 0.2)"} className={litSteps.includes("order") ? styles.fittingCore : ""} />
              </g>
              
              {/* Fitting at Step 2 entry (left side) */}
              <g className={`${styles.fitting} ${litSteps.includes("build") ? styles.fittingLit : ""}`}>
                <rect x="422" y="340" width="20" height="20" rx="3" fill="var(--panel-strong)" stroke="url(#fittingGradient)" strokeWidth="2" />
                <rect x="427" y="345" width="10" height="10" rx="2" fill={litSteps.includes("build") ? "var(--accent)" : "rgba(92, 255, 177, 0.2)"} className={litSteps.includes("build") ? styles.fittingCore : ""} />
              </g>
              
              {/* Fitting at Step 2 exit (right side) */}
              <g className={`${styles.fitting} ${litSteps.includes("build") ? styles.fittingLit : ""}`}>
                <rect x="558" y="340" width="20" height="20" rx="3" fill="var(--panel-strong)" stroke="url(#fittingGradient)" strokeWidth="2" />
                <rect x="563" y="345" width="10" height="10" rx="2" fill={litSteps.includes("build") ? "var(--accent)" : "rgba(92, 255, 177, 0.2)"} className={litSteps.includes("build") ? styles.fittingCore : ""} />
              </g>
              
              {/* Fitting at Step 3 entry (left side) */}
              <g className={`${styles.fitting} ${litSteps.includes("delivery") ? styles.fittingLit : ""}`}>
                <rect x="722" y="570" width="20" height="20" rx="3" fill="var(--panel-strong)" stroke="url(#fittingGradient)" strokeWidth="2" />
                <rect x="727" y="575" width="10" height="10" rx="2" fill={litSteps.includes("delivery") ? "var(--accent)" : "rgba(92, 255, 177, 0.2)"} className={litSteps.includes("delivery") ? styles.fittingCore : ""} />
              </g>
              
              {/* Fitting at Step 3 entry for return tube (bottom-left of Step 3) */}
              <g className={`${styles.fitting} ${litSteps.includes("delivery") ? styles.fittingLit : ""}`}>
                <rect x="890" y="610" width="20" height="20" rx="3" fill="var(--panel-strong)" stroke="url(#fittingGradient)" strokeWidth="2" />
                <rect x="895" y="615" width="10" height="10" rx="2" fill={litSteps.includes("delivery") ? "var(--accent)" : "rgba(92, 255, 177, 0.2)"} className={litSteps.includes("delivery") ? styles.fittingCore : ""} />
              </g>
            </svg>
          </div>

          {/* Temperature Dashboard Panel */}
          <div className={styles.tempDashboard}>
            <div className={styles.dashboardHeader}>
              <span className={styles.dashboardIcon}>◈</span>
              <span className={styles.dashboardTitle}>COOLANT MONITOR</span>
              <span className={`${styles.statusDot} ${animationPhase > 0 ? styles.statusActive : ""}`} />
            </div>
            
            <div className={styles.dashboardBody}>
              <div className={styles.tempDisplay}>
                <div className={styles.tempValue}>
                  <span className={styles.tempNumber}>{temperature.toFixed(1)}</span>
                  <span className={styles.tempUnit}>°C</span>
                </div>
                <div className={styles.tempLabel}>CORE TEMP</div>
              </div>
              
              <div className={styles.tempGauge}>
                <div className={styles.gaugeTrack}>
                  <div 
                    className={styles.gaugeFill} 
                    style={{ 
                      height: `${Math.min(100, ((temperature - 20) / 50) * 100)}%`,
                      background: temperature > 50 ? 'linear-gradient(to top, var(--accent), #ff6b6b)' : 
                                  temperature > 40 ? 'linear-gradient(to top, var(--accent), #ffd93d)' : 
                                  'var(--accent)'
                    }} 
                  />
                </div>
                <div className={styles.gaugeLabels}>
                  <span>70°</span>
                  <span>50°</span>
                  <span>30°</span>
                </div>
              </div>
            </div>
            
            <div className={styles.dashboardStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>FLOW</span>
                <span className={styles.statValue}>{animationPhase > 0 ? "2.4" : "0.0"} L/m</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>PRESSURE</span>
                <span className={styles.statValue}>{animationPhase > 0 ? "1.2" : "0.0"} bar</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>STATUS</span>
                <span className={`${styles.statValue} ${styles.statStatus}`}>
                  {animationPhase === 0 ? "IDLE" : animationPhase === 3 ? "OPTIMAL" : "ACTIVE"}
                </span>
              </div>
            </div>
            
            <div className={styles.dashboardFooter}>
              <div className={styles.scanLine} />
              <span className={styles.footerText}>SYS.COOLING.v2.4</span>
            </div>
          </div>

          {/* Steps */}
          <div className={styles.stepsGrid}>
            {steps.map((step) => (
              <div
                key={step.id}
                className={`${styles.stepCard} ${litSteps.includes(step.id) ? styles.lit : ""} ${activeStep === step.id ? styles.active : ""}`}
                onMouseEnter={() => handleMouseEnter(step.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Frame container */}
                <div className={styles.frame}>
                  <div className={styles.frameCorner} data-position="top-left" />
                  <div className={styles.frameCorner} data-position="top-right" />
                  <div className={styles.frameCorner} data-position="bottom-left" />
                  <div className={styles.frameCorner} data-position="bottom-right" />
                  
                  {/* Visual with image */}
                  <div className={styles.visual}>
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className={styles.stepImage}
                    />
                    <div className={styles.visualOverlay}>
                      <span className={styles.stepNumber}>{step.number}</span>
                      <div className={styles.scanLine} />
                    </div>
                  </div>
                </div>

                {/* Step title - always visible */}
                <div className={styles.stepInfo}>
                  <span className={styles.stepIndicator}>[{step.number}]</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                </div>

                {/* HUD Overlay - appears on hover */}
                <div className={`${styles.hudOverlay} ${activeStep === step.id ? styles.visible : ""}`}>
                  <div className={styles.hudFrame}>
                    <div className={styles.hudHeader}>
                      <span className={styles.hudIcon}>◈</span>
                      <span className={styles.hudLabel}>SYSTEM.INFO</span>
                      <span className={styles.hudStatus}>●</span>
                    </div>
                    <div className={styles.hudContent}>
                      <p className={styles.hudText}>
                        {typedText}
                        {isTyping && <span className={styles.cursor}>▊</span>}
                      </p>
                    </div>
                    <div className={styles.hudFooter}>
                      <span className={styles.hudMeta}>COREX.PIPELINE.{step.id.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
