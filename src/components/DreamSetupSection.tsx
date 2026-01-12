"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "./DreamSetupSection.module.css";

const images = [
  "/vecteezy_modern-gaming-pc-isolated-on-transparent_48412735.png",
  "/vecteezy_modern-gaming-pc-isolated-on-transparent_48412770.png",
  "/vecteezy_modern-gaming-pc-isolated-on-transparent_48412788.png",
];

const RADIUS = 280;
const ROTATION_DURATION = 4000;

const GLITCH_INTERVAL = 6000;
const GLITCH_DURATION = 300;

export default function DreamSetupSection() {
  const [angle, setAngle] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Carousel rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => prev - 120);
    }, ROTATION_DURATION);

    return () => clearInterval(interval);
  }, []);

  // Auto glitch effect every 6 seconds when not hovered
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), GLITCH_DURATION);
    }, GLITCH_INTERVAL);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsGlitching(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsGlitching(false);
  };

  return (
    <section className={styles.section} id="dream-setup">
      {/* Circuit background */}
      <div className={styles.circuitBg} aria-hidden>
        <svg className={styles.circuitSvg} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(92, 255, 177, 0.35)">
                <animate attributeName="offset" values="-1;1" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="30%" stopColor="rgba(92, 255, 177, 0.08)">
                <animate attributeName="offset" values="-0.7;1.3" dur="4s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            
            {/* Glowing light gradient */}
            <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Horizontal lines */}
          <path d="M0,100 H200 L220,120 H400" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <path d="M0,200 H150 L170,180 H350 L370,200 H500" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <path d="M0,300 H100 L130,330 H280 L310,300 H450" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <path d="M0,400 H180 L200,420 H380" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <path d="M0,500 H120 L150,470 H320 L350,500 H480" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          
          {/* Right side */}
          <path d="M1000,150 H800 L780,170 H600" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <path d="M1000,250 H850 L830,230 H680 L660,250 H550" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <path d="M1000,350 H900 L870,320 H720 L690,350 H580" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <path d="M1000,450 H820 L800,430 H650" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <path d="M1000,520 H880 L850,550 H700 L670,520 H560" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          
          {/* Vertical connectors */}
          <path d="M200,100 V180" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <path d="M350,180 V280" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <path d="M280,330 V420" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <path d="M150,400 V470" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          
          <path d="M800,150 V230" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <path d="M680,230 V320" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <path d="M720,350 V430" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <path d="M850,450 V550" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          
          {/* Circuit nodes */}
          <circle cx="200" cy="100" r="4" fill="url(#circuitGradient)" />
          <circle cx="350" cy="200" r="4" fill="url(#circuitGradient)" />
          <circle cx="280" cy="330" r="4" fill="url(#circuitGradient)" />
          <circle cx="150" cy="470" r="4" fill="url(#circuitGradient)" />
          <circle cx="800" cy="150" r="4" fill="url(#circuitGradient)" />
          <circle cx="680" cy="250" r="4" fill="url(#circuitGradient)" />
          <circle cx="720" cy="350" r="4" fill="url(#circuitGradient)" />
          <circle cx="850" cy="520" r="4" fill="url(#circuitGradient)" />
          
          {/* Chip rectangles */}
          <rect x="180" y="170" width="40" height="25" rx="3" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <rect x="330" y="270" width="50" height="30" rx="3" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <rect x="260" y="400" width="45" height="28" rx="3" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          
          <rect x="780" y="220" width="40" height="25" rx="3" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <rect x="660" y="310" width="50" height="30" rx="3" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          <rect x="830" y="440" width="45" height="28" rx="3" stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" />
          
          {/* Traveling lights - Left side */}
          <circle r="3" fill="rgba(92, 255, 177, 0.5)" filter="url(#glow)">
            <animateMotion dur="6s" repeatCount="indefinite">
              <mpath href="#path1" />
            </animateMotion>
          </circle>
          <path id="path1" d="M0,100 H200 L220,120 H400" fill="none" stroke="none" />
          
          <circle r="2.5" fill="rgba(92, 255, 177, 0.5)" filter="url(#glow)">
            <animateMotion dur="8s" repeatCount="indefinite" begin="1s">
              <mpath href="#path2" />
            </animateMotion>
          </circle>
          <path id="path2" d="M0,300 H100 L130,330 H280 L310,300 H450" fill="none" stroke="none" />
          
          <circle r="2.5" fill="rgba(92, 255, 177, 0.5)" filter="url(#glow)">
            <animateMotion dur="7s" repeatCount="indefinite" begin="2s">
              <mpath href="#path3" />
            </animateMotion>
          </circle>
          <path id="path3" d="M0,500 H120 L150,470 H320 L350,500 H480" fill="none" stroke="none" />
          
          {/* Traveling lights - Right side */}
          <circle r="3" fill="rgba(92, 255, 177, 0.5)" filter="url(#glow)">
            <animateMotion dur="6.5s" repeatCount="indefinite" begin="0.5s">
              <mpath href="#path4" />
            </animateMotion>
          </circle>
          <path id="path4" d="M1000,150 H800 L780,170 H600" fill="none" stroke="none" />
          
          <circle r="2.5" fill="rgba(92, 255, 177, 0.5)" filter="url(#glow)">
            <animateMotion dur="8.5s" repeatCount="indefinite" begin="1.5s">
              <mpath href="#path5" />
            </animateMotion>
          </circle>
          <path id="path5" d="M1000,350 H900 L870,320 H720 L690,350 H580" fill="none" stroke="none" />
          
          <circle r="2.5" fill="rgba(92, 255, 177, 0.5)" filter="url(#glow)">
            <animateMotion dur="7.5s" repeatCount="indefinite" begin="3s">
              <mpath href="#path6" />
            </animateMotion>
          </circle>
          <path id="path6" d="M1000,520 H880 L850,550 H700 L670,520 H560" fill="none" stroke="none" />
        </svg>
      </div>

      <h2 
        className={`${styles.title} ${isGlitching ? styles.glitching : ''}`}
        data-text="Build Your Dream Setup"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Build Your Dream Setup
      </h2>

      <div className={styles.showcase}>
        <div className={styles.carouselContainer}>
          {images.map((src, index) => {
            // Each image is positioned 120 degrees apart
            const baseAngle = index * 120;
            const currentAngle = baseAngle + angle;
            const radians = (currentAngle * Math.PI) / 180;
            
            // Calculate position on an ellipse (tilted 3D circle)
            const x = Math.sin(radians) * RADIUS;
            const z = Math.cos(radians);
            
            // Y follows an elliptical arc (creates curved trajectory)
            // Items go up when moving to the back, down when coming to front
            const ellipseHeight = 80;
            const y = -Math.cos(radians) * ellipseHeight;
            
            // Scale and opacity based on z position (depth)
            const scale = 0.35 + (z + 1) * 0.35; // 0.35 to 1.05
            const opacity = 0.2 + (z + 1) * 0.4; // 0.2 to 1
            const zIndex = Math.round((z + 1) * 10);

            return (
              <motion.div
                key={index}
                className={styles.carouselItem}
                animate={{
                  x,
                  y,
                  scale,
                  opacity,
                  zIndex,
                }}
                transition={{
                  duration: 1.4,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{
                  zIndex,
                }}
              >
                <Image
                  src={src}
                  alt={`Gaming PC ${index + 1}`}
                  width={400}
                  height={400}
                  className={styles.image}
                  style={{
                    filter: z > 0.5 
                      ? "drop-shadow(0 30px 50px rgba(0,0,0,0.6)) drop-shadow(0 0 30px rgba(92,255,177,0.2))"
                      : "drop-shadow(0 20px 30px rgba(0,0,0,0.4))",
                  }}
                />
              </motion.div>
            );
          })}
        </div>
        
        {/* Ellipse track */}
        <div className={styles.ellipseTrack} />
      </div>

      <a href="#products" className={styles.ctaLink}>
        Explore the Store
        <span className={styles.arrow}>→</span>
      </a>
    </section>
  );
}
