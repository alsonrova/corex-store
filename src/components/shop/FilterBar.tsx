"use client";

import { CartItem } from "@/data/products";
import styles from "./FilterBar.module.css";

export interface FilterState {
  category: string;
  sort: string;
  priceMin: number;
  priceMax: number;
  brands: string[];
  inStockOnly: boolean;
  saleOnly: boolean;
  minRating: number;
}

interface Props {
  filters: FilterState;
  onFilterChange: (patch: Partial<FilterState>) => void;
  onAdvancedOpen: () => void;
  cart: CartItem[];
  onCartOpen: () => void;
  resultCount: number;
}

const CATEGORY_PILLS = [
  { value: "all",         label: "All" },
  { value: "cpu",         label: "CPU" },
  { value: "gpu",         label: "GPU" },
  { value: "ram",         label: "RAM" },
  { value: "storage",     label: "Storage" },
  { value: "motherboard", label: "Motherboard" },
  { value: "case",        label: "Case" },
  { value: "cooling",     label: "Cooling" },
  { value: "monitor",     label: "Monitor" },
  { value: "keyboard",    label: "Keyboard" },
  { value: "mouse",       label: "Mouse" },
  { value: "audio",       label: "Audio" },
];

const SORT_OPTIONS = [
  { value: "featured",   label: "Featured" },
  { value: "price-asc",  label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "rating",     label: "Top Rated" },
  { value: "newest",     label: "Newest" },
  { value: "sale",       label: "On Sale" },
];

export default function FilterBar({
  filters,
  onFilterChange,
  onAdvancedOpen,
  cart,
  onCartOpen,
  resultCount,
}: Props) {
  const totalCartItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const hasAdvancedFilters =
    filters.brands.length > 0 ||
    filters.inStockOnly ||
    filters.saleOnly ||
    filters.minRating > 0 ||
    filters.priceMin > 0 ||
    filters.priceMax < 3000;

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>

        {/* ── Category pills ── */}
        <div className={styles.pillsWrap}>
          <nav className={styles.pills} aria-label="Filter by category">
            {CATEGORY_PILLS.map((cat) => (
              <button
                key={cat.value}
                className={`${styles.pill} ${filters.category === cat.value ? styles.pillActive : ""}`}
                onClick={() => onFilterChange({ category: cat.value })}
                aria-pressed={filters.category === cat.value}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </div>

        {/* ── Right controls ── */}
        <div className={styles.controls}>
          {/* Sort */}
          <div className={styles.sortWrap}>
            <select
              className={styles.sortSelect}
              value={filters.sort}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Advanced filters button */}
          <button
            className={`${styles.advancedBtn} ${hasAdvancedFilters ? styles.advancedBtnActive : ""}`}
            onClick={onAdvancedOpen}
            aria-label="Advanced filters"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Filters
            {hasAdvancedFilters && <span className={styles.filterDot} />}
          </button>

          {/* Result count */}
          <span className={styles.count}>{resultCount} items</span>

          {/* Cart icon */}
          <button
            className={styles.cartBtn}
            onClick={onCartOpen}
            aria-label={`Open cart, ${totalCartItems} items`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M2 2h2l2.5 10h9l2-6H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor"/>
              <circle cx="14.5" cy="15.5" r="1.5" fill="currentColor"/>
            </svg>
            {totalCartItems > 0 && (
              <span className={styles.cartBadge} aria-hidden>
                {totalCartItems > 99 ? "99+" : totalCartItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
