#!/usr/bin/env bash
# Builds dist/ from scratch. Everything in dist/ is generated — never edit it by hand.
set -e

BUILD=$(date -u +%Y%m%d%H%M%S)
echo "Building $BUILD"

rm -rf dist
mkdir -p dist/fonts dist/design-system
cp src/design-system/fonts/* dist/fonts/
cp src/design-system/prepaint.js dist/design-system/prepaint.js

# 1. static shell
cp src/static/index.html src/static/manifest.webmanifest src/static/_headers src/static/icon.svg dist/

# 2. icons, decoded from the checked-in base64 (keeps the repo free of binaries)
node -e "
import {readFileSync, writeFileSync} from 'fs';
const icons=JSON.parse(readFileSync('src/static/icons.b64.json','utf8'));
for (const [name,b64] of Object.entries(icons)) writeFileSync('dist/'+name, Buffer.from(b64,'base64'));
console.log('  icons: '+Object.keys(icons).length);
"

# 4. app. No Tailwind here: the styling is a hand-written stylesheet of custom
#    properties backed by the shared design package.
VERSION=$(node -e "
import {readFileSync} from 'fs';
process.stdout.write(JSON.parse(readFileSync('package.json','utf8')).version);
")
npx esbuild --bundle src/main.jsx --outfile=dist/app.js \
  --jsx=automatic --minify --define:process.env.NODE_ENV='"production"' \
  --define:__APP_VERSION__='"'$VERSION'"' --define:__BUILD_STAMP__='"'$BUILD'"' \
  --log-level=warning
cat src/design-system/tokens.css node_modules/@doshi-experiments/design-system/dist/components.css src/design-system/legacy.css src/app.css > dist/app.css

# Retain notices for bundled runtime dependencies.
node --input-type=module -e '
import {readFileSync, existsSync, writeFileSync} from "node:fs";
const packages = ["react", "react-dom", "scheduler", "@base-ui/react", "@base-ui/utils", "@floating-ui/react", "@floating-ui/react-dom", "@floating-ui/core", "@floating-ui/dom", "@floating-ui/utils", "tabbable", "use-sync-external-store"];
const notices = packages.map(name => {
  const file = ["LICENSE", "LICENSE.md", "LICENSE.txt"].map(f => "node_modules/" + name + "/" + f).find(existsSync);
  return file ? name + "\n" + readFileSync(file, "utf8") : "";
}).filter(Boolean).join("\n\n");
writeFileSync("dist/THIRD-PARTY-NOTICES.txt", notices);
'

# 5. service worker, stamped so returning visitors pick up the new version
sed "s/__BUILD__/$BUILD/" src/sw.template.js > dist/sw.js
echo "$BUILD" > dist/version.txt

echo "dist/ ready — $(du -sh dist | cut -f1), $(find dist -type f | wc -l | tr -d ' ') files"
