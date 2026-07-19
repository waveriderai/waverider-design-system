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

# scan <label> <regex> <remedy>
scan() {
  local label="$1" pattern="$2" remedy="$3"
  local hits
  hits="$(grep -rInE --include='*.tsx' --include='*.jsx' --include='*.ts' --include='*.js' \
          --include='*.css' --include='*.html' "$pattern" "$TARGET" 2>/dev/null || true)"
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

# Negative match — grep -E has no lookahead, so this is a pipeline, not a scan().
# Flags mono numerals that carry neither .wr-num nor an explicit tabular setting.
untab="$(grep -rInE --include='*.tsx' --include='*.jsx' --include='*.css' \
         'font-mono' "$TARGET" 2>/dev/null | grep -v 'tabular' | grep -v 'wr-num' || true)"
if [[ -n "$untab" ]]; then
  c="$(wc -l <<<"$untab" | tr -d ' ')"
  total=$((total + c))
  printf '%s✗ %s%s  (%s)\n' "$YEL" "Untabulated mono numerals" "$OFF" "$c"
  printf '  %s→ %s%s\n' "$YEL" 'Add .wr-num (mono + tabular-nums), or columns jitter on every tick.' "$OFF"
  head -5 <<<"$untab" | sed "s|^|    ${DIM}|; s|$|${OFF}|"
  [[ "$c" -gt 5 ]] && printf '    %s… and %s more%s\n' "$DIM" "$((c - 5))" "$OFF"
  echo
fi

echo "════════════════════════════════════════════════════════"
if [[ "$total" -eq 0 ]]; then
  printf '%s✓ Clean — no token drift detected.%s\n' "$GRN" "$OFF"
  exit 0
fi
printf '%s✗ %s violation(s).%s\n' "$RED" "$total" "$OFF"
echo "See VARIANCE-BUDGET.md and tokens/core.css for the contract."
exit 1
