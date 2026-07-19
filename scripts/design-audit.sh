#!/usr/bin/env bash
# =============================================================================
# design-audit.sh — catch design-token drift before it reaches main.
#
# The drift pattern this exists to stop: when an AI (or a human in a hurry) is
# unsure, it reaches for a raw Tailwind palette color. `text-gray-400` is a
# reasonable-looking value that is outside the system. Nothing fails, no test
# breaks, and visual consistency erodes silently.
#
# Usage:  scripts/design-audit.sh ./src [--fix-hints]
# Exit:   0 = clean, 1 = violations found (blocks a pre-commit hook)
# =============================================================================

set -uo pipefail

TARGET="${1:-./src}"

if [[ ! -e "$TARGET" ]]; then
  echo "design-audit: target not found: $TARGET" >&2
  exit 1
fi

RED=$'\033[0;31m'; YEL=$'\033[0;33m'; GRN=$'\033[0;32m'; DIM=$'\033[2m'; OFF=$'\033[0m'
total=0

# --- Suppressions -------------------------------------------------------------
# A checker with no escape hatch gets switched off entirely, so there are two,
# and both require a written reason that stays visible in the diff:
#
#   same line:   className="..."  /* wr-audit-ignore canvas needs a real color */
#   whole file:  put `wr-audit-ignore-file <reason>` in the first 10 lines
#
# Legitimate cases seen so far: HTML email templates (no CSS-var support in mail
# clients) and canvas charting libraries that cannot resolve var().
# Suppressions are COUNTED and reported, so they stay visible rather than
# becoming a quiet way to opt out of the design system.
suppressed=0

file_suppressed() {
  head -10 "$1" 2>/dev/null | grep -q 'wr-audit-ignore-file'
}

# A hit is suppressed if its own line carries `wr-audit-ignore`, the PRECEDING
# line carries `wr-audit-ignore-next`, or it falls between
# `wr-audit-ignore-start` and `wr-audit-ignore-end`.
#
# The -next form matters in JSX: appending a `{/* ... */}` comment after a tag
# introduces a whitespace text child and can change rendering. An own-line
# comment above the element is safe, because JSX trims whitespace-only lines. The block form
# exists because some legitimate cases span several lines (a third-party logo
# SVG, a chart config block) and one comment per line would be unreadable.
is_suppressed() {
  awk -v target="$2" '
    /wr-audit-ignore-start/ { inblk=1; next }
    /wr-audit-ignore-end/   { inblk=0; next }
    { prev2=prev; prev=$0 }
    NR==target { if (inblk || $0 ~ /wr-audit-ignore/ || prev2 ~ /wr-audit-ignore-next/) print "yes"; exit }
  ' "$1" 2>/dev/null | grep -q yes
}

# scan <label> <regex> <remedy>
scan() {
  local label="$1" pattern="$2" remedy="$3"
  local raw hits
  raw="$(grep -rInE --include='*.tsx' --include='*.jsx' --include='*.ts' --include='*.js' \
          --include='*.css' --include='*.html' "$pattern" "$TARGET" 2>/dev/null || true)"
  [[ -z "$raw" ]] && return 0

  hits=""
  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    local f="${line%%:*}" rest="${line#*:}" ln
    ln="${rest%%:*}"
    if file_suppressed "$f" || is_suppressed "$f" "$ln"; then
      suppressed=$((suppressed + 1)); continue
    fi
    hits+="$line"$'\n'
  done <<<"$raw"

  hits="$(sed '/^$/d' <<<"$hits")"
  [[ -z "$hits" ]] && return 0

  local count
  count="$(wc -l <<<"$hits" | tr -d ' ')"
  total=$((total + count))

  printf '%s✗ %s%s  (%s)\n' "$RED" "$label" "$OFF" "$count"
  printf '  %s→ %s%s\n' "$YEL" "$remedy" "$OFF"
  head -8 <<<"$hits" | sed "s|^|    ${DIM}|; s|$|${OFF}|"
  [[ "$count" -gt 8 ]] && printf '    %s… and %s more%s\n' "$DIM" "$((count - 8))" "$OFF"
  echo
}

echo "WaveRider design audit — $TARGET"
echo "════════════════════════════════════════════════════════"
echo

scan "Raw neutral palette" \
  '\b(text|bg|border|ring|divide|from|to|via)-(gray|slate|zinc|neutral|stone)-[0-9]{2,3}\b' \
  'Use surface/content tokens: bg-surface-raised, text-secondary, border-default'

scan "Raw directional palette on data" \
  '\b(text|bg|border|from|to)-(green|red|emerald|rose)-[0-9]{2,3}\b' \
  'Use directional tokens: text-up-strong / text-down-strong (never a literal green/red)'

scan "Raw blue/cyan" \
  '\b(text|bg|border|from|to)-(blue|cyan|sky|indigo)-[0-9]{2,3}\b' \
  'Use text-brand (accent) or text-volume-high (volume semantics)'

scan "Raw warm palette" \
  '\b(text|bg|border|from|to)-(amber|yellow|orange)-[0-9]{2,3}\b' \
  'Use text-warning (status) or text-accent-gold / tier-rider (merchandising)'

scan "Raw other palette" \
  '\b(text|bg|border|from|to)-(teal|lime|pink|fuchsia|cyan)-[0-9]{2,3}\b' \
  'Categorical data belongs on the chart series tokens: text-chart-1 .. chart-8'

scan "Purple gradient (AI-slop signature)" \
  '(from|via|to)-(purple|violet|fuchsia)-[0-9]{2,3}' \
  'Use bg-gradient-cta / bg-gradient-rider / bg-gradient-pro. Never a purple hero gradient.'

scan "Banned font" \
  "(font-inter|['\"]Inter['\"])" \
  'Use font-display (Outfit), font-body (Jakarta), font-mono (JetBrains)'

scan "Hardcoded hex color" \
  '(color|background|background-color|border-color|fill|stroke)\s*[:=]\s*["'"'"']?#[0-9a-fA-F]{3,8}' \
  'Reference a var(--wr-*) token. Hex belongs only in tokens/core.css.'

scan "Off-rhythm arbitrary spacing" \
  '\b(p|m|gap|space)[trblxy]?-\[[0-9]+px\]' \
  'Spacing is an 8px rhythm (4px half-step). Use p-2 / p-3 / p-4 / p-6.'

# NOTE: there is deliberately no "untabulated numerals" check here.
# tokens/core.css applies font-variant-numeric: tabular-nums to .font-mono
# itself, so mono numerals are correct by construction. A check that flagged
# all 564 mono usages would be noise, not signal.

echo "════════════════════════════════════════════════════════"
[[ "$suppressed" -gt 0 ]] && printf '%s⚠ %s suppressed via wr-audit-ignore — review these periodically.%s\n' \
  "$YEL" "$suppressed" "$OFF"
if [[ "$total" -eq 0 ]]; then
  printf '%s✓ Clean — no token drift detected.%s\n' "$GRN" "$OFF"
  exit 0
fi
printf '%s✗ %s violation(s).%s\n' "$RED" "$total" "$OFF"
echo "See VARIANCE-BUDGET.md and tokens/core.css for the contract."
exit 1
