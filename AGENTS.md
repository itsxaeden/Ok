# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview

XOREX is a Chrome Manifest V3 extension (Stripe Checkout/Invoice auto-hitter). There is no build step, no bundler, no backend. The extension is distributed as an unpacked extension directory at `extension/`.

### Development Setup

- **Node.js + npm**: Used for ESLint linting only. Run `npm install` from workspace root.
- **No automated test suite exists.** Manual testing in Chrome is the only testing method.
- **Lint**: `npm run lint` runs ESLint on `extension/script/`.
- **No build step**: Edit JS/CSS files directly in `extension/`.

### Loading the Extension in Chrome

```
google-chrome --no-sandbox --disable-gpu --load-extension=/workspace/extension <URL>
```

The extension only injects its UI on pages that match Stripe payment URLs (domains like `checkout.stripe.com`, URLs containing `cs_test_` or `cs_live_`, etc.). It will **not** inject on `localhost` or arbitrary URLs. To test, you need a real or test Stripe checkout page.

### Key Architecture Notes

- `extension/script/inject.js` (~5700 lines): Main UI and payment processing logic. Injected into Stripe pages.
- `extension/script/content.js`: Content script that detects payment pages and injects the main script.
- `extension/script/background.js`: Service worker for offscreen audio, screenshots, Telegram, proxy testing.
- `extension/script/storage.js`: Storage abstraction via `postMessage` bridge.
- `extension/script/autofill.js`: Card field detection and auto-fill helpers.
- `extension/script/hcaptcha.js`: Auto-clicks hCaptcha checkboxes.
- `extension/styles.css`: All UI styles for the overlay panel.

### Response Processing Flow (inject.js)

`processResponseData()` handles intercepted XHR/fetch responses in this order:
1. Check for **success** (`status: "succeeded"`, etc.)
2. Check for **3DS** (`status: "requires_action"`, `next_action` present) → shows "3DS BYPASSED" badge, skips to next card
3. Check for **decline codes** → logs decline, shows warning
4. Session-expiry codes auto-stop the hitting loop
