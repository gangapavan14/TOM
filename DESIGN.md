---
# gstack: design-md-format=spec
name: Tirumala Oil Mill (TOM)
description: High-contrast monochrome enterprise industrial ERP with universal Inter typography, directly derived from the official circular TOM seal
colors:
  primary: "#ffffff"
  on-primary: "#09090b"
  surface: "#121215"
  surface-elevated: "#18181b"
  background: "#09090b"
  text: "#fafafa"
  text-muted: "#a1a1aa"
  accent: "#e4e4e7"
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
    letterSpacing: 0.05em
    fontWeight: 600
  mono:
    fontFamily: Inter, monospace
    fontFeature: tnum, zero
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
    backgroundColor: "#e4e4e7"
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

**Creative North Star:** High-Contrast Monochrome Enterprise — deep obsidian black canvas with stark white accents, hairline zinc borders, and refined typographic precision directly mirroring the official circular black-and-white **TOM** seal.

**Product Context:** Tirumala Oil Mill (TOM) Business Management System — a full-scale operational ERP coordinating farmers, commission agents, lab technicians, expeller operators, warehouse keepers, and B2B wholesale buyers.

**Brand Identity & Logo:**
- **Central Mark:** Geometric bold monogram `TOM` enclosed in a dynamic circular boundary framed by an organic wheat/seed crop stalk on the right quadrant.
- **Brand Palette:** Pure Black & Crisp White high-contrast circular seal.
- **Brand Subtitle:** `TIRUMALA OIL MILL` in tracked, modern geometric sans-serif capitals.
- **Brand Asset Path:** `tom-frontend/public/tom_logo.png` & `frontend/img/logo.png`.

**Mode per Surface:**
- **Persuade:** Public B2C Showcase Catalogue (`/catalogue`) & Landing. Clean white/obsidian cards, lab quality certification badges, cold-pressed purity showcase.
- **Operate:** Floor Workspaces (Procurement Yard, Weighbridge, Expeller Control, Inventory Godowns). High data density, instant action buttons, clear visual feedback.
- **Read:** Central Document Repository (`/documents`), Lab Analysis Reports, Bilateral Credit Deeds. High-contrast typography, crisp tabular numbers.
- **Experience:** Admin Executive Cockpit (`/admin/dashboard`). Interactive KPI telemetry, inflow curves, real-time approval pipelines.

---

## Colors

**Strategy:** High-Contrast Monochrome & Functional Semantics — stark black canvas (`#09090b`), deep zinc structural layers (`#121215` / `#18181b` / `#27272a`), pure white primary action triggers (`#ffffff`), and crisp neutral typography (`#fafafa` / `#a1a1aa`). Color strictly signals domain state:
- **Obsidian Canvas (`#09090b`):** Pitch black canvas directly echoing the outer tone of the circular logo seal.
- **Zinc Structural Surfaces (`#121215` / `#18181b` / `#27272a`):** Discrete layers for cards, tables, modal dialogs, and navigation sidebars.
- **High-Contrast White Primary (`#ffffff`):** Primary action buttons (`bg-white text-zinc-950 hover:bg-zinc-200`), active navigation markers, and verified indicators.
- **Crop Emerald (`#10b981`):** Passed lab inspections (Grade A+/A), completed dispatches, and healthy mill machinery.
- **Harvest Amber (`#f59e0b`):** 12-hr reservation timer warnings and pending handovers.
- **Rejection Crimson (`#ef4444`):** Grade D condition rejection (Section 8.7), price escalations, and machine alerts.

---

## Typography

The typographic system is universally powered by **Inter** (Rasmus Andersson's variable UI typeface designed for screens):

1. **Universal Font:** `Inter` across all headings, display titles, body copy, controls, and data tables.
2. **Display & Section Headers:** `Inter` (weights 700 / 800, `letter-spacing: -0.025em`). Bold, authoritative, mirroring the central `TOM` emblem.
3. **Body & Controls:** `Inter` (weights 400 / 500 / 600, `font-size: 0.875rem`, line-height: 1.5).
4. **Labels & Metadata:** `Inter` (uppercase, `letter-spacing: 0.05em`, `font-size: 0.75rem`, weight: 600). Directly matching the tracked `TIRUMALA OIL MILL` subtitle.
5. **OpenType Features Enabled:**
   - Contextual alternates (`cv02`, `cv03`, `cv04`, `cv11`, `calt`).
   - Tabular Numbers (`tnum`) and Slashed Zero (`zero`) for all permanent bag IDs (`TUR-260926-001-001`), weighbridge weights (`16,300 kg`), and rupee amounts (`₹1,80,000.00`).

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
