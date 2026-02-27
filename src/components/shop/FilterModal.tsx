"use client";

import { useEffect, useState } from "react";
import { ALL_BRANDS, PRICE_RANGE } from "@/data/products";
import { FilterState } from "./FilterBar";
import styles from "./FilterModal.module.css";

interface Props {
  open: boolean;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}

const BRAND_GROUPS: Record<string, string[]> = {
  "Processors": ["Intel", "AMD"],
  "Graphics": ["NVIDIA", "AMD"],
  "Memory & Storage": ["Samsung", "Corsair", "G.Skill", "Kingston", "Crucial", "WD", "Seagate", "SK Hynix", "Elgato"],
  "Motherboards": ["ASUS", "MSI", "Gigabyte", "NZXT", "ASRock"],
  "Power & Cooling": ["Corsair", "Seasonic", "be quiet!", "Noctua", "EVGA"],
  "Cases": ["Lian Li", "Fractal Design"],
  "Peripherals": ["Logitech", "Razer", "SteelSeries", "HyperX", "Keychron", "Elgato"],
};

// Flat unique sorted brand list (from BRAND_GROUPS ordering)
const GROUPED_BRANDS = Object.entries(BRAND_GROUPS);

export default function FilterModal({ open, filters, onApply, onClose }: Props) {
  const [local, setLocal] = useState<FilterState>(filters);

  // Sync when modal opens
  useEffect(() => {
    if (open) setLocal(filters);
  }, [open, filters]);

  // Trap focus / close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function toggleBrand(brand: string) {
    setLocal(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand],
    }));
  }

  function handleReset() {
    setLocal({
      ...filters,
      priceMin: PRICE_RANGE.min,
      priceMax: PRICE_RANGE.max,
      brands: [],
      inStockOnly: false,
      saleOnly: false,
      minRating: 0,
    });
  }

  function handleApply() {
    onApply(local);
    onClose();
  }

  const activeCount =
    (local.brands.length > 0 ? 1 : 0) +
    (local.inStockOnly ? 1 : 0) +
    (local.saleOnly ? 1 : 0) +
    (local.minRating > 0 ? 1 : 0) +
    (local.priceMin > PRICE_RANGE.min || local.priceMax < PRICE_RANGE.max ? 1 : 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`}
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Advanced Filters"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Advanced Filters</h2>
            {activeCount > 0 && (
              <span className={styles.activeCount}>{activeCount} active</span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close filters">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className={styles.body}>

          {/* ── Price Range ── */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Price Range</h3>
            <div className={styles.priceDisplay}>
              <span className={styles.priceVal}>${local.priceMin}</span>
              <span className={styles.priceSep}>—</span>
              <span className={styles.priceVal}>${local.priceMax === PRICE_RANGE.max ? `${local.priceMax}+` : local.priceMax}</span>
            </div>
            <div className={styles.rangeGroup}>
              <label className={styles.rangeLabel}>Min</label>
              <input
                type="range"
                className={styles.range}
                min={PRICE_RANGE.min}
                max={PRICE_RANGE.max}
                step={10}
                value={local.priceMin}
                onChange={e => {
                  const val = Number(e.target.value);
                  setLocal(prev => ({ ...prev, priceMin: Math.min(val, prev.priceMax - 10) }));
                }}
              />
              <label className={styles.rangeLabel}>Max</label>
              <input
                type="range"
                className={styles.range}
                min={PRICE_RANGE.min}
                max={PRICE_RANGE.max}
                step={10}
                value={local.priceMax}
                onChange={e => {
                  const val = Number(e.target.value);
                  setLocal(prev => ({ ...prev, priceMax: Math.max(val, prev.priceMin + 10) }));
                }}
              />
            </div>
          </section>

          {/* ── Toggles ── */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Availability</h3>
            <div className={styles.toggleGroup}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={local.inStockOnly}
                  onChange={e => setLocal(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                />
                <span className={styles.toggleTrack}>
                  <span className={styles.toggleThumb} />
                </span>
                In Stock Only
              </label>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={local.saleOnly}
                  onChange={e => setLocal(prev => ({ ...prev, saleOnly: e.target.checked }))}
                />
                <span className={styles.toggleTrack}>
                  <span className={styles.toggleThumb} />
                </span>
                On Sale Only
              </label>
            </div>
          </section>

          {/* ── Minimum Rating ── */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Minimum Rating</h3>
            <div className={styles.ratingOptions}>
              {[0, 3.5, 4, 4.5, 4.9].map((val) => (
                <button
                  key={val}
                  className={`${styles.ratingBtn} ${local.minRating === val ? styles.ratingBtnActive : ""}`}
                  onClick={() => setLocal(prev => ({ ...prev, minRating: val }))}
                >
                  {val === 0 ? "Any" : `${val}★+`}
                </button>
              ))}
            </div>
          </section>

          {/* ── Brands ── */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Brands
              {local.brands.length > 0 && (
                <button
                  className={styles.clearBrands}
                  onClick={() => setLocal(prev => ({ ...prev, brands: [] }))}
                >
                  Clear
                </button>
              )}
            </h3>
            <div className={styles.brandGroups}>
              {GROUPED_BRANDS.map(([group, brands]) => {
                // Only show brands that exist in our product catalogue
                const validBrands = brands.filter(b => ALL_BRANDS.includes(b));
                if (validBrands.length === 0) return null;
                return (
                  <div key={group} className={styles.brandGroup}>
                    <p className={styles.brandGroupLabel}>{group}</p>
                    <div className={styles.brandList}>
                      {validBrands.map(brand => (
                        <label key={brand} className={styles.checkLabel}>
                          <input
                            type="checkbox"
                            checked={local.brands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className={styles.checkbox}
                          />
                          <span className={styles.checkMark} />
                          {brand}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={`btn btn-ghost ${styles.resetBtn}`} onClick={handleReset}>
            Reset All
          </button>
          <button className={`btn btn-primary ${styles.applyBtn}`} onClick={handleApply}>
            Apply{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
        </div>
      </div>
    </>
  );
}
