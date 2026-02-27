"use client";

import { useRef } from "react";
import { Product, CartItem, CATEGORY_LABELS } from "@/data/products";
import styles from "./ProductCard.module.css";

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
  cartItems: CartItem[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = rating >= n;
        const half   = !filled && rating >= n - 0.5;
        return (
          <span key={n} className={half ? styles.starHalf : filled ? styles.starFull : styles.starEmpty}>
            ★
          </span>
        );
      })}
    </span>
  );
}

export default function ProductCard({ product, onAddToCart, cartItems }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const inCart = cartItems.some(i => i.product.id === product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }

  function handleMouseLeave() {
    const el = cardRef.current;
    if (el) {
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "50%");
    }
  }

  return (
    <article
      ref={cardRef}
      className={styles.card}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Top shimmer line ── */}
      <div className={styles.shimmer} aria-hidden />

      {/* ── Image ── */}
      <div className={styles.imageWrap}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />

        {/* Badges */}
        <span className={styles.categoryBadge}>
          {CATEGORY_LABELS[product.category]}
        </span>

        {product.isNew && (
          <span className={`${styles.badge} ${styles.badgeNew}`}>NEW</span>
        )}
        {discount > 0 && (
          <span className={`${styles.badge} ${styles.badgeSale}`}>−{discount}%</span>
        )}

        {!product.inStock && (
          <div className={styles.outOfStockOverlay}>Out of Stock</div>
        )}
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        <p className={styles.brand}>{product.brand}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>

        {/* Key spec pill */}
        {(() => {
          const firstSpec = Object.entries(product.specs)[0];
          return firstSpec ? (
            <span className={styles.specPill}>
              {firstSpec[0]}: {firstSpec[1]}
            </span>
          ) : null;
        })()}
      </div>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <div className={styles.ratingRow}>
          <StarRating rating={product.rating} />
          <span className={styles.reviewCount}>({product.reviews.toLocaleString()})</span>
        </div>

        <div className={styles.priceRow}>
          <div className={styles.prices}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            className={`${styles.addBtn} ${inCart ? styles.addBtnInCart : ""}`}
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            aria-label={inCart ? "Already in cart" : `Add ${product.name} to cart`}
          >
            {inCart ? "✓ In Cart" : "+ Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
