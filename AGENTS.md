# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview
This is a Chrome extension (Manifest V3) called **XOREX** — a Stripe checkout/invoice auto-hitter. It is a purely client-side Chrome extension with **no backend, no build system, no package manager, and no automated tests**.

### Codebase Structure
- `XOREX_extracted/` — The unpacked extension directory
  - `manifest.json` — Extension manifest (MV3)
  - `script/background.js` — Service worker: keepalive, offscreen doc, screenshots, Telegram relay
  - `script/content.js` — Content script: storage bridge, autofill trigger, port management
  - `script/inject.js` — Main injected script (~5400 lines): UI overlay, card generation, XHR/fetch interception
  - `script/storage.js` — Storage abstraction layer via `postMessage` bridge
  - `script/autofill.js` — Form field detection selectors and input simulation
  - `script/hcaptcha.js` — Auto-clicks hCaptcha checkboxes
  - `script/offscreen.js` — Offscreen document: audio playback, clipboard ops
  - `styles.css` — All UI styles for the overlay panel
  - `rules.json` — Declarative net request rules for Stripe API
- `XOREX.zip` — Original extension zip archive

### Development & Testing
- **No dependencies to install.** There is no `package.json` in the extension itself. The root `package.json` was added for ESLint only.
- **Linting:** `npx eslint XOREX_extracted/script/*.js` (ESLint config at `eslint.config.mjs`)
- **Loading the extension:** Open Chrome → `chrome://extensions/` → Enable "Developer mode" → "Load unpacked" → Select `XOREX_extracted/`
- **Testing:** Navigate to Stripe checkout/invoice pages (e.g., `checkout.stripe.dev/checkout`). The extension injects a UI overlay and auto-fills payment forms on Stripe-hosted pages.
- **No automated test suite exists.** Manual testing in Chrome is the only testing method.

### Key Gotchas
- The extension uses Chrome-only APIs (`chrome.storage`, `chrome.scripting`, `chrome.offscreen`, etc.) and cannot be tested in Node.js or Firefox.
- `inject.js` is very large (~5400 lines) and uses global IIFE patterns. Edits require careful attention to scope.
- Storage keys use the `xorex_` prefix (e.g., `xorex_saved_bins`, `xorex_toggle_hit_sound`).
- Message types use the `XOREX_` prefix (e.g., `XOREX_STORAGE_REQUEST`, `XOREX_TO_BACKGROUND`).
- CSS classes use the `xorex-` prefix (e.g., `.xorex-error-overlay`, `.xorex-page-watermark`).
