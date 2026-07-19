# The Variance Budget

The rule that keeps the WaveRider apps a family instead of a collection.

## The principle

A family is roughly **90% shared, 10% varied**. Meta is the reference: Instagram,
WhatsApp, Messenger and Threads share type, spacing, motion and component anatomy;
they differ mainly in accent color and one or two signature moments. You can tell
them apart instantly, and you can tell they're related instantly. Both facts matter.

The failure mode is not "too similar." It's **every app quietly negotiating its own
exception** until nothing is shared and the family is a memory.

## The budget

Each app may vary **exactly three things**:

| Knob | What it means | Where it lives |
|---|---|---|
| **Accent** | `--wr-accent`, `--wr-accent-hover`, `--wr-accent-muted`, `--wr-accent-text`, `--wr-accent-contrast`, `--wr-border-focus` | `tokens/skins/<app>.css` |
| **Density** | `data-wr-density="compact\|standard\|comfortable"` | Set on `<html>` |
| **One signature** | A single distinctive element or moment. One. Not two. | `tokens/skins/<app>.css`, prefixed `--wr-signature-*` / `.wr-signature-*` |

Everything else — type scale, spacing rhythm, radius, elevation, motion easing and
duration, grayscale ramp, surface ramp, directional semantics, chart palette,
component anatomy, voice — is **L0 foundation and does not vary**.

## Want to change something outside the budget?

Then it isn't an app override. It's a **foundation change**, and the whole family
moves together. That's not a bureaucratic obstacle — it's the entire point. If
WaveFinder needs a tighter type scale, either every app needs it (change L0) or
WaveFinder doesn't actually need it (use density instead).

Concretely: edit `tokens/core.css`, re-propagate to the OD design systems, and
re-screenshot every app's canonical screen. If that sounds expensive, good — that
cost is what stops the family dissolving one reasonable-sounding exception at a time.

## Rules for accent selection

1. **≥30° hue separation** from the cyan anchor (`#06B6D4`, hue ≈ 187°) and from
   every other app's accent. Two apps with near-identical accents get the cost of
   varying with none of the benefit.
2. **No collision with semantic hues.** Green and red belong to direction. Amber
   belongs to the Rider tier and warnings. Violet belongs to advanced features.
   Blue belongs to volume. An accent that reuses one of those teaches users a
   false meaning.
3. **Must pass contrast in both polarities**, as fill and as text — which is why
   `--wr-accent` and `--wr-accent-text` are separate tokens. Set both.
4. **Anchor apps don't spend it.** WaveFinder, TW and the marketing site all carry
   family cyan on purpose. Spending accent variance on your flagship weakens the
   family signal rather than strengthening the app.

## Current allocation

| App | Accent | Density | Signature | Status |
|---|---|---|---|---|
| WaveFinder (US) | family cyan | `compact` | Scan-line sweep | ✅ defined |
| WaveFinder TW | family cyan | `compact` | Limit up/down flash | ✅ defined |
| WaveRider.ai marketing | family cyan | `comfortable` | Terminal glow band | ✅ defined |
| AIChart | — | `compact` | — | ⚠️ needs your call |
| Trade Ideas workbench | — | `compact` | — | ⚠️ needs your call |
| WaveLogger (3-Stop Journal) | — | `comfortable` | — | ⚠️ needs your call |
| TradeDesk | — | `standard` | — | ⚠️ needs your call |

The four unallocated apps need **brand decisions, not defaults.** I've deliberately
not invented hues for them — picking your product's identity color is your call, and
a placeholder would quietly become permanent. Densities above are proposals based on
what each surface does.

Candidate accents that satisfy the rules, if useful as a starting point:

| Hue | Value | Separation from cyan | Notes |
|---|---|---|---|
| Indigo | `#6366F1` | ~52° | Distinct from volume blue; reads "analytical" |
| Rose | `#F43F5E` | ~160° | ⚠️ risky — too near loss red for a trading surface |
| Lime | `#84CC16` | ~100° | ⚠️ risky — too near gain green |
| Teal | `#14B8A6` | ~14° | ❌ fails separation rule against cyan |
| Magenta | `#D946EF` | ~105° | Clean separation, no semantic collision |
| Slate-blue | `#7C8CF8` | ~45° | Softer; good for a journaling surface |

Note how many candidates a trading palette rules out: direction, tier and volume
already claim green, red, amber, violet and blue. The usable space is genuinely
narrow, which is another argument for apps sharing the anchor unless they have a
real reason not to.

## Enforcement

Convention doesn't hold on its own — the current codebase has ~49 raw-palette
leaks precisely because the documented audit script was never wired up.

- `scripts/design-audit.sh` fails on raw Tailwind palette colors, banned fonts,
  purple gradients, and off-rhythm spacing.
- Install it as a pre-commit hook in every family repo. Documented-but-uninstalled
  enforcement is the same as no enforcement.
- `scripts/check-variance.sh` fails if an app skin overrides anything outside the
  budget. This is the rule that has teeth: it makes exceeding the budget a build
  failure rather than a conversation nobody has.
