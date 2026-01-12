"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import styles from "./AboutSection.module.css";

const initLines = [
  { type: "command", text: "> corex.init()" },
  { type: "output", text: "" },
  { type: "loading", text: "Initializing COREX environment..." },
  { type: "loading", text: "Loading performance standards..." },
  { type: "loading", text: "Applying precision protocols..." },
];

const mainLines = [
  { type: "output", text: "" },
  { type: "success", text: "● COREX ready" },
  { type: "output", text: "" },
  { type: "text", text: "COREX is built for those who value control over excess." },
  { type: "text", text: "Every system, every component, every interaction" },
  { type: "text", text: "is selected and assembled with intention." },
  { type: "output", text: "" },
  { type: "muted", text: "No shortcuts." },
  { type: "muted", text: "No unnecessary layers." },
  { type: "muted", text: "Only reliable hardware, clean design," },
  { type: "muted", text: "and a focused experience from start to finish." },
  { type: "output", text: "" },
  { type: "accent", text: "COREX operates where performance matters most:" },
  { type: "accent", text: "at the core." },
];

export default function AboutSection() {
  const [phase, setPhase] = useState<"idle" | "init" | "clearing" | "main" | "done">("idle");
  const [visibleInitLines, setVisibleInitLines] = useState(0);
  const [visibleMainLines, setVisibleMainLines] = useState(0);
  const [loadingFading, setLoadingFading] = useState(false);
  const [flickerLines, setFlickerLines] = useState<Set<number>>(new Set());
  const [isShaking, setIsShaking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [headlineText, setHeadlineText] = useState("");
  const [showAllHeadlines, setShowAllHeadlines] = useState(false);
  const [visiblePopups, setVisiblePopups] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const lastShakeRef = useRef<number>(Date.now());

  const headlines = [
    "Precision hardware.",
    "Intentional design.",
    "Built for control."
  ];

  const popupWords = ["Reliable", "Expert", "Passionate"];
  const [popupTypedText, setPopupTypedText] = useState<string[]>(["", "", ""]);
  const [popupCheckVisible, setPopupCheckVisible] = useState<boolean[]>([false, false, false]);
  const [popupPositions, setPopupPositions] = useState<{x: number, y: number}[]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ]);
  const [draggingPopup, setDraggingPopup] = useState<number | null>(null);
  const dragStartRef = useRef<{x: number, y: number, popupX: number, popupY: number} | null>(null);

  // Generate random flicker for lines
  useEffect(() => {
    if (phase !== "done" || isPaused) return;

    const flickerInterval = setInterval(() => {
      // Random chance to flicker 1-2 lines
      const newFlickers = new Set<number>();
      const numFlickers = Math.floor(Math.random() * 2) + 1;
      
      for (let i = 0; i < numFlickers; i++) {
        if (Math.random() > 0.7) { // 30% chance per potential flicker
          const lineIndex = Math.floor(Math.random() * mainLines.length);
          newFlickers.add(lineIndex);
        }
      }
      
      setFlickerLines(newFlickers);
      
      // Clear flickers after short duration
      setTimeout(() => {
        setFlickerLines(new Set());
      }, 60 + Math.random() * 100);
    }, 2500 + Math.random() * 2000);

    return () => clearInterval(flickerInterval);
  }, [phase, isPaused]);

  // Trigger shake effect
  const triggerShake = () => {
    if (!isShaking && !isPaused) {
      setIsShaking(true);
      lastShakeRef.current = Date.now();
      setTimeout(() => setIsShaking(false), 300);
    }
  };

  // Handle mouse enter
  const handleMouseEnter = () => {
    setIsHovering(true);
    triggerShake();
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovering(false);
    lastShakeRef.current = Date.now(); // Reset timer on leave
  };

  // Auto-shake every 10s when not hovering, every 1.5s when hovering
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastShake = Date.now() - lastShakeRef.current;
      
      if (isHovering) {
        // Shake every 1.5s while hovering
        if (timeSinceLastShake >= 1500) {
          triggerShake();
        }
      } else {
        // Shake every 10s when not hovering
        if (timeSinceLastShake >= 10000) {
          triggerShake();
        }
      }
    }, 100); // Check frequently

    return () => clearInterval(interval);
  }, [isHovering, isShaking]);

  // Headline typing animation
  useEffect(() => {
    if (showAllHeadlines) {
      // After showing all headlines for 4 seconds, restart the loop
      const restartTimer = setTimeout(() => {
        setShowAllHeadlines(false);
        setHeadlineIndex(0);
        setHeadlineText("");
      }, 4000);
      
      return () => clearTimeout(restartTimer);
    }

    if (headlineIndex >= headlines.length) return;

    const currentHeadline = headlines[headlineIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= currentHeadline.length) {
        setHeadlineText(currentHeadline.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        // Wait then move to next headline or show all
        setTimeout(() => {
          if (headlineIndex < headlines.length - 1) {
            setHeadlineIndex(headlineIndex + 1);
            setHeadlineText("");
          } else {
            setShowAllHeadlines(true);
          }
        }, 1200);
      }
    }, 60);

    return () => clearInterval(typeInterval);
  }, [headlineIndex, showAllHeadlines]);

  // Intersection Observer to start animation when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && phase === "idle") {
          setPhase("init");
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [phase]);

  // Show popup windows 6 seconds after terminal is done
  useEffect(() => {
    if (phase !== "done") {
      setVisiblePopups([]);
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    // Start showing popups after 6 seconds
    timers.push(setTimeout(() => {
      setVisiblePopups([0]);
    }, 6000));

    timers.push(setTimeout(() => {
      setVisiblePopups([0, 1]);
    }, 7000));

    timers.push(setTimeout(() => {
      setVisiblePopups([0, 1, 2]);
    }, 8000));

    return () => timers.forEach(t => clearTimeout(t));
  }, [phase]);

  // Typing animation for each popup
  useEffect(() => {
    visiblePopups.forEach((popupIndex) => {
      const word = popupWords[popupIndex];
      
      // Skip if already typed
      if (popupTypedText[popupIndex] === word) return;
      
      let charIndex = popupTypedText[popupIndex].length;
      
      const typeInterval = setInterval(() => {
        if (charIndex < word.length) {
          setPopupTypedText(prev => {
            const newText = [...prev];
            newText[popupIndex] = word.slice(0, charIndex + 1);
            return newText;
          });
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Show checkbox after typing is done
          setTimeout(() => {
            setPopupCheckVisible(prev => {
              const newVisible = [...prev];
              newVisible[popupIndex] = true;
              return newVisible;
            });
          }, 300);
        }
      }, 80);

      return () => clearInterval(typeInterval);
    });
  }, [visiblePopups]);

  // Reset popup states when phase resets
  useEffect(() => {
    if (phase !== "done") {
      setPopupTypedText(["", "", ""]);
      setPopupCheckVisible([false, false, false]);
      setPopupPositions([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]);
    }
  }, [phase]);

  // Drag handlers for popups
  const handlePopupMouseDown = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingPopup(index);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      popupX: popupPositions[index].x,
      popupY: popupPositions[index].y
    };
  };

  useEffect(() => {
    if (draggingPopup === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dragStart = dragStartRef.current;
      if (dragStart === null) return;
      
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setPopupPositions(prev => {
        const newPositions = [...prev];
        newPositions[draggingPopup] = {
          x: dragStart.popupX + deltaX,
          y: dragStart.popupY + deltaY
        };
        return newPositions;
      });
    };

    const handleMouseUp = () => {
      setDraggingPopup(null);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingPopup]);

  // Phase: init - show initialization lines
  useEffect(() => {
    if (phase !== "init") return;

    const timer = setInterval(() => {
      setVisibleInitLines((prev) => {
        if (prev >= initLines.length) {
          clearInterval(timer);
          // Wait a moment then start clearing
          setTimeout(() => setPhase("clearing"), 600);
          return prev;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [phase]);

  // Phase: clearing - fade out loading lines
  useEffect(() => {
    if (phase !== "clearing") return;

    setLoadingFading(true);
    
    // After fade animation, move to main phase
    const timer = setTimeout(() => {
      setPhase("main");
    }, 500);

    return () => clearTimeout(timer);
  }, [phase]);

  // Phase: main - show main content
  useEffect(() => {
    if (phase !== "main") return;

    const timer = setInterval(() => {
      setVisibleMainLines((prev) => {
        if (prev >= mainLines.length) {
          clearInterval(timer);
          setPhase("done");
          return prev;
        }
        return prev + 1;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [phase]);

  return (
    <section className={styles.section} id="about" ref={sectionRef}>
      <div className={styles.container}>
        {/* Identity statement */}
        <div className={styles.identity}>
          <p className={styles.eyebrow}>About COREX</p>
          <div className={styles.headlineContainer}>
            {showAllHeadlines ? (
              <h2 className={styles.headline}>
                <span className={styles.headlineLine}>Precision hardware.</span>
                <span className={styles.headlineLine}>Intentional design.</span>
                <span className={styles.headlineLine}>Built for control.</span>
              </h2>
            ) : (
              <h2 className={styles.headline}>
                <span className={styles.typingLine}>
                  <span className={styles.prompt}>&gt;</span>
                  {headlineText}
                  <span className={styles.typingCursor}>|</span>
                </span>
              </h2>
            )}
          </div>
        </div>

        {/* Terminal area with popups */}
        <div className={styles.terminalArea}>
          {/* Terminal block */}
          <div 
            className={`${styles.terminalWrapper} ${isShaking ? styles.shake : ""} ${isPaused ? styles.paused : ""}`}
            ref={terminalRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
          <div className={styles.glitchOverlay} aria-hidden />
          <div className={styles.terminalHeader}>
            <div className={styles.terminalDots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <span className={styles.terminalTitle}>corex — bash</span>
            <div className={styles.terminalActions}>
              <span className={styles.terminalPid}>pid: 1337</span>
              <button 
                className={`${styles.pauseBtn} ${isPaused ? styles.active : ""}`}
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? "Resume animations" : "Pause animations"}
              >
                {isPaused ? "▶" : "❚❚"}
              </button>
            </div>
          </div>
          <div className={styles.terminalBody}>
            {/* Init lines - command stays, loading lines fade */}
            {initLines.slice(0, visibleInitLines).map((line, i) => {
              const isLoadingLine = line.type === "loading";
              const shouldHide = isLoadingLine && phase !== "init" && phase !== "clearing";
              const isFading = isLoadingLine && loadingFading;
              
              if (shouldHide) return null;
              
              return (
                <div 
                  key={`init-${i}`} 
                  className={`${styles.terminalLine} ${styles[line.type]} ${isFading ? styles.fading : ""}`}
                >
                  {line.text || "\u00A0"}
                </div>
              );
            })}
            
            {/* Main lines */}
            {(phase === "main" || phase === "done") && mainLines.slice(0, visibleMainLines).map((line, i) => (
              <div 
                key={`main-${i}`} 
                className={`${styles.terminalLine} ${styles[line.type]} ${flickerLines.has(i) ? styles.flicker : ""}`}
              >
                {line.type === "success" ? (
                  <>
                    <span className={styles.pulseIcon}>●</span>
                    {" COREX ready"}
                  </>
                ) : (
                  line.text || "\u00A0"
                )}
              </div>
            ))}
            
            {/* Cursor */}
            {phase !== "idle" && phase !== "done" && (
              <span className={styles.cursor}>▋</span>
            )}
          </div>
        </div>

        {/* Mini popup windows - outside terminal wrapper */}
        <div className={styles.popupsContainer}>
          {popupWords.map((word, index) => (
            <div
              key={word}
              className={`${styles.miniPopup} ${styles[`popup${index}`]} ${visiblePopups.includes(index) ? styles.popupVisible : ""} ${draggingPopup === index ? styles.dragging : ""}`}
              style={{
                transform: `translate(${popupPositions[index].x}px, ${popupPositions[index].y}px)`,
              }}
            >
              <div 
                className={styles.miniPopupHeader}
                onMouseDown={(e) => handlePopupMouseDown(index, e)}
              >
                <span className={styles.miniDot} />
                <span className={styles.miniDot} />
                <span className={styles.miniDot} />
              </div>
              <div className={styles.miniPopupBody}>
                <span className={styles.popupPrompt}>&gt;</span>
                <span className={styles.popupText}>
                  {popupTypedText[index]}
                  {visiblePopups.includes(index) && popupTypedText[index] !== word && (
                    <span className={styles.popupCursor}>|</span>
                  )}
                </span>
                <span className={`${styles.popupCheck} ${popupCheckVisible[index] ? styles.checkVisible : ""}`}>
                  ✓
                </span>
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* CTA link */}
        <a href="#dream-setup" className={styles.ctaLink}>
          Discover COREX
          <span className={styles.arrow}>→</span>
        </a>
      </div>
    </section>
  );
}
