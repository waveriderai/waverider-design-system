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

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-wr-polarity="dark"]'],

  theme: {
    extend: {
      colors: {
        /* --- Preferred role-based vocabulary (use these in new code) ------ */
        surface: {
          void: "var(--wr-surface-void)",
          base: "var(--wr-surface-base)",
          raised: "var(--wr-surface-raised)",
          elevated: "var(--wr-surface-elevated)",
          overlay: "var(--wr-surface-overlay)",
        },
        content: {
          primary: "var(--wr-text-primary)",
          secondary: "var(--wr-text-secondary)",
          muted: "var(--wr-text-muted)",
          inverse: "var(--wr-text-inverse)",
        },
        up: {
          strong: "var(--wr-up-strong)",
          mid: "var(--wr-up-mid)",
          weak: "var(--wr-up-weak)",
        },
        down: {
          weak: "var(--wr-down-weak)",
          mid: "var(--wr-down-mid)",
          strong: "var(--wr-down-strong)",
        },
        flat: "var(--wr-flat)",
        chart: {
          1: "var(--wr-chart-1)",
          2: "var(--wr-chart-2)",
          3: "var(--wr-chart-3)",
          4: "var(--wr-chart-4)",
          5: "var(--wr-chart-5)",
          6: "var(--wr-chart-6)",
          7: "var(--wr-chart-7)",
          8: "var(--wr-chart-8)",
          grid: "var(--wr-chart-grid)",
          axis: "var(--wr-chart-axis)",
          crosshair: "var(--wr-chart-crosshair)",
          band: "var(--wr-chart-band)",
        },
        tier: {
          rider: "var(--wr-tier-rider)",
          pro: "var(--wr-tier-pro)",
          advanced: "var(--wr-tier-advanced)",
        },

        /* --- Established vocabulary (kept so no component needs editing) -- */
        "bg-void": "var(--wr-surface-void)",
        "bg-base": "var(--wr-surface-base)",
        "bg-surface": "var(--wr-surface-raised)",
        "bg-elevated": "var(--wr-surface-elevated)",
        "bg-overlay": "var(--wr-surface-overlay)",

        brand: {
          DEFAULT: "var(--wr-accent)",
          glow: "var(--wr-accent-hover)",
          hover: "var(--wr-accent-hover)",
          muted: "var(--wr-accent-muted)",
          text: "var(--wr-accent-text)",
          contrast: "var(--wr-accent-contrast)",
        },

        accent: {
          gold: "var(--wr-tier-rider)",
          emerald: "var(--wr-tier-pro)",
          violet: "var(--wr-tier-advanced)",
        },

        data: {
          "gain-5": "var(--wr-up-strong)",
          "gain-3": "var(--wr-up-mid)",
          "gain-1": "var(--wr-up-weak)",
          neutral: "var(--wr-flat)",
          "loss-1": "var(--wr-down-weak)",
          "loss-3": "var(--wr-down-mid)",
          "loss-5": "var(--wr-down-strong)",
        },

        volume: {
          high: "var(--wr-volume-high)",
          surge: "var(--wr-volume-surge)",
        },

        "text-primary": "var(--wr-text-primary)",
        "text-secondary": "var(--wr-text-secondary)",
        "text-muted": "var(--wr-text-muted)",
        "text-inverse": "var(--wr-text-inverse)",

        "border-subtle": "var(--wr-border-subtle)",
        "border-default": "var(--wr-border-default)",
        "border-strong": "var(--wr-border-strong)",
        "border-glow": "var(--wr-border-focus)",

        success: "var(--wr-success)",
        warning: "var(--wr-warning)",
        error: "var(--wr-danger)",
        info: "var(--wr-info)",
      },

      fontFamily: {
        display: "var(--wr-font-display)",
        body: "var(--wr-font-body)",
        mono: "var(--wr-font-mono)",
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
