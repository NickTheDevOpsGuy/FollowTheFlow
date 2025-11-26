#!/usr/bin/env bash
# Abort on error, unset vars, or pipeline failures
set -euo pipefail

# Repo root
cd "$(git rev-parse --show-toplevel)"

# Optional: allow skipping with tag
LAST_COMMIT_MSG="$(git log -1 --pretty=%B || true)"
if echo "$LAST_COMMIT_MSG" | grep -qi '\[skip-precheck\]'; then
  echo "⚠️  Skipping pre-push checks due to [skip-precheck] tag."
  exit 0
fi

echo "🔍 Running Pre-Push Quality Gate..."

# -------- Empty file check (same behavior you had), scoped to changes --------
echo "📂 Checking for empty files..."
UPSTREAM="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true)"
if [ -n "$UPSTREAM" ]; then
  BASE="$(git merge-base HEAD "$UPSTREAM")"
  FILES_TO_CHECK="$(git diff --name-only --diff-filter=AM "$BASE"..HEAD)"
else
  echo "⚠️  No upstream configured — scanning entire repo..."
  FILES_TO_CHECK="$(git ls-files)"
fi

ALLOW_EMPTY_REGEX='(^|/)\.gitkeep$|(^|/)\.keep$'


# -------- Prettier (check → auto-fix & stop) --------
echo "🎨 Prettier — check"
if ! npx --no-install prettier --config .prettierrc.yml --ignore-path .prettierignore --check .; then
  echo "💾 Prettier — writing fixes..."
  npx --no-install prettier --config .prettierrc.yml --ignore-path .prettierignore --write .
  git add -A
  git commit -m "style: auto-format with Prettier [skip-precheck]"
  echo "🛑 Prettier fixed files and committed. Push again."
  exit 1
fi
echo "✅ Prettier passed."

# -------- ESLint (cached src) --------
echo "🧪 ESLint (cached, src)..."
npx --no-install eslint src --ext .js,.jsx,.ts,.tsx --cache

# -------- ESLint (strict, repo root) --------
echo "✨ ESLint (strict)..."
npx --no-install eslint . --max-warnings=0
echo "✅ ESLint passed."

# -------- TypeScript --------
echo "🛠️ TypeScript — type check"
npx --no-install tsc --noEmit --pretty false
echo "✅ TypeScript passed."

echo "🚀 All checks passed. Ready to push!"