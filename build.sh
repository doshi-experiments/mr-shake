#!/usr/bin/env bash
# Builds dist/ from scratch. Everything in dist/ is generated — never edit it by hand.
set -e

BUILD=$(date -u +%Y%m%d%H%M%S)
echo "Building $BUILD"

rm -rf dist
mkdir -p dist/fonts

# 1. static shell
cp src/static/index.html src/static/manifest.webmanifest src/static/_headers src/static/icon.svg dist/

# 2. icons, decoded from the checked-in base64 (keeps the repo free of binaries)
node -e "
import {readFileSync, writeFileSync} from 'fs';
const icons=JSON.parse(readFileSync('src/static/icons.b64.json','utf8'));
for (const [name,b64] of Object.entries(icons)) writeFileSync('dist/'+name, Buffer.from(b64,'base64'));
console.log('  icons: '+Object.keys(icons).length);
"

# 3. Feltwork — the shared design system. Emits feltwork.css, the three
#    variable faces, the felt texture and the SVG filter defs into dist/.
#    Resolve the CLI: the installed dependency, or a sibling checkout during
#    local development before the package repo is published.
if [ -x node_modules/.bin/feltwork ]; then
  FW="node_modules/.bin/feltwork"
elif [ -f ../feltwork/bin/feltwork.mjs ]; then
  FW="node ../feltwork/bin/feltwork.mjs"
else
  echo "  !! feltwork not found — run 'npm install'" >&2; exit 1
fi
$FW build --out dist >/dev/null
echo "  fonts: $(ls dist/fonts | wc -l | tr -d ' ')"

# 4. app. No Tailwind here, and none needed: Feltwork ships the reset and the
#    grid, and app.css is a thin layer of game-specific rules aliasing its
#    tokens. feltwork.css must come FIRST — app.css reads its custom
#    properties, and a var() that resolves to nothing silently renders black.
VERSION=$(node -e "
import {readFileSync} from 'fs';
process.stdout.write(JSON.parse(readFileSync('package.json','utf8')).version);
")
npx esbuild --bundle src/main.jsx --outfile=dist/app.js \
  --jsx=automatic --minify --define:process.env.NODE_ENV='"production"' \
  --define:__APP_VERSION__='"'$VERSION'"' --define:__BUILD_STAMP__='"'$BUILD'"' \
  --log-level=warning
cat dist/feltwork.css src/app.css > dist/app.css
rm -f dist/feltwork.css

# 5. service worker, stamped so returning visitors pick up the new version
sed "s/__BUILD__/$BUILD/" src/sw.template.js > dist/sw.js
echo "$BUILD" > dist/version.txt

echo "dist/ ready — $(du -sh dist | cut -f1), $(find dist -type f | wc -l | tr -d ' ') files"
