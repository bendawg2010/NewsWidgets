# Prompt template — give this to another AI

Fill in the `{{PLACEHOLDERS}}` and paste into Claude Code, ChatGPT, Cursor, etc.

---

I want you to build a free, open-source **macOS desktop widget** called **{{WIDGET_NAME}}** plus a complete promo package. The widget shows **{{WHAT_IT_SHOWS}}** by pulling live data from **{{DATA_SOURCE_OR_API}}**.

## Tech stack — match this exactly

- macOS Tahoe (deployment target macOS 14)
- Swift + SwiftUI + WidgetKit (StaticConfiguration, TimelineProvider, AppGroup-shared store)
- Generate the Xcode project with **xcodegen** (a `project.yml` file, not a hand-edited .pbxproj)
- Ad-hoc code signing only (`CODE_SIGN_IDENTITY=-`) — no $99 Apple Developer account
- The widget extension lives at `Widgets/` and the host app at `App/`

## Mac app architecture

- One host app named **{{APP_NAME}}** at `com.{{HANDLE}}.{{APP_NAME}}`
- One widget extension at `com.{{HANDLE}}.{{APP_NAME}}.WidgetsExtension`
- Both targets share an App Group: `group.com.{{HANDLE}}.{{APP_NAME}}`
- Entitlements: `app-sandbox`, `network.client`, the App Group
- Custom URL scheme: `{{SCHEME_NAME}}://story?url=...&title=...` so widget taps open the host app instead of the browser
- Host app uses NavigationSplitView with a sidebar list and a `WKWebView` reader pane
- Source/setting picker accessible from a toolbar button, persisted in shared `UserDefaults(suiteName: appGroup)`

## Widget design (mirror Apple's stock widgets)

- Glass `.containerBackground` with a solid darkish base + brand gradient + thick material on top (so the widget stays readable when macOS dims it because another app is frontmost)
- 22pt rounded-square icon with brand gradient + SF Symbol
- Title (13pt semibold), monospaced time on the right
- 90-110pt photo hero card with dark vignette overlay + a brand-colored "BREAKING / TOP STORY / LIVE" pill + headline at the bottom
- Story rows: 9.5pt heavy uppercase source label (brand-tinted), tiny dot separator, relative timestamp, then 2-line bold headline at 13pt
- Brand color: **{{BRAND_HEX}}** (gradient toward **{{BRAND_GRADIENT_END}}**)
- Pull image bytes inside `TimelineProvider.load()` and store as `Data` on the entry — `AsyncImage` does not work reliably in widget snapshots. Downsample with **ImageIO** (`CGImageSourceCreateThumbnailAtIndex`) and cache to disk under `~/Library/Caches/{{APP_NAME}}-Images/` with a 6-hour TTL.
- Render the image with `Image(nsImage: NSImage(data:)!)`, anchored inside `Color.clear.overlay { ... }.clipped()` so `.aspectRatio(.fill)` doesn't expand the parent ZStack.
- Refresh policy: live-state → 90 sec, idle → 15 min for fast-moving data; 30 min for slow-moving data.

## Promo package — also build

1. **Cloudflare Pages site** at `{{APP_NAME_LOWER}}.pages.dev` (deploy with `npx wrangler pages deploy`).
   - Pure static HTML/CSS/JS, no build step, no CDN scripts.
   - Apple-product-page polish: huge hero typography (96-130px), gradient orbs background, glass widget recreations, scroll-reveal via IntersectionObserver.
   - Hero, video section, features grid, sources/leagues chips, OSS section with prominent badge, support section with **Cash App {{CASH_APP_TAG}}** button (green pill `#00d54b`), install page with the "macOS will warn you — that's normal because Apple charges $100/year and I haven't paid" callout, footer.

2. **Remotion ad** in `ad/` — both **1920×1080** and **1080×1920** compositions.
   - Scenes: Hook (bold tagline), Reveal (widget mock springs in), Features (3 fast slides), Outro (icon + product name + URL).
   - Use `<TransitionSeries>` with `fade()` and `slide()` transitions.
   - Synthesized ambient backing music via `<Audio>` from `@remotion/media` (4-chord pad + sub bass + sparse melody, fade in/out, mixed at -8 dB).
   - Use `staticFile("music.mp3")` from `ad/public/music.mp3`.
   - All animations must use `useCurrentFrame()` + `interpolate` / `spring` — no CSS transitions, no Tailwind animation classes.
   - Render to `~/Downloads/{{APP_NAME}}-Ad.mp4` and `~/Downloads/{{APP_NAME}}-Vertical-Ad.mp4`.

3. **Easy installer** as `scripts/install.sh` — `curl | bash` one-liner that downloads from GitHub releases, drops the .app into `/Applications`, **strips the quarantine xattr** (so Gatekeeper doesn't show the scary popup), and re-registers with Launch Services.

4. **GitHub repo** at `github.com/{{HANDLE}}/{{APP_NAME}}` — push everything, create a v1.0.0 release with `{{APP_NAME}}.zip` + `install.sh`. Include `.github/FUNDING.yml` with `custom: ["https://cash.app/{{CASH_APP_TAG}}"]`, MIT `LICENSE`, and a README that explains the 1-line install + the Gatekeeper warning + a Support section pointing at the Cash App tip jar.

## Constraints

- 100% free + open source. No accounts. No tracking. No ads. No telemetry.
- Match Apple's design language exactly — SF Pro typography, rounded continuous corners, monospaced digits, native materials.
- Container background must be opaque enough to read through macOS's "another-app-is-frontmost" tint.
- All async network calls have an 8-second timeout.
- All image processing uses ImageIO, never `NSImage.lockFocus`.

## Deliverables checklist

- [ ] `{{APP_NAME}}.app` builds, installs, and the widget appears in the gallery
- [ ] Widget refreshes on its timeline policy and survives Mac sleep
- [ ] Tapping a widget opens the article in the host app's `WKWebView` reader
- [ ] `{{APP_NAME_LOWER}}.pages.dev` deployed and live
- [ ] `~/Downloads/{{APP_NAME}}-Ad.mp4` (1920×1080) and `~/Downloads/{{APP_NAME}}-Vertical-Ad.mp4` (1080×1920) rendered with synthesized music
- [ ] `github.com/{{HANDLE}}/{{APP_NAME}}` repo pushed with v1.0.0 release containing the .zip + install.sh

## Reference implementation

The pattern + all shared infrastructure is at https://github.com/bendawg2010/NewsWidgets — read that repo first to see the file layout, the SourcesStore App Group pattern, the ImageIO downsample helper, the Remotion composition setup, the website structure. Mirror it.
