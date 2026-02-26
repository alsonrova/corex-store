import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import CTASection from "../components/CTASection";
import DreamSetupSection from "../components/DreamSetupSection";
import HeroShowcase from "../components/HeroShowcase";
import ReviewsSection from "../components/ReviewsSection";
import ServiceSection from "../components/ServiceSection";
import SponsorsSection from "../components/SponsorsSection";
import TeamSection from "../components/TeamSection";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.backdrop} aria-hidden />

      <main className={styles.main}>
        <HeroShowcase />

        <DreamSetupSection />
        
        <AboutSection />

        <ServiceSection />

        <SponsorsSection />

        <TeamSection />

        <ReviewsSection />

        <CTASection />

        <ContactSection />

      </main>

      <footer className={styles.footer}>
        <div>
          <span className={styles.brandMark}>CX</span>
          <span>COREX Store · Design-forward concept</span>
        </div>
        <div className={styles.footerLinks}>
          <a href="#hero">Home</a>
          <a href="#dream-setup">Setup</a>
          <a href="#about">About</a>
          <a href="#sponsors">Partners</a>
        </div>
      </footer>
    </div>
  );
}
