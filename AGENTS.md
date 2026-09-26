# Tirumala Oil Mill (TOM) — Agent Guidelines

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

## Core Invariant Business Rules (from 42-page Master Blueprint)
1. Stock is not inventory merely because somebody entered a receipt.
2. A procurement reservation automatically returns to available pool if not confirmed in 12 hours.
3. Once accepted quantity, grade, and price are finalized, there is no renegotiation (24-hour delivery window).
4. Grade D is strictly eliminated; D-level condition means rejection. Rejected stock never enters inventory or payables.
5. Permanent location-independent Bag IDs (e.g. `TUR-260926-001-001`) must never encode godown or room locations.
6. A customer pickup inventory deduction requires Senior Worker physical loading count + Field Officer verification signoff.
7. Cash collected by a sales representative is not an official credit reduction until Admin physically counts and verifies the handed-over currency.
8. Admin alone holds supreme financial authority (business payments, salaries, expenses, exceptional approvals).
