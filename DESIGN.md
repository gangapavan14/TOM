---
# gstack: design-md-format=spec
name: Tirumala Oil Mill (TOM)
description: Pristine minimalist light enterprise console with universal Inter typography, inspired by modern AI developer consoles (Vikky Console)
colors:
  primary: "#09090b"
  on-primary: "#ffffff"
  surface: "#ffffff"
  surface-elevated: "#fafafa"
  surface-sidebar: "#fafafa"
  background: "#fbfbfb"
  text: "#09090b"
  text-muted: "#71717a"
  border: "#e4e4e7"
  accent: "#18181b"
  success: "#10b981"
  warning: "#f59e0b"
  error: "#ef4444"
typography:
  display:
    fontFamily: Inter, sans-serif
    fontWeight: 700
    letterSpacing: -0.025em
  body:
    fontFamily: Inter, sans-serif
    fontSize: 0.875rem
    lineHeight: 1.5
    fontFeature: cv02, cv03, cv04, cv11, calt
  label:
    fontFamily: Inter, sans-serif
    fontSize: 0.75rem
    letterSpacing: 0.04em
    fontWeight: 600
  mono:
    fontFamily: Inter, monospace
    fontFeature: tnum, zero
rounded:
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-primary-hover:
    backgroundColor: "#18181b"
  input:
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    backgroundColor: "#ffffff"
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.lg}"
  nav-link:
    textColor: "{colors.text}"
---

# Tirumala Oil Mill (TOM) — Design System

## Overview

**Creative North Star:** Pristine Minimalist Light Console — crisp white canvas (`#fbfbfb` / `#ffffff`), refined light sidebar (`#fafafa` with hairline `#e4e4e7` division), soft pill tabs (`bg-zinc-100 border border-zinc-200`), deep black typography (`#09090b`), and clean black primary buttons, directly modeled after modern developer consoles (Vikky Console).

**Product Context:** Tirumala Oil Mill (TOM) Business Management System — full-scale operational ERP coordinating farmers, commission agents, lab technicians, expeller operators, warehouse keepers, and B2B wholesale buyers.

**Brand Identity & Logo:**
- **Central Mark:** Official circular `TOM` grain-stalk seal housed in a sleek rounded-lg dark emblem box (`w-9 h-9 rounded-lg bg-zinc-950 p-1.5`).
- **Brand Subtitle:** `Console` or `TIRUMALA OIL MILL` in tracked, modern geometric sans-serif capitals.
- **Brand Asset Path:** `tom-frontend/public/tom_logo.png` & `frontend/img/logo.png`.

---

## Colors

**Strategy:** Pristine Light UI & Crisp Architectural Density:
- **Canvas (`#fbfbfb` / `#ffffff`):** Ultra-clean white background for maximum daylight clarity.
- **Sidebar Surface (`#fafafa`):** Subtle off-white structural panel bounded by a clean `1px` border (`#e4e4e7`).
- **Cards & Data Panels (`#ffffff`):** Pure white elevated containers with hairline border (`#e4e4e7`) and subtle ambient shadow (`0 1px 3px rgba(0,0,0,0.05)`).
- **Primary Text (`#09090b`):** High-contrast deep charcoal/black for instant readability.
- **Secondary & Muted Text (`#71717a` / `#a1a1aa`):** Subdued metadata, field labels, and timestamps.
- **Primary Action (`#09090b`):** Pure black button with crisp white typography (`bg-zinc-900 text-white hover:bg-black rounded-lg`).
- **Active Navigation:** Soft light gray rounded pill (`bg-zinc-200/70 text-zinc-950 font-semibold rounded-lg px-3 py-2`).
- **Semantic Indicators:**
  - Crop Emerald (`#10b981` / `bg-emerald-50 text-emerald-700 border-emerald-200`): Passed lab inspections, active stock.
  - Harvest Amber (`#f59e0b` / `bg-amber-50 text-amber-700 border-amber-200`): 12-hr reservation timer warnings & pending handovers.
  - Rejection Crimson (`#ef4444` / `bg-rose-50 text-rose-700 border-rose-200`): Grade D rejection & critical safety alerts.

---

## Typography

The typographic system is universally powered by **Inter**:
1. **Universal Font:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
2. **Display & Section Headers:** `Inter` (weights 600 / 700 / 800, `letter-spacing: -0.025em`, color `#09090b`).
3. **Body & Controls:** `Inter` (weights 400 / 500, `font-size: 0.875rem`, color `#09090b` / `#52525b`).
4. **Labels & Metadata:** `Inter` (uppercase, `letter-spacing: 0.04em`, `font-size: 0.75rem`, weight: 600, color `#71717a`).
5. **OpenType Features Enabled:**
   - Contextual alternates (`cv02`, `cv03`, `cv04`, `cv11`, `calt`).
   - Tabular Numbers (`tnum`) and Slashed Zero (`zero`) for all permanent bag IDs, weighbridge weights, and rupee amounts.

---

## Elevation & Depth

- **No generic glows or halos:** Pure geometric depth via 1px hairline borders (`rgba(255, 255, 255, 0.08)`) and soft natural drop shadows (`box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4)`).
- **Hairline separation:** Clean 1px division between sidebar, topbar, table rows, and status badges.
- **Modal Depth:** Translucent obsidian backdrop (`rgba(0, 0, 0, 0.7)`) with elevated graphite container (`#1a1d22`).

---

## Shapes & Radii

- **Badges & Tags:** `rounded-full` (`9999px`) for pill status tags (Verified, Grade A+, 50kg Standard).
- **Inputs & Action Buttons:** `rounded-sm` to `rounded-md` (`6px` – `8px`). Crisp, professional, avoiding playful or bubbly curves.
- **Cards & Data Panels:** `rounded-lg` (`14px` – `16px`). Clean containers framing operational tables and KPI cards.
- **Official Logo Emblem:** Rounded container with clean white background framing the black circular wheat-arc mark.

---

## Do's and Don'ts

### Do:
- Always use the official `tom_logo.png` in the top sidebar, login screen, invoices, and weighbridge print receipts.
- Format all weights, batch numbers, and rupee values in tabular monospace (`JetBrains Mono`).
- Use crisp status badges with semantic colors (Emerald for passed, Amber for pending, Crimson for rejected).
- Keep high contrast between text (`#f8fafc`) and background surfaces (`#131518`).

### Don't:
- Never use generic leaf emojis (`🌿`) as the logo mark now that the official circular wheat emblem is established.
- Never use purple/violet gradients or neon AI slop styling.
- Never use floating blobs, decorative wavy dividers, or centered-everything layouts.
- Never hide business logic behind generic CRUD tables; always model explicit domain status transitions.

---

## Motion & Interaction

- **Approach:** Minimal-Functional. Fast, crisp transitions aiding operational comprehension.
- **Durations:**
  - Micro: `100ms` for button hover and tab switches.
  - Short: `200ms` for modal open/close and drawer animations.
  - Smooth: `cubic-bezier(0.16, 1, 0.3, 1)` for non-bouncy, swift transitions.

---

## Decisions Log
| Date | Decision | Rationale |
| :--- | :--- | :--- |
| 2026-09-27 | Initial Design System Created | Built via `/design-consultation` rooted in the official circular grain-arc `TOM` logo. |
| 2026-09-27 | Clean Minimalist Enterprise Direction | Chosen to convey agricultural purity, industrial discipline, and modern enterprise reliability. |
| 2026-09-27 | Outfit + Inter + JetBrains Mono Stack | Aligns display typography with the geometric "TOM" mark, body UI with enterprise density, and mono with tabular mill weights. |
