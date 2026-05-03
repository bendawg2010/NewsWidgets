#!/usr/bin/env bash
# Build a release-ready NewsWidgets.zip ready to upload to GitHub releases.
set -euo pipefail

cd "$(dirname "$0")/.."

bold() { printf "\033[1m%s\033[0m\n" "$1"; }

bold "Generating Xcode project…"
xcodegen generate

bold "Building Release…"
xcodebuild \
  -project NewsWidgets.xcodeproj \
  -scheme NewsWidgets \
  -configuration Release \
  -derivedDataPath build/DerivedData \
  CODE_SIGN_IDENTITY=- \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGNING_ALLOWED=NO \
  build 2>&1 | grep -E "error:|BUILD SUCCEEDED|BUILD FAILED" | tail -3

SRC=build/DerivedData/Build/Products/Release/NewsWidgets.app
EXT="${SRC}/Contents/PlugIns/NewsWidgetsExtension.appex"

bold "Ad-hoc signing…"
codesign --force --sign - --entitlements Widgets/Widgets.entitlements "${EXT}"
codesign --force --sign - --entitlements App/NewsWidgets.entitlements "${SRC}"

bold "Packaging zip…"
mkdir -p dist
rm -rf dist/NewsWidgets.app dist/NewsWidgets.zip
cp -R "${SRC}" dist/NewsWidgets.app

cd dist
# Use ditto so resource forks survive the round-trip
ditto -c -k --keepParent NewsWidgets.app NewsWidgets.zip
cd ..

cp scripts/install.sh dist/install.sh

ls -la dist/
echo
bold "Ready to upload:"
echo "  dist/NewsWidgets.zip → upload as a release asset on GitHub"
echo "  dist/install.sh      → upload as a release asset on GitHub"
