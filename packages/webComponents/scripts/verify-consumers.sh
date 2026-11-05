#!/usr/bin/env bash
set -euo pipefail

package_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$package_root"
consumer_root="$(mktemp -d "${TMPDIR:-/tmp}/silenceui-consumers.XXXXXXXX")"
trap 'rm -rf "$consumer_root"' EXIT
pnpm pack --pack-destination "$consumer_root"

for framework in vue react; do
  mkdir "$consumer_root/$framework"
  source_dir="$package_root/examples/$framework"
  cp "$source_dir/package.json" "$source_dir/index.html" "$source_dir"/main.* "$consumer_root/$framework/"
  if [[ "$framework" == "vue" ]]; then
    cp "$source_dir/App.vue" "$source_dir/vite.config.mjs" "$consumer_root/$framework/"
  else
    cp "$source_dir/tsconfig.json" "$consumer_root/$framework/"
  fi
  cp "$consumer_root/"*.tgz "$consumer_root/$framework/silenceui.tgz"
  (
    cd "$consumer_root/$framework"
    npm install --no-audit --no-fund
    npm run build
  )
done

if [[ "${1:-}" == "--browser" ]]; then
  node scripts/smoke-consumers.mjs "$consumer_root"
fi
