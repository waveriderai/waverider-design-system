/* =============================================================================
   WaveRider Design System — Tailwind preset

   Every color here resolves to var(--wr-*) from tokens/core.css. There is no
   literal hex in this file, by design: hex lived in two places (tailwind.config
   and globals.css :root) with nothing syncing them. This preset makes the CSS
   custom properties the ONLY source, and Tailwind a consumer of them.

   Consequence: polarity and density switching work automatically. Change
   data-wr-polarity on <html> and every Tailwind utility follows, because they
   are all var() references.

   Usage in an app:
     import wrPreset from "@waverider/design-system/tailwind-preset";
     export default { presets: [wrPreset], content: [...] };

   LEGACY ALIASES: the existing class vocabulary (bg-bg-surface,
   text-text-primary, text-data-gain-5, ...) is preserved verbatim so that
   adopting this preset requires ZERO component edits. New code should prefer
   the role-based names (bg-surface-raised, text-primary, text-up-strong).
   ========================================================================== */

/* Colors are stored as RGB CHANNEL TRIPLETS (--wr-x-rgb: 6 182 212) rather than
   hex, because Tailwind cannot apply an opacity modifier to a var() holding a
   full color. waverider-app uses 1488 such modifiers (bg-brand/20,
   border-brand/30, ...), so this is required, not stylistic.

   c()  solid token      -> rgb(var(--x-rgb))            , modifier replaces alpha
   ca() token with a default alpha (borders, chart grid)
        -> rgb(var(--x-rgb) / var(--x-a))                , modifier replaces alpha

   Alpha REPLACEMENT (not multiplication) matches Tailwind's built-in behaviour
   for rgba() theme values, so the previous inline config's semantics are
   preserved exactly. Verified by scripts/verify-ds-equivalence.mjs. */
const c = (v) => ({ opacityValue }) =>
  opacityValue === undefined ? `rgb(var(${v}-rgb))` : `rgb(var(${v}-rgb) / ${opacityValue})`;

/* NOTE on the var(--tw-) check: for bg/text/border utilities Tailwind does not
   pass `undefined` when there is no opacity modifier — it passes its own
   `var(--tw-bg-opacity)` (etc), which defaults to 1. Checking only for
   `undefined` therefore silently DROPS the token's default alpha, turning
   e.g. text-border-default from 20% opaque to fully opaque. That is a real
   regression (21 such usages in waverider-app) and it is invisible until
   someone looks at the pixels. An explicit modifier still arrives as a bare
   number, so the two cases stay distinguishable. */
