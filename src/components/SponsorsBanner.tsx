"use client";

import styles from "./SponsorsBanner.module.css";

const sponsors = [
  { name: "Intel", type: "text" },
  { name: "AMD", type: "text" },
  { name: "NVIDIA", type: "text" },
  { name: "Corsair", type: "text" },
  { name: "ASUS", type: "text" },
  { name: "MSI", type: "text" },
  { name: "G.Skill", type: "text" },
  { name: "Samsung", type: "text" },
  { name: "Seagate", type: "text" },
  { name: "Western Digital", type: "text" },
  { name: "Noctua", type: "text" },
  { name: "be quiet!", type: "text" },
];

export default function SponsorsBanner() {
  // Duplicate sponsors array for seamless loop
  const allSponsors = [...sponsors, ...sponsors];

  return (
    <section className={styles.banner} aria-label="Our partners and sponsors">
      <div className={styles.track}>
        <div className={styles.content}>
          {allSponsors.map((sponsor, index) => (
            <span key={`${sponsor.name}-${index}`} className={styles.sponsor}>
              {sponsor.name}
            </span>
          ))}
        </div>
      </div>
      
      {/* Edge fade overlays */}
      <div className={styles.fadeLeft} aria-hidden />
      <div className={styles.fadeRight} aria-hidden />
    </section>
  );
}

