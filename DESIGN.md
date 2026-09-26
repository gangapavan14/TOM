---
# gstack: design-md-format=spec
name: Tirumala Oil Mill (TOM)
description: Clean minimalist enterprise industrial ERP grounded in precision commodity trading and authentic agricultural craft
colors:
  primary: "#d97706"
  on-primary: "#ffffff"
  surface: "#131518"
  surface-elevated: "#1a1d22"
  background: "#0a0b0d"
  text: "#f8fafc"
  text-muted: "#94a3b8"
  accent: "#f59e0b"
  success: "#10b981"
  warning: "#f59e0b"
  error: "#ef4444"
typography:
  display:
    fontFamily: Outfit, sans-serif
    fontWeight: 800
    letterSpacing: -0.03em
  body:
    fontFamily: Inter, sans-serif
    fontSize: 0.875rem
    lineHeight: 1.5
  label:
    fontFamily: Inter, sans-serif
    fontSize: 0.75rem
    letterSpacing: 0.06em
  mono:
    fontFamily: JetBrains Mono, monospace
    fontFeature: tnum
rounded:
  sm: 6px
  md: 10px
  lg: 16px
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
    rounded: "{rounded.sm}"
  button-primary-hover:
    backgroundColor: "#b45309"
  input:
    borderColor: "rgba(255, 255, 255, 0.1)"
    rounded: "{rounded.sm}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
  nav-link:
    textColor: "{colors.text}"
---

# Tirumala Oil Mill (TOM) — Design System

## Overview

**Creative North Star:** Clean Minimalist Enterprise — high-contrast obsidian slate surfaces with cold-pressed oil gold highlights, geometric precision, and authentic agricultural grain motif directly informed by the official circular **TOM** logo.

**Product Context:** Tirumala Oil Mill (TOM) Business Management System — a full-scale operational ERP coordinating farmers, commission agents, lab technicians, expeller operators, warehouse keepers, and B2B wholesale buyers.

**Brand Identity & Logo:**
- **Central Mark:** Geometric bold monogram `TOM` enclosed in a dynamic circular boundary framed by an organic wheat/seed crop stalk on the right quadrant.
- **Brand Subtitle:** `TIRUMALA OIL MILL` in tracked, modern geometric sans-serif capitals.
- **Brand Asset Path:** `tom-frontend/public/tom_logo.png` & `frontend/img/logo.png`.

**Mode per Surface:**
- **Persuade:** Public B2C Showcase Catalogue (`/catalogue`) & Landing. Clean white/obsidian cards, lab quality certification badges, cold-pressed purity showcase.
- **Operate:** Floor Workspaces (Procurement Yard, Weighbridge, Expeller Control, Inventory Godowns). High data density, instant action buttons, clear visual feedback.
- **Read:** Central Document Repository (`/documents`), Lab Analysis Reports, Bilateral Credit Deeds. High-contrast typography, crisp tabular numbers.
- **Experience:** Admin Executive Cockpit (`/admin/dashboard`). Interactive KPI telemetry, inflow curves, real-time approval pipelines.

---

## Colors

**Strategy:** Restrained & Committed — one deep obsidian baseline (`#0a0b0d` / `#131518`), one dominant agricultural gold accent (`#d97706` / `#f59e0b`), with crisp neutral typography (`#f8fafc`). Color is never gratuitous decoration; it strictly signals domain state:
- **Obsidian Canvas (`#0a0b0d`):** Deep void minimizing eye fatigue in high-contrast mill operations.
- **Graphite Surfaces (`#131518` / `#1a1d22`):** Discrete layers for cards, tables, modal dialogs, and navigation sidebars.
- **Cold-Pressed Amber (`#d97706`):** Primary action buttons, active navigation markers, and verified indicators.
- **Harvest Oil Gold (`#f59e0b`):** Key financial metrics, pricing highlights, and warning states (e.g. 12-hr reservation timer).
- **Crop Emerald (`#10b981`):** Passed lab inspections (Grade A+/A), completed dispatches, and healthy mill machinery.
- **Rejection Crimson (`#ef4444`):** Grade D condition rejection (Section 8.7), price escalations, and machine alerts.

---

## Typography

The typographic hierarchy directly translates the geometry of the official **TOM** logo:

1. **Display & Section Headers:** `Outfit` (weights 700 / 800 / 900, `letter-spacing: -0.03em`). Clean, geometric sans-serif echoing the strong, confident letterforms of the central `TOM` emblem.
2. **Body & Controls:** `Inter` (weights 400 / 500 / 600, `font-size: 0.875rem`). Crisp, legible across desktop displays and rugged mobile handsets on the mill floor.
3. **Labels & Metadata:** `Inter` (uppercase, `letter-spacing: 0.06em`, `font-size: 0.75rem`). Directly matches the tracked `TIRUMALA OIL MILL` bottom subtitle.
4. **Data, Permanent Bag IDs & Money:** `JetBrains Mono` (`font-feature-settings: "tnum"`). Guarantees that permanent bag barcodes (`TUR-260926-001-001`), weighbridge weights (`16,300 kg`), and rupee ledgers (`₹1,80,000.00`) align vertically in tables.

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
