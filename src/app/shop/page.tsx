"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { PRODUCTS, CartItem, Product, PRICE_RANGE } from "@/data/products";
import FilterBar, { FilterState } from "@/components/shop/FilterBar";
import FilterModal from "@/components/shop/FilterModal";
import CartDrawer from "@/components/shop/CartDrawer";
import ProductCard from "@/components/shop/ProductCard";
import styles from "./page.module.css";

// ── Constants ─────────────────────────────────────────────────────────────────

const PER_PAGE = 15;

const DEFAULT_FILTERS: FilterState = {
  category: "all",
  sort: "featured",
  priceMin: PRICE_RANGE.min,
  priceMax: PRICE_RANGE.max,
  brands: [],
  inStockOnly: false,
  saleOnly: false,
  minRating: 0,
};

// Groups category pill values to actual product categories
const CATEGORY_MAP: Record<string, string[]> = {
  all:         [],
  cpu:         ["cpu"],
  gpu:         ["gpu"],
  ram:         ["ram"],
  storage:     ["nvme", "ssd"],
  motherboard: ["motherboard"],
  case:        ["case"],
  cooling:     ["cooling", "fans"],
  monitor:     ["monitor"],
  keyboard:    ["keyboard"],
  mouse:       ["mouse"],
  audio:       ["headset", "webcam", "microphone", "mousepad"],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function filterAndSort(products: Product[], f: FilterState): Product[] {
  let result = [...products];

  // Category
  const cats = CATEGORY_MAP[f.category];
  if (cats && cats.length > 0) {
    result = result.filter(p => cats.includes(p.category));
  }

  // Price
  result = result.filter(p => p.price >= f.priceMin && p.price <= f.priceMax);

  // Brands
  if (f.brands.length > 0) {
    result = result.filter(p => f.brands.includes(p.brand));
  }

  // Toggles
  if (f.inStockOnly) result = result.filter(p => p.inStock);
  if (f.saleOnly)    result = result.filter(p => !!p.originalPrice);

  // Rating
  if (f.minRating > 0) result = result.filter(p => p.rating >= f.minRating);

  // Sort
  switch (f.sort) {
    case "price-asc":  result.sort((a, b) => a.price - b.price); break;
    case "price-desc": result.sort((a, b) => b.price - a.price); break;
    case "rating":     result.sort((a, b) => b.rating - a.rating); break;
    case "newest":     result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    case "sale":       result.sort((a, b) => (b.originalPrice ? 1 : 0) - (a.originalPrice ? 1 : 0)); break;
    default:           break; // "featured" — keep original order
  }

  return result;
}

// ── Cart localStorage ─────────────────────────────────────────────────────────

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("corex-cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("corex-cart", JSON.stringify(cart));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [page, setPage] = useState(1);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate cart from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setCart(loadCart());
    setMounted(true);
  }, []);

  // Persist cart to localStorage on every change
  useEffect(() => {
    if (mounted) saveCart(cart);
  }, [cart, mounted]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Filtered + sorted products
  const filtered = useMemo(() => filterAndSort(PRODUCTS, filters), [filters]);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageProducts = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleFilterChange = useCallback((patch: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...patch }));
  }, []);

  const handleApplyAdvanced = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setFilterModalOpen(false);
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const handleCartChange = useCallback((newCart: CartItem[]) => {
    setCart(newCart);
  }, []);

  // ── Pagination ─────────────────────────────────────────────────────────────

  function scrollToGrid() {
    document.getElementById("shopGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToPage(n: number) {
    setPage(n);
    scrollToGrid();
  }

  const paginationPages = useMemo(() => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3)  pages.push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  }, [page, totalPages]);

  return (
    <div className={styles.page}>

      {/* ── Shop hero header ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>PC Components & Peripherals</h1>
          <p className={styles.heroSub}>
            {PRODUCTS.length}+ products across {Object.keys(CATEGORY_MAP).length - 1} categories — built for performance enthusiasts.
          </p>
        </div>
        {/* Decorative grid lines */}
        <div className={styles.heroGrid} aria-hidden />
      </section>

      {/* ── Filter bar (sticky) ── */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onAdvancedOpen={() => setFilterModalOpen(true)}
        cart={cart}
        onCartOpen={() => setCartOpen(true)}
        resultCount={filtered.length}
      />

      {/* ── Advanced filter modal ── */}
      <FilterModal
        open={filterModalOpen}
        filters={filters}
        onApply={handleApplyAdvanced}
        onClose={() => setFilterModalOpen(false)}
      />

      {/* ── Cart drawer ── */}
      <CartDrawer
        open={cartOpen}
        cart={cart}
        onCartChange={handleCartChange}
        onClose={() => setCartOpen(false)}
      />

      {/* ── Main shop area ── */}
      <main className={styles.main} id="shopGrid">
        <div className={styles.inner}>

          {/* Results info */}
          <div className={styles.resultsBar}>
            <p className={styles.resultsText}>
              {filtered.length === 0
                ? "No products found"
                : `Showing ${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
            </p>
            {(filters.category !== "all" || filters.brands.length > 0 || filters.inStockOnly || filters.saleOnly) && (
              <button
                className={styles.clearAll}
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                Clear all filters ×
              </button>
            )}
          </div>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No products match your filters.</p>
              <button className="btn btn-primary" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {pageProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  cartItems={cart}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Product pages">
              <button
                className={styles.pageBtn}
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
              >
                ←
              </button>

              {paginationPages.map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
                ) : (
                  <button
                    key={p}
                    className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
                    onClick={() => goToPage(p as number)}
                    aria-label={`Page ${p}`}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                className={styles.pageBtn}
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                →
              </button>
            </nav>
          )}

        </div>
      </main>
    </div>
  );
}