const ca = (v) => ({ opacityValue }) =>
  opacityValue === undefined || String(opacityValue).startsWith("var(--tw-")
    ? `rgb(var(${v}-rgb) / var(${v}-a))`
    : `rgb(var(${v}-rgb) / ${opacityValue})`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-wr-polarity="dark"]'],

  theme: {
    extend: {
      colors: {
        /* --- Preferred role-based vocabulary (use these in new code) ------ */
        surface: {
          void: c("--wr-surface-void"),
          base: c("--wr-surface-base"),
          raised: c("--wr-surface-raised"),
          elevated: c("--wr-surface-elevated"),
          overlay: c("--wr-surface-overlay"),
        },
        content: {
          primary: c("--wr-text-primary"),
          secondary: c("--wr-text-secondary"),
          muted: c("--wr-text-muted"),
          inverse: c("--wr-text-inverse"),
        },
        up: {
          strong: c("--wr-up-strong"),
          mid: c("--wr-up-mid"),
          weak: c("--wr-up-weak"),
        },
        down: {
          weak: c("--wr-down-weak"),
          mid: c("--wr-down-mid"),
          strong: c("--wr-down-strong"),
        },
        flat: c("--wr-flat"),
        chart: {
          1: c("--wr-chart-1"),
          2: c("--wr-chart-2"),
          3: c("--wr-chart-3"),
          4: c("--wr-chart-4"),
          5: c("--wr-chart-5"),
          6: c("--wr-chart-6"),
          7: c("--wr-chart-7"),
          8: c("--wr-chart-8"),
          grid: ca("--wr-chart-grid"),
          axis: c("--wr-chart-axis"),
          crosshair: ca("--wr-chart-crosshair"),
          band: ca("--wr-chart-band"),
        },
        tier: {
          rider: c("--wr-tier-rider"),
          pro: c("--wr-tier-pro"),
          advanced: c("--wr-tier-advanced"),
        },

        /* --- Established vocabulary (kept so no component needs editing) -- */
        "bg-void": c("--wr-surface-void"),
        "bg-base": c("--wr-surface-base"),
        "bg-surface": c("--wr-surface-raised"),
        "bg-elevated": c("--wr-surface-elevated"),
        "bg-overlay": c("--wr-surface-overlay"),

        brand: {
          DEFAULT: c("--wr-accent"),
          glow: c("--wr-accent-hover"),
          hover: c("--wr-accent-hover"),
          muted: c("--wr-accent-muted"),
          text: c("--wr-accent-text"),
          contrast: c("--wr-accent-contrast"),
        },

        accent: {
          gold: c("--wr-tier-rider"),
          emerald: c("--wr-tier-pro"),
          violet: c("--wr-tier-advanced"),
        },

        data: {
          "gain-5": c("--wr-up-strong"),
          "gain-3": c("--wr-up-mid"),
          "gain-1": c("--wr-up-weak"),
          neutral: c("--wr-flat"),
          "loss-1": c("--wr-down-weak"),
          "loss-3": c("--wr-down-mid"),
          "loss-5": c("--wr-down-strong"),

          /* ---- DEPRECATED — chromatically named, 171 uses in waverider-app --
             These name a COLOR ("green") rather than a MEANING ("up"), which is
             the exact thing this contract exists to stop. They are kept only so
             adoption needs no component edits.

             ⚠ They map to directional tokens, so they WILL flip under
             data-wr-convention="east-asian". If a `data-green-5` is being used
             for a status (a live dot, a "healthy" badge) rather than a price
             move, it must move to `success` / `warning` / `danger` BEFORE that
             app ever enables a market convention. That mistake already exists
             in wavefinder-tw.

             Migration: data-green-5 → data-gain-5 (or `up-strong`), etc. */
          "green-5": c("--wr-up-strong"),
          "green-4": c("--wr-up-mid"),
          "green-3": c("--wr-up-weak"),
          cyan: c("--wr-accent"),
          yellow: c("--wr-warning"),
          red: c("--wr-down-strong"),
        },

        volume: {
          high: c("--wr-volume-high"),
          surge: c("--wr-volume-surge"),
        },

        "text-primary": c("--wr-text-primary"),
        "text-secondary": c("--wr-text-secondary"),
        "text-muted": c("--wr-text-muted"),
        "text-inverse": c("--wr-text-inverse"),

        "border-subtle": ca("--wr-border-subtle"),
        "border-default": ca("--wr-border-default"),
        "border-strong": ca("--wr-border-strong"),
        "border-glow": ca("--wr-border-focus"),

        success: c("--wr-success"),
        warning: c("--wr-warning"),
        error: c("--wr-danger"),
        info: c("--wr-info"),
      },

      fontFamily: {
        display: "var(--wr-font-display)",
        body: "var(--wr-font-body)",
        mono: "var(--wr-font-mono)",
        /* DEPRECATED alias. Without it, `font-sans` silently falls back to
           Tailwind's default stack instead of Jakarta — a real regression. */
        sans: "var(--wr-font-body)",
      },

      fontSize: {
        "display-xl": ["var(--wr-display-xl)", { lineHeight: "var(--wr-display-xl-lh)", letterSpacing: "var(--wr-display-xl-ls)" }],
        "display-lg": ["var(--wr-display-lg)", { lineHeight: "var(--wr-display-lg-lh)", letterSpacing: "var(--wr-display-lg-ls)" }],
        "display-md": ["var(--wr-display-md)", { lineHeight: "var(--wr-display-md-lh)", letterSpacing: "var(--wr-display-md-ls)" }],
        "display-sm": ["var(--wr-display-sm)", { lineHeight: "var(--wr-display-sm-lh)" }],

        "data-xl": ["var(--wr-data-xl)", { lineHeight: "var(--wr-data-xl-lh)" }],
        "data-lg": ["var(--wr-data-lg)", { lineHeight: "var(--wr-data-lg-lh)" }],
        "data-md": ["var(--wr-data-md)", { lineHeight: "var(--wr-data-md-lh)" }],
        "data-sm": ["var(--wr-data-sm)", { lineHeight: "var(--wr-data-sm-lh)" }],

        xs: ["12px", { lineHeight: "1.5" }],
        sm: ["14px", { lineHeight: "1.5" }],
        base: ["16px", { lineHeight: "1.6" }],
        lg: ["18px", { lineHeight: "1.6" }],
        xl: ["20px", { lineHeight: "1.5" }],
        "2xl": ["24px", { lineHeight: "1.4" }],
        "3xl": ["30px", { lineHeight: "1.3" }],
        "4xl": ["36px", { lineHeight: "1.2" }],
        "5xl": ["48px", { lineHeight: "1.1" }],
      },

      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
        sidebar: "var(--wr-sidebar-w)",
        "sidebar-collapsed": "var(--wr-sidebar-collapsed-w)",
        topbar: "var(--wr-topbar-h)",
        /* Density-aware — these track data-wr-density automatically. */
        "row-h": "var(--wr-row-h)",
        "cell-px": "var(--wr-cell-px)",
        "cell-py": "var(--wr-cell-py)",
        "control-h": "var(--wr-control-h)",
        "stack-gap": "var(--wr-stack-gap)",
        "section-gap": "var(--wr-section-gap)",
      },

      borderRadius: {
        sm: "var(--wr-radius-sm)",
        DEFAULT: "var(--wr-radius-md)",
        md: "var(--wr-radius-lg)",
        lg: "var(--wr-radius-xl)",
        xl: "var(--wr-radius-2xl)",
        "2xl": "20px",
        "3xl": "24px",
      },

      boxShadow: {
        "glow-cyan": "var(--wr-glow-accent)",
        "glow-brand": "var(--wr-glow-accent)",
        "glow-gain": "var(--wr-glow-up)",
        "glow-loss": "var(--wr-glow-down)",
        "glow-gold": "0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.2)",
        "glow-emerald": "0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2)",
        elevated: "var(--wr-shadow-elevated)",
        card: "var(--wr-shadow-card)",
      },

      backgroundImage: {
        "gradient-void": "var(--wr-gradient-void)",
        "gradient-glow": "var(--wr-gradient-glow)",
        "gradient-surface": "var(--wr-gradient-surface)",
        "gradient-cta": "var(--wr-gradient-cta)",
        "gradient-rider": "var(--wr-gradient-rider)",
        "gradient-pro": "var(--wr-gradient-pro)",
      },

      transitionTimingFunction: {
        smooth: "var(--wr-ease)",
        expo: "var(--wr-ease-out-expo)",
      },

      transitionDuration: {
        fast: "var(--wr-dur-fast)",
        base: "var(--wr-dur-base)",
        slow: "var(--wr-dur-slow)",
      },

      backdropBlur: { xs: "2px" },

      animation: {
        "flash-up": "wr-flash-up var(--wr-dur-slow) ease-out",
        "flash-down": "wr-flash-down var(--wr-dur-slow) ease-out",
        "pulse-glow": "wr-pulse-glow var(--wr-dur-ambient) cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "wr-slide-up-fade var(--wr-dur-base) ease-out forwards",
        "slide-down": "wr-slide-down-fade var(--wr-dur-base) ease-out forwards",
        "fade-in": "wr-fade-in var(--wr-dur-base) ease-out forwards",
        "draw-line": "wr-draw-line 1s ease-out forwards",
        "scan-line": "wr-scan-line 8s linear infinite",
        "signal-tape": "wr-signal-tape 32s linear infinite",
        "slide-in-right": "wr-slide-in-right 0.4s ease-out forwards",
        "bounce-left": "wr-bounce-left 1s ease-in-out 0.5s",
        "sidebar-expand": "wr-sidebar-expand var(--wr-dur-base) var(--wr-ease) forwards",
        "sidebar-collapse": "wr-sidebar-collapse var(--wr-dur-base) var(--wr-ease) forwards",
        "drawer-in": "wr-drawer-in var(--wr-dur-base) ease-out forwards",
        "drawer-out": "wr-drawer-out 0.2s ease-in forwards",
        "drawer-in-right": "wr-drawer-in-right var(--wr-dur-base) ease-out forwards",
        "drawer-up": "wr-drawer-up var(--wr-dur-base) var(--wr-ease-out-expo) forwards",
      },

      keyframes: {
        /* Flash uses the directional tokens rather than baked rgba, so a
           colorblind-safe or TW-inverted skin re-tints the flash for free. */
        "wr-flash-up": {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "color-mix(in srgb, var(--wr-up-strong) 30%, transparent)" },
        },
        "wr-flash-down": {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "color-mix(in srgb, var(--wr-down-strong) 30%, transparent)" },
        },
        "wr-pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 color-mix(in srgb, var(--wr-accent) 40%, transparent)", opacity: "1" },
          "50%": { boxShadow: "0 0 8px 4px color-mix(in srgb, var(--wr-accent) 40%, transparent)", opacity: "0.8" },
        },
        "wr-slide-up-fade": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "wr-slide-down-fade": {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "wr-fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "wr-draw-line": { to: { strokeDashoffset: "0" } },
        "wr-scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "wr-signal-tape": { to: { transform: "translateX(-50%)" } },
        "wr-slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "wr-bounce-left": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-6px)" },
        },
        "wr-sidebar-expand": {
          from: { width: "var(--wr-sidebar-collapsed-w)" },
          to: { width: "var(--wr-sidebar-w)" },
        },
        "wr-sidebar-collapse": {
          from: { width: "var(--wr-sidebar-w)" },
          to: { width: "var(--wr-sidebar-collapsed-w)" },
        },
        "wr-drawer-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "wr-drawer-out": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "wr-drawer-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "wr-drawer-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
    },
  },

  plugins: [],
};
