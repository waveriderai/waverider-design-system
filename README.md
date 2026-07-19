# @waverider/design-system

**Quantum Terminal** — the head of the WaveRider app family.

One foundation, one semantic contract, thin per-app skins under a governed
variance budget. WaveFinder is the proving ground, not the owner.

## Layers

| Layer | What | Where | Varies? |
|---|---|---|---|
| **L0** Foundation | Type scale, spacing rhythm, radius, motion, grayscale, elevation | `tokens/core.css` | Never per-app |
| **L1** Semantic | Role tokens — `--wr-surface-*`, `--wr-text-*`, `--wr-up-*`, `--wr-chart-*` | `tokens/core.css` | Names fixed, values remappable |
| **L2** App skin | Accent + density + **one** signature | `tokens/skins/*.css` | Yes — within budget |
| **L3** Components | Built from L0–L2 | App repos | Yes |

## Install

```bash
npm i @waverider/design-system
```

```js
// tailwind.config.js
import wrPreset from "@waverider/design-system/tailwind-preset";
export default { presets: [wrPreset], content: ["./src/**/*.{ts,tsx}"] };
```

```css
/* globals.css */
@import "@waverider/design-system/tokens.css";
```

```html
<html data-wr-app="wavefinder" data-wr-polarity="dark" data-wr-density="compact">
```

Everything else is attribute-driven at runtime:

| Attribute | Values |
|---|---|
| `data-wr-app` | `wavefinder` · `wavefinder-tw` · `waverider-marketing` |
| `data-wr-polarity` | `dark` (default) · `light` |
| `data-wr-density` | `compact` · `standard` · `comfortable` |
| `data-wr-vision` | unset · `deuteranopia` · `protanopia` · `tritanopia` |

## Why CSS variables and not hex

Before this package, tokens lived in **two** places — literal hex in
`tailwind.config.ts` and the same values again as `:root` custom properties in
`globals.css` — with nothing keeping them in sync. They agreed by luck.

Here the custom properties are the only source, and the Tailwind preset
consumes them. That is what makes polarity, density and vision switching work
at runtime from a single attribute: every utility is a `var()` reference.

## Migration is zero-edit

The preset preserves the established class vocabulary (`bg-bg-surface`,
`text-text-primary`, `text-data-gain-5`, …) and points it at the new contract.
Adopting the preset requires no component changes. New code should prefer the
role-based names (`bg-surface-raised`, `text-content-secondary`, `text-up-strong`).

## Governance

Read [VARIANCE-BUDGET.md](./VARIANCE-BUDGET.md). The short version: an app may
vary **accent, density, and one signature**. Anything else is a foundation
change that moves the whole family.

```bash
scripts/check-variance.sh          # fails if a skin exceeds the budget
scripts/design-audit.sh ./src      # fails on raw palette / banned font / off-rhythm
```

Wire both into pre-commit in **every** family repo. The previous audit script
was documented but never installed — which is why ~55 drift violations
accumulated in `waverider-app` while everyone believed the contract held.

## Specimen

`specimen.html` renders the whole system with live polarity / density / vision
toggles. Screenshots in `od/`. Screenshots are the acceptance criterion — type
checks and tests do not catch layout defects.

## OD mirror

`od/DESIGN.md` is the Open Design mirror in OD's 9-section format. **OD has no
inheritance**, so it must be re-propagated when `tokens/core.css` changes or it
silently drifts.

## Status

| Item | State |
|---|---|
| L0 + L1 contract | ✅ built, compile-verified |
| Tailwind preset | ✅ verified — utilities resolve to `var(--wr-*)` |
| Light polarity | ✅ built, monotonic ramp verified |
| Density scale | ✅ built |
| Colorblind-safe palette | ✅ built |
| Enforcement scripts | ✅ built, run against real code |
| WaveFinder skin | ✅ defined |
| TW / marketing skins | ✅ defined |
| AIChart · Trade Ideas · WaveLogger · TradeDesk skins | ⚠️ need accent decisions |
| Adoption in `waverider-app` | ❌ not started — nothing consumes this yet |
| Pre-commit hooks installed | ❌ not started |
| OD design system registered | ❌ not started |
