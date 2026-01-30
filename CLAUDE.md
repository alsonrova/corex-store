# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (flat config, v9)
```

No test framework is configured.

## Architecture

COREX Store is a **static marketing/showcase website** for a custom PC building business. It is not a functional e-commerce platform — all content is hardcoded in components with no backend, API routes, or database.

**Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Framer Motion, CSS Modules. The React Compiler is enabled in `next.config.ts` for automatic optimization.

### App Structure

- `src/app/layout.tsx` — Root layout. Wraps all pages with global providers: `AnimatedBackground`, `CursorGlow`, `Navbar`, and `SmoothScroll`.
- `src/app/page.tsx` — Single-page landing composed of section components rendered in sequence (Hero → DreamSetup → About → Service → Sponsors → Team → Reviews → Footer).
- `src/app/globals.css` — Imports design tokens and primitives.

### Styling

Pure **CSS Modules** — no Tailwind. Each component has a co-located `.module.css` file.

Design tokens live in `src/styles/`:
- `tokens.css` — CSS custom properties for colors, spacing, radii, transitions, shadows. Primary accent is `#5cffb1` (mint green with glow). Dark background theme (`#04060a`).
- `primitives.css` — Reusable component classes (`.btn`, `.card`, `.input`, `.eyebrow`, etc.) with hover/focus/disabled states.

Typography uses Geist Sans/Mono via `next/font` with `clamp()` for responsive sizing.

### Component Patterns

- Interactive components use `"use client"` directive; content-heavy sections are server components by default.
- No global state management — each component manages its own state with `useState`/`useEffect`/`useRef`.
- Animations use a mix of Framer Motion, CSS keyframes, and SVG animations (e.g., ECG line in HeroShowcase).
- Path alias: `@/*` maps to `./src/*`.
