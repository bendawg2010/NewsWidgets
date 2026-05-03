# News Widgets

Two beautiful native macOS widgets — **AI Today** and **News** — that pull live headlines from the sources you pick, show real article photos, and open in a built-in reader when you tap one.

100% free. 100% open source. No accounts. No tracking. No ads. No telemetry.

> Built for **macOS Tahoe** (macOS 14 deployment target).

**Website:** [newswidgets.pages.dev](https://newswidgets.pages.dev) · **Install:** [newswidgets.pages.dev/install.html](https://newswidgets.pages.dev/install.html) · **Donate:** [PayPal]() · [GitHub Sponsors](https://github.com/sponsors/bendawg2010)

---

## Install

The easy way (one command):

```bash
curl -L https://github.com/bendawg2010/NewsWidgets/releases/latest/download/install.sh | bash
```

Or download the `.zip` from the [releases page](https://github.com/bendawg2010/NewsWidgets/releases/latest), unzip it, drag `NewsWidgets.app` to `/Applications`, and launch it. macOS will warn you that the app is from an unidentified developer because I haven't paid Apple's $100/year developer fee — see the install page for the workaround (right-click → Open, or System Settings → Privacy & Security → Open Anyway). The code is public; you can audit every line before running.

After launching, right-click your desktop → Edit Widgets → drag the AI Today or News widget onto the desktop.

## Features

- **AI Today widget** — daily AI news from TechCrunch, The Verge, Ars Technica, VentureBeat, MIT Tech Review, Hacker News (pick which sources show up).
- **News widget** — world news from Fox News, BBC, Reuters, AP, WSJ.
- **Real photos** pulled from each article (with `og:image` fallback).
- **Built-in reader** — taps open the article in a `WKWebView` reader inside the app, not the browser.
- **Source picker** in app settings, shared with the widget extension via App Group.
- **Auto-refresh** every 15 / 30 minutes via WidgetKit timeline policy + an in-app `Timer` for reliable updates while the host app is open.

## Build it yourself

You need Xcode 26+ and `xcodegen` (`brew install xcodegen`).

```bash
xcodegen generate
xcodebuild -project NewsWidgets.xcodeproj -scheme NewsWidgets -configuration Release \
  CODE_SIGN_IDENTITY=- CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO build
```

Or use the bundled release script:

```bash
./scripts/build-release.sh
```

## Project layout

```
App/                  SwiftUI host app + reader
Widgets/              WidgetKit extension (both widgets) + shared services
ad/                   Remotion source for the promo videos (1080p + 1080×1920)
website/              Static promo site (deployed to Cloudflare Pages)
scripts/              Build + install scripts
.github/              FUNDING.yml for sponsorship
```

## Render the ads

```bash
cd ad
npm install
npx remotion render NewsWidgetsAd          out/ad.mp4           # 1920×1080
npx remotion render NewsWidgetsAdVertical  out/ad-vertical.mp4  # 1080×1920
```

## Support

News Widgets is free forever. If it saves you the cost of a paid widget app:

- 💸 **[Tip via Cash App → $Dryeetsolutions](https://cash.app/$Dryeetsolutions)**
- ⭐ **[Star the repo](https://github.com/bendawg2010/NewsWidgets)** — boosts visibility on GitHub
- 📣 **[Share it](https://twitter.com/intent/tweet?text=Just+installed+News+Widgets+%E2%80%94+a+free%2C+open-source+macOS+widget+app.&url=https%3A%2F%2Fnewswidgets.pages.dev)** — tell a friend who'd like better widgets

100% goes to keeping this and future open-source projects free.

## License

MIT — see [LICENSE](LICENSE).
