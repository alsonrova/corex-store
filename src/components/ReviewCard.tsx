import { memo } from "react";
import Image from "next/image";
import styles from "./ReviewsSection.module.css";

interface ReviewCardProps {
  avatarColor: string;
  initials: string;
  username: string;
  handle: string;
  image: string;
  likes: number;
  text: string;
  date: string;
}

export default memo(function ReviewCard({
  avatarColor, initials, username, handle, image, likes, text, date,
}: ReviewCardProps) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.cardHeader}>
        <div className={styles.avatar} style={{ background: avatarColor }}>
          <span className={styles.avatarInitials}>{initials}</span>
        </div>
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
          <span className={styles.heartIcon}>♥</span>
          <span className={styles.likes}>
            {likes >= 1000 ? `${(likes / 1000).toFixed(1)}k` : likes} likes
          </span>
        </div>
        <p className={styles.reviewText}>
          <span className={styles.reviewAuthor}>{username}</span> {text}
        </p>
      </div>
    </div>
  );
});
