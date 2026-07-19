#!/usr/bin/env bash
# =============================================================================
# check-variance.sh — enforce the variance budget on L2 app skins.
#
# An app skin may override ONLY:
#   - accent tokens        (--wr-accent*, --wr-border-focus)
#   - density tokens       (--wr-row-h, --wr-cell-*, --wr-control-h, gaps)
#   - its own signature    (--wr-signature-*)
#   - font stacks          (locale/CJK fallbacks)
#   - additive app tokens  (names not present in core, e.g. --wr-tw-*)
#
# Anything else is a foundation change and belongs in tokens/core.css, where it
# moves the whole family together.
#
# ESCAPE HATCH — deliberate, visible, and noisy:
#   Add to the skin file:
#     /* @wr-variance-exempt --wr-display-xl reason goes here */
#   Exemptions are ALLOWED but always PRINTED, so they stay a conscious debt
#   rather than a silent precedent. A skin with many exemptions is a skin that
#   should have been a foundation change.
#
# Usage: scripts/check-variance.sh [skins-dir]
# Exit:  0 = within budget, 1 = budget exceeded
# =============================================================================

set -uo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
SKIN_DIR="${1:-$HERE/../tokens/skins}"
CORE="$HERE/../tokens/core.css"

[[ -d "$SKIN_DIR" ]] || { echo "check-variance: no skins dir at $SKIN_DIR" >&2; exit 1; }
[[ -f "$CORE"     ]] || { echo "check-variance: no core.css at $CORE" >&2; exit 1; }

ALLOWED_RE='^--wr-(accent|border-focus|signature-|row-h|cell-px|cell-py|control-h|stack-gap|section-gap|table-font-size|font-(display|body|mono))'

# Declared tokens in core (left-hand side only, comments stripped).
core_tokens="$(
  perl -0777 -pe 's{/\*.*?\*/}{}gs' "$CORE" \
    | grep -oE '^[[:space:]]*--wr-[a-z0-9-]+[[:space:]]*:' \
    | grep -oE -- '--wr-[a-z0-9-]+' | sort -u
)"

violations=0
exemptions=0

for skin in "$SKIN_DIR"/*.css; do
  [[ -e "$skin" ]] || continue
  name="$(basename "$skin")"

  # Vision/accessibility skins remap directional semantics family-wide by
  # design; they are user preferences, not app skins. Templates are inert.
  case "$name" in
    a11y-*|_template*) continue ;;
  esac

  # Exemptions must be read BEFORE comments are stripped.
  exempt="$(grep -oE '@wr-variance-exempt[[:space:]]+--wr-[a-z0-9-]+' "$skin" 2>/dev/null \
            | grep -oE -- '--wr-[a-z0-9-]+' | sort -u)"

  decls="$(
    perl -0777 -pe 's{/\*.*?\*/}{}gs' "$skin" \
      | grep -oE '^[[:space:]]*--wr-[a-z0-9-]+[[:space:]]*:' \
      | grep -oE -- '--wr-[a-z0-9-]+' | sort -u
  )"

  while IFS= read -r tok; do
    [[ -n "$tok" ]] || continue
    [[ "$tok" =~ $ALLOWED_RE ]] && continue
    grep -qxF -- "$tok" <<<"$core_tokens" || continue   # additive token, fine

    if grep -qxF -- "$tok" <<<"$exempt"; then
      reason="$(grep -oE "@wr-variance-exempt[[:space:]]+$tok[[:space:]]+[^*]*" "$skin" \
                | head -1 | sed -E "s|@wr-variance-exempt[[:space:]]+$tok[[:space:]]+||" \
                | sed 's/[[:space:]]*$//')"
      echo "EXEMPT  $name  $tok  — ${reason:-no reason given}"
      exemptions=$((exemptions + 1))
    else
      echo "VIOLATION  $name  overrides foundation token: $tok"
      violations=$((violations + 1))
    fi
  done <<<"$decls"
done

echo
[[ "$exemptions" -gt 0 ]] && echo "⚠ $exemptions documented exemption(s) — review these; they are debt."

if [[ "$violations" -gt 0 ]]; then
  echo "✗ $violations foundation override(s) in app skins."
  echo "  Apps may vary ONLY accent, density, and one signature."
  echo "  To change anything else, edit tokens/core.css — the whole family moves."
  echo "  To keep an override, annotate it: /* @wr-variance-exempt <token> <reason> */"
  exit 1
fi

echo "✓ All app skins within the variance budget."
exit 0
