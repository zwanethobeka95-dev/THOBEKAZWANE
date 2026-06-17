# Brand Design System: Thobeka Zwane

A high-end, minimalist visual brand identity designed for premium student cohorts and professional consulting.

## Core Philosophy

- **Sophisticated Minimalism:** Generous whitespace, razor-sharp alignment, and high-quality typography over cluttered components.
- **Warm & Engaging:** Warm cream surfaces replace sterile white to create a friendly, human-centric, and approachable vibe.
- **Aesthetic Precision:** High contrast, smooth transitions, subtle micro-interactions, and premium layouts.

---

## 1. Color System

We use HSL-based values to ensure seamless consistency, accessibility, and high contrast.

| Token | HSL / Hex Value | Role |
| :--- | :--- | :--- |
| `Cream (Base Background)` | `hsl(36, 40%, 98%)` / `#FAF7F2` | Warm, organic base background. |
| `Soft Sand (Secondary Background)`| `hsl(36, 25%, 94%)` / `#F3EDE2` | Alternating section colors, subtle card backings. |
| `Charcoal (Primary Text)` | `hsl(0, 0%, 13%)` / `#212121` | High contrast, elegant dark text. |
| `Muted Charcoal (Secondary Text)` | `hsl(0, 0%, 42%)` / `#6B6B6B` | Secondary details, captions, and body labels. |
| `Warm Clay (Accent Color)` | `hsl(18, 55%, 52%)` / `#D46A43` | CTAs, focus indicators, highlight links, and buttons. |
| `Warm Clay Hover` | `hsl(18, 55%, 45%)` / `#BA5731` | Button hover and active states. |
| `Sage Green (Secondary Accent)` | `hsl(145, 18%, 46%)` / `#608A72` | Secondary metrics, success status. |
| `Pure White (Card background)` | `hsl(0, 0%, 100%)` / `#FFFFFF` | Core container/card fills. |

---

## 2. Typography

- **Headings (Display):** Playfair Display
  - *Serif*, elegant, editorial feel. Use for Hero statements, section titles, and key quotes.
- **Body & Interface:** Plus Jakarta Sans
  - *Sans-serif*, geometric, legible, and modern. Use for copy, buttons, labels, and metadata.

### Scale

- **Display Headline:** `3.5rem` / `clamp(2.5rem, 5vw, 4rem)`
- **Heading 1:** `2.5rem` / `clamp(2rem, 4vw, 3rem)`
- **Heading 2:** `1.8rem` / `clamp(1.5rem, 3vw, 2.2rem)`
- **Heading 3:** `1.25rem` / `clamp(1.1rem, 2vw, 1.4rem)`
- **Body Large:** `1.125rem`
- **Body Default:** `1rem`
- **Caption / UI Small:** `0.875rem`

---

## 3. Spacing & Grid

We use responsive padding/margin variables using a fluid spacing scale.

- `xs` (Extra Small): `0.5rem` (8px)
- `sm` (Small): `1rem` (16px)
- `md` (Medium): `1.5rem` (24px)
- `lg` (Large): `2.5rem` (40px)
- `xl` (Extra Large): `4rem` (64px)
- `xxl` (Double Extra Large): `6rem` (96px)

### Layout Rules
- Section vertical spacing: `var(--space-xxl)` on desktop, `var(--space-xl)` on mobile.
- Section inner container max-width: `1140px`.
- Grid gap: `var(--space-lg)`.
- Whitespace ratio: Keep at least 40% of page area empty to draw attention to typography and calls-to-action.

---

## 4. Visual Elements & Shadows

- **Border Radius:** `12px` (Cards), `6px` (Forms/Inputs), `50px` (Pills/Buttons)
- **Soft Shadow (Elevated Cards):** `0 10px 30px rgba(0, 0, 0, 0.03)`
- **Interactive Shadow (Hover):** `0 20px 40px rgba(18, 12, 10, 0.06)`
- **Borders:** `1px solid rgba(0, 0, 0, 0.06)`
