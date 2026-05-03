#!/usr/bin/env bash
# News Widgets one-line installer.
# Downloads the latest release, drops it in /Applications, and pre-clears
# Gatekeeper's quarantine flag so you don't have to fight the "unidentified
# developer" dialog.
#
# News Widgets is open source: https://github.com/bendawg2010/NewsWidgets
# This script is NOT a virus. Apple's $100/year Developer Program fee is the
# only reason that scary popup exists for indie macOS apps.

set -euo pipefail

REPO="bendawg2010/NewsWidgets"
APP_NAME="NewsWidgets.app"
TMP_DIR="$(mktemp -d -t newswidgets-install)"
DEST="/Applications/${APP_NAME}"

bold() { printf "\033[1m%s\033[0m\n" "$1"; }
info() { printf "  • %s\n" "$1"; }
ok()   { printf "  \033[32m✓\033[0m %s\n" "$1"; }
warn() { printf "  \033[33m!\033[0m %s\n" "$1"; }

bold "News Widgets installer"
echo "  Downloading latest release from github.com/${REPO}…"

DOWNLOAD_URL="https://github.com/${REPO}/releases/latest/download/NewsWidgets.zip"
ZIP_PATH="${TMP_DIR}/NewsWidgets.zip"

if ! curl -fL --progress-bar -o "${ZIP_PATH}" "${DOWNLOAD_URL}"; then
  echo
  warn "Download failed. The latest release may not exist yet."
  echo "  See: https://github.com/${REPO}/releases"
  exit 1
fi

ok "Downloaded $(du -h "${ZIP_PATH}" | cut -f1)"

info "Unpacking…"
unzip -q -o "${ZIP_PATH}" -d "${TMP_DIR}"

if [ ! -d "${TMP_DIR}/${APP_NAME}" ]; then
  warn "Could not find ${APP_NAME} inside the downloaded zip."
  exit 1
fi
ok "Unpacked"

if [ -d "${DEST}" ]; then
  info "Removing existing ${DEST}"
  rm -rf "${DEST}"
fi

info "Installing to ${DEST}"
cp -R "${TMP_DIR}/${APP_NAME}" "${DEST}"
ok "Installed"

# Strip Gatekeeper quarantine attribute so macOS skips the scary popup
# (the user explicitly opted in by running this script).
info "Clearing quarantine attribute…"
xattr -dr com.apple.quarantine "${DEST}" 2>/dev/null || true
ok "Cleared"

# Re-register so widgets show up in the gallery
info "Registering with Launch Services"
/System/Library/Frameworks/CoreServices.framework/Versions/Current/Frameworks/LaunchServices.framework/Versions/Current/Support/lsregister \
  -f -R "${DEST}" >/dev/null 2>&1 || true

info "Refreshing widget daemon"
killall chronod 2>/dev/null || true

ok "Done!"
echo
bold "Next steps"
info "1. Open the app:  open '${DEST}'"
info "2. Right-click your desktop → Edit Widgets"
info "3. Find 'News Widgets' and drag the AI Today and News widgets onto your desktop"
echo
echo "  Cleaning up…"
rm -rf "${TMP_DIR}"

# Auto-launch the app once so it registers
open "${DEST}"
