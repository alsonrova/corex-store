"use client";

import { useEffect } from "react";
import { CartItem } from "@/data/products";
import styles from "./CartDrawer.module.css";

interface Props {
  open: boolean;
  cart: CartItem[];
  onCartChange: (cart: CartItem[]) => void;
  onClose: () => void;
}

export default function CartDrawer({ open, cart, onCartChange, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function updateQty(id: string, delta: number) {
    onCartChange(
      cart
        .map(item =>
          item.product.id === id
            ? { ...item, qty: item.qty + delta }
            : item
        )
        .filter(item => item.qty > 0)
    );
  }

  function removeItem(id: string) {
    onCartChange(cart.filter(item => item.product.id !== id));
  }

  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`}
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M2 2h2l2.5 10h9l2-6H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor"/>
              <circle cx="14.5" cy="15.5" r="1.5" fill="currentColor"/>
            </svg>
            <h2 className={styles.title}>Cart</h2>
            {totalItems > 0 && (
              <span className={styles.itemCount}>{totalItems} {totalItems === 1 ? "item" : "items"}</span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Cart items */}
        <div className={styles.itemsWrap}>
          {cart.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon} aria-hidden>
                <svg width="48" height="48" viewBox="0 0 20 20" fill="none">
                  <path d="M2 2h2l2.5 10h9l2-6H5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
                  <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" opacity="0.3"/>
                  <circle cx="14.5" cy="15.5" r="1.5" fill="currentColor" opacity="0.3"/>
                </svg>
              </div>
              <p className={styles.emptyTitle}>Your cart is empty</p>
              <p className={styles.emptySub}>Add products from the shop to get started.</p>
              <button className={`btn btn-primary ${styles.shopBtn}`} onClick={onClose}>
                Browse Products
              </button>
            </div>
          ) : (
            <ul className={styles.items}>
              {cart.map(({ product, qty }) => (
                <li key={product.id} className={styles.item}>
                  {/* Thumbnail */}
                  <div className={styles.thumb}>
                    <img src={product.image} alt={product.name} className={styles.thumbImg} />
                  </div>

                  {/* Info */}
                  <div className={styles.info}>
                    <p className={styles.itemBrand}>{product.brand}</p>
                    <p className={styles.itemName}>{product.name}</p>
                    <div className={styles.itemBottom}>
                      {/* Qty control */}
                      <div className={styles.qtyControl}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQty(product.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className={styles.qtyVal}>{qty}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQty(product.id, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      {/* Line price */}
                      <span className={styles.linePrice}>
                        ${(product.price * qty).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(product.id)}
                    aria-label={`Remove ${product.name}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only show when items exist */}
        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span className={styles.subtotalLabel}>Subtotal</span>
              <span className={styles.subtotalVal}>${subtotal.toFixed(2)}</span>
            </div>
            <p className={styles.taxNote}>Shipping & taxes calculated at checkout</p>
            <button className={`btn btn-primary ${styles.checkoutBtn}`}>
              Checkout →
            </button>
            <button className={`btn btn-ghost ${styles.continueBtn}`} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
