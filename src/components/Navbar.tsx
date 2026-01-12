"use client";

import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <a href="/" className={styles.brand}>
        <span className={styles.brandCorex}>Corex</span>
        <span className={styles.brandStore}>Store</span>
      </a>

      <nav className={styles.navLinks} aria-label="Primary">
        <a href="#products">Shop</a>
        <a href="#sponsors">Partners</a>
        <a href="#admin">Admin</a>
        <a href="#about">About</a>
      </nav>

      <a className={styles.loginBtn} href="#auth">
        Login
      </a>
    </header>
  );
}

