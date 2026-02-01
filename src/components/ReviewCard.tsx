"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import styles from "./ReviewsSection.module.css";

interface ReviewCardProps {
  avatar: string;
  username: string;
  handle: string;
  image: string;
  likes: number;
  text: string;
  date: string;
  animate: boolean;
  liveIncrement: boolean;
}

// 0-9 + duplicate 0 for smooth 9→0 wrapping
const DIGIT_STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const DIGIT_H = 1.15; // em — matches CSS line-height

function formatLikes(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// Ease-in cubic: slow start → accelerate through the end
function easeIn(t: number): number {
  return t * t * t;
}

// ── Single odometer digit — direct DOM, zero useState ──

function RollingDigit({ digit }: { digit: number }) {
  const colRef = useRef<HTMLSpanElement>(null);
  const prevRef = useRef(-1); // -1 = first mount
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const el = colRef.current;
    if (!el) return;

    const prev = prevRef.current;
    prevRef.current = digit;

    if (prev === digit) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    if (prev === -1) {
      // First mount — snap without transition
      el.style.transition = "none";
      el.style.transform = `translateY(${-digit * DIGIT_H}em)`;
      return;
    }

    el.style.transition = "transform 0.12s cubic-bezier(0.4,0,0.2,1)";

    if (digit === 0 && prev === 9) {
      // Wrap 9→0: scroll to position 10 (duplicate 0), then snap back
      el.style.transform = `translateY(${-10 * DIGIT_H}em)`;
      timerRef.current = setTimeout(() => {
        el.style.transition = "none";
        el.style.transform = "translateY(0em)";
      }, 130);
    } else {
      el.style.transform = `translateY(${-digit * DIGIT_H}em)`;
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [digit]);

  return (
    <span className={styles.digitRoller}>
      <span ref={colRef} className={styles.digitColumn}>
        {DIGIT_STRIP.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </span>
    </span>
  );
}

// ── Main component ──

export default function ReviewCard({
  avatar,
  username,
  handle,
  image,
  likes,
  text,
  date,
  animate,
  liveIncrement,
}: ReviewCardProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [countDone, setCountDone] = useState(false);
  const [heartBumping, setHeartBumping] = useState(false);
  const countRef = useRef(0);
  const animStarted = useRef(false);
  const liveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bumpKey = useRef(0);

  // ── Count-up from 0 → likes, throttled to ~30fps ──
  useEffect(() => {
    if (!animate || animStarted.current) return;
    animStarted.current = true;

    const target = likes;
    const duration = 2500;
    const start = performance.now();
    let frame: number;
    let lastFlush = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const value = Math.round(easeIn(t) * target);

      countRef.current = value;

      // Flush to React at ~30 fps (every 33ms)
      if (now - lastFlush > 33) {
        lastFlush = now;
        setDisplayCount(value);
      }

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        countRef.current = target;
        setDisplayCount(target);
        setCountDone(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, likes]);

  // ── Live increments after count-up finishes ──
  const scheduleNext = useCallback(() => {
    const delay = 2000 + Math.random() * 4000;
    liveRef.current = setTimeout(() => {
      const bump = 1 + Math.floor(Math.random() * 15);
      countRef.current += bump;
      setDisplayCount(countRef.current);

      bumpKey.current += 1;
      setHeartBumping(true);
      setTimeout(() => setHeartBumping(false), 400);

      scheduleNext();
    }, delay);
  }, []);

  useEffect(() => {
    if (liveIncrement && countDone) scheduleNext();
    return () => {
      if (liveRef.current) clearTimeout(liveRef.current);
    };
  }, [liveIncrement, countDone, scheduleNext]);

  // ── Render ──

  const formatted = formatLikes(displayCount);
  const chars = formatted.split("");

  let heartClass = styles.heartIcon;
  if (heartBumping) heartClass += ` ${styles.heartBump}`;

  return (
    <div className={styles.reviewCard}>
      <div className={styles.cardHeader}>
        <img
          src={avatar}
          alt={username}
          className={styles.avatar}
          width={32}
          height={32}
        />
        <div className={styles.userInfo}>
          <span className={styles.username}>{username}</span>
          <span className={styles.handle}>{handle}</span>
        </div>
        <span className={styles.date}>{date}</span>
      </div>

      <div className={styles.cardImage}>
        <Image
          src={image}
          alt={`${username}'s setup`}
          width={260}
          height={260}
          className={styles.cardImg}
        />
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.cardActions}>
          <span key={bumpKey.current} className={heartClass}>♥</span>
          <span className={styles.likesAnimated}>
            {chars.map((char, i) => {
              const d = parseInt(char);
              if (!isNaN(d)) {
                return <RollingDigit key={`${i}-${chars.length}`} digit={d} />;
              }
              return <span key={`${i}-${chars.length}`}>{char}</span>;
            })}
            <span className={styles.likesLabel}> likes</span>
          </span>
        </div>
        <p className={styles.reviewText}>
          <span className={styles.reviewAuthor}>{username}</span> {text}
        </p>
      </div>
    </div>
  );
}
