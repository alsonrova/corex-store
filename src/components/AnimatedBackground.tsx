import styles from "./AnimatedBackground.module.css";

export default function AnimatedBackground() {
  return (
    <div className={styles.container}>
      <div className={styles.halo1} />
      <div className={styles.halo2} />
      <div className={styles.halo3} />
      <div className={styles.halo4} />
    </div>
  );
}
