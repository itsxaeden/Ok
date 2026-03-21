
window.__XOREX_CONTENT_LOADED = true;

const K = {
  SAVED_BINS:         'xorex_saved_bins',
  SAVED_ID:           'xorex_saved_id',
  CUSTOM_NAME:        'xorex_custom_name',
  CUSTOM_EMAIL:       'xorex_custom_email',
  BG_COLOR:           'xorex_bg_color',
  HAS_CUSTOM_COLOR:   'xorex_has_custom_color',
  BG_ENABLED:         'xorex_bg_enabled',
  PAGE_BG_COLOR:      'xorex_page_bg_color',
  PAGE_HAS_CUSTOM:    'xorex_page_has_custom_color',
  TOGGLE_HIT_SOUND:   'xorex_toggle_hit_sound',
  TOGGLE_AUTO_SS:     'xorex_toggle_auto_ss',
  LOGS:               'xorex_logs',
  LOGS_CLEARED_AT:    'xorex_logs_cleared_at',
  MUSIC_NAME:         'xorex_music_name',
  MUSIC_DATA:         'xorex_music_data',
  CARD_HISTORY:       'xorex_card_history',
  PROXY_ENABLED:      'xorex_proxy_enabled',
  PROXY_STRING:       'xorex_proxy_string',
  PROXY_INFO:         'xorex_proxy_info',
  PROXY_LIST:         'xorex_proxy_list',
  PROXY_MODE:         'xorex_proxy_mode',
};

const _pendingWrites = new Set();
let _writeTimeout = null;

function markOwnWrite(keys) {
  keys.forEach(k => _pendingWrites.add(k));
  clearTimeout(_writeTimeout);
  _writeTimeout = setTimeout(() => _pendingWrites.clear(), 2000);
}

if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      const changedData = {};
      let hasExternalChange = false;
      for (const [key, { newValue }] of Object.entries(changes)) {
        if (_pendingWrites.has(key)) continue;
        changedData[key] = newValue !== undefined ? newValue : null;
        hasExternalChange = true;
      }
      if (hasExternalChange) {
        window.postMessage({
          type: 'XOREX_STORAGE_CHANGED',
          changes: changedData
        }, '*');
      }
    }
  });
}

window.addEventListener("message", async (event) => {
  if (event.source !== window) return;

  if (event.data && event.data.type === 'XOREX_STORAGE_REQUEST') {
    const { requestId, action, data } = event.data;

    try {
      if (!isExtensionValid()) {
        window.postMessage({
          type: 'XOREX_STORAGE_RESPONSE',
          requestId: requestId,
          result: null
        }, '*');
        return;
      }

      if (action === 'GET') {
        chrome.storage.local.get(data.keys, (result) => {
          window.postMessage({
            type: 'XOREX_STORAGE_RESPONSE',
            requestId: requestId,
            result: result || {}
          }, '*');
        });
      } else if (action === 'SET') {
        markOwnWrite(Object.keys(data));
        chrome.storage.local.set(data, () => {
          window.postMessage({
            type: 'XOREX_STORAGE_RESPONSE',
            requestId: requestId,
            result: { success: true }
          }, '*');
        });
      } else if (action === 'REMOVE') {
        markOwnWrite(data.keys);
        chrome.storage.local.remove(data.keys, () => {
          window.postMessage({
            type: 'XOREX_STORAGE_RESPONSE',
            requestId: requestId,
            result: { success: true }
          }, '*');
        });
      }
    } catch (e) {
      window.postMessage({
        type: 'XOREX_STORAGE_RESPONSE',
        requestId: requestId,
        result: null
      }, '*');
    }
    return;
  }
});

window.addEventListener("message", async (event) => {
  if (event.data && event.data.type === "XOREX_TO_BACKGROUND" && event.data.requestId) {
    try {
      const response = await chrome.runtime.sendMessage(event.data.payload);
      window.postMessage({
        type: "XOREX_FROM_BACKGROUND",
        requestId: event.data.requestId,
        response: response || { success: true }
      }, "*");
    } catch (e) {
      const errorMsg = e.message || '';
      if (errorMsg.includes('asynchronous response') || errorMsg.includes('message port closed')) {
        window.postMessage({
          type: "XOREX_FROM_BACKGROUND",
          requestId: event.data.requestId,
          response: { success: true }
        }, "*");
        return;
      }
      window.postMessage({
        type: "XOREX_FROM_BACKGROUND",
        requestId: event.data.requestId,
        response: { success: false, error: errorMsg }
      }, "*");
    }
  }
});

function simulateTyping(element, value) {
  element.focus();
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  nativeInputValueSetter.call(element, value);
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  element.blur();
}

function simulateSelect(element, value) {
  element.focus();
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new CustomEvent('select:change', {
    bubbles: true,
    detail: { value: value }
  }));
  element.blur();
}

const randomNames = ["XOREX"];
const randomStreets = ["CO"];

function getRandomName() {
  return randomNames[Math.floor(Math.random() * randomNames.length)];
}

function getRandomStreet() {
  const street = randomStreets[Math.floor(Math.random() * randomStreets.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  return number + " " + street;
}

async function checkAndFillFields() {
  const formFields = {
    cardNumber: {
      selector: '#cardNumber, [name="cardNumber"], [autocomplete="cc-number"]',
      value: '4242424242424242'
    },
    cardExpiry: {
      selector: '#cardExpiry, [name="cardExpiry"], [autocomplete="cc-exp"]',
      value: '01/32'
    },
    cardCvc: {
      selector: '#cardCvc, [name="cardCvc"], [autocomplete="cc-csc"]',
      value: '000'
    },
    billingName: {
      selector: '#billingName, [name="billingName"], [autocomplete="cc-name"]',
      value: getRandomName()
    },
    billingCountry: {
      selector: '#billingCountry, [name="billingCountry"]',
      value: 'MO'
    },
    billingAddress: {
      selector: '#billingAddressLine1, [name="billingAddressLine1"]',
      value: getRandomStreet()
    }
  };

  for (let [fieldName, fieldData] of Object.entries(formFields)) {
    const element = document.querySelector(fieldData.selector);
    if (element) {
      if (element.tagName.toLowerCase() === 'select') {
        simulateSelect(element, fieldData.value);
      } else {
        simulateTyping(element, fieldData.value);
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  const submitButton = document.querySelector('.SubmitButton-IconContainer, .SubmitButton-Button, button[type="submit"]');
  if (submitButton) {
    const btn = submitButton.closest('button') || submitButton;
    btn.click();
  }
}

let port = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

function isExtensionValid() {
  try {
    return !!(chrome.runtime && chrome.runtime.id);
  } catch (e) {
    return false;
  }
}

function safeStorageSet(data) {
  try {
    if (isExtensionValid()) {
      markOwnWrite(Object.keys(data));
      chrome.storage.local.set(data);
    }
  } catch (e) {}
}

function safeStorageGet(keys, callback) {
  try {
    if (isExtensionValid()) {
      chrome.storage.local.get(keys, callback);
    }
  } catch (e) {}
}

function safeStorageRemove(keys) {
  try {
    if (isExtensionValid()) {
      markOwnWrite(Array.isArray(keys) ? keys : [keys]);
      chrome.storage.local.remove(keys);
    }
  } catch (e) {}
}

function connectPort() {
  try {
    if (!isExtensionValid()) return;
    port = chrome.runtime.connect({ name: 'xorex-content' });
    reconnectAttempts = 0;

    port.onMessage.addListener((msg) => {
      if (msg.type === 'PING') {}
    });

    port.onDisconnect.addListener(() => {
      port = null;
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        setTimeout(connectPort, 1000 * reconnectAttempts);
      }
    });
  } catch (e) {
    port = null;
  }
}

connectPort();

setInterval(() => {
  if (!port && isExtensionValid()) {
    connectPort();
  }
}, 30000);

async function safeSendMessage(message, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (!isExtensionValid()) {
        throw new Error('Extension context invalidated');
      }
      const response = await chrome.runtime.sendMessage(message);
      return response;
    } catch (error) {
      const isDisconnected =
        error.message.includes('Extension context invalidated') ||
        error.message.includes('disconnected') ||
        error.message.includes('Receiving end does not exist') ||
        error.message.includes('Could not establish connection');

      if (isDisconnected) {
        connectPort();
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
          continue;
        }
        return { success: false, error: 'Connection lost. Retrying...' };
      }
      throw error;
    }
  }
  return { success: false, error: 'Failed after retries' };
}

window.addEventListener('message', async function(event) {
  if (event.source !== window) return;
  if (!isExtensionValid()) return;

  switch (event.data.type) {
    case 'AUTOFILL_FIELDS':
      checkAndFillFields();
      break;

    case 'GET_SAVED_BIN':
      safeStorageGet([K.SAVED_BINS], function(result) {
        var bins = result[K.SAVED_BINS];
        var bin = Array.isArray(bins) ? (bins[0] || '') : (bins || '');
        window.postMessage({
          type: 'UPDATE_SAVED_BIN',
          bin: bin
        }, '*');
      });
      break;

    case 'GET_SAVED_ID':
      safeStorageGet([K.SAVED_ID], function(result) {
        window.postMessage({
          type: 'UPDATE_SAVED_ID',
          id: result[K.SAVED_ID] || ''
        }, '*');
      });
      break;

    case 'PLAY_SUCCESS_SOUND':
      safeSendMessage({ type: 'PLAY_SUCCESS_SOUND_OFFSCREEN' }).catch(() => {});
      break;

    case 'PLAY_HIT_SOUND':
      safeSendMessage({ type: 'PLAY_SUCCESS_SOUND_OFFSCREEN' }).catch(() => {});
      break;

    case 'CAPTURE_SCREENSHOT_REQUEST':
      safeSendMessage({ type: 'CAPTURE_SCREENSHOT' }).then((response) => {
        if (response && response.dataUrl) {
          window.postMessage({ type: 'SCREENSHOT_RESULT', dataUrl: response.dataUrl }, '*');
        } else {
          window.postMessage({ type: 'SCREENSHOT_ERROR', error: 'Failed to capture' }, '*');
        }
      }).catch((err) => {
        window.postMessage({ type: 'SCREENSHOT_ERROR', error: err.message }, '*');
      });
      break;

    case 'PLAY_CUSTOM_PREVIEW':
      safeSendMessage({ type: 'PLAY_CUSTOM_PREVIEW' }).catch(() => {});
      break;

    case 'STOP_CUSTOM_PREVIEW':
      safeSendMessage({ type: 'STOP_CUSTOM_PREVIEW' }).catch(() => {});
      break;

    case 'PLAY_BACKGROUND_MUSIC':
      safeSendMessage({ type: 'PLAY_BACKGROUND_MUSIC', volume: event.data.volume }).catch(() => {});
      break;

    case 'STOP_BACKGROUND_MUSIC':
      safeSendMessage({ type: 'STOP_BACKGROUND_MUSIC' }).catch(() => {});
      break;

    case 'SAVE_CUSTOM_MUSIC':
      try {
        if (isExtensionValid()) {
          var md = {}; md[K.MUSIC_DATA] = event.data.audioData;
          chrome.storage.local.set(md, () => {
            window.postMessage({ type: 'CUSTOM_MUSIC_SAVED', success: true }, '*');
          });
        }
      } catch (e) {}
      break;

    case 'REMOVE_CUSTOM_MUSIC':
      try {
        if (isExtensionValid()) {
          chrome.storage.local.remove([K.MUSIC_DATA]);
        }
      } catch (e) {}
      break;

    case 'SAVE_TOGGLE_STATE':
      var tt = event.data.toggleType;
      var tv = event.data.value;
      var td = {};
      if (tt === 'hitSound') td[K.TOGGLE_HIT_SOUND] = tv;
      else if (tt === 'autoSS') td[K.TOGGLE_AUTO_SS] = tv;
      if (Object.keys(td).length) safeStorageSet(td);
      break;

    case 'GET_TOGGLE_STATES':
      safeStorageGet([
        K.TOGGLE_HIT_SOUND,
        K.TOGGLE_AUTO_SS
      ], function(result) {
        window.postMessage({
          type: 'UPDATE_TOGGLE_STATES',
          hitSoundEnabled: result[K.TOGGLE_HIT_SOUND] !== false,
          autoSSEnabled: result[K.TOGGLE_AUTO_SS] !== false
        }, '*');
      });
      break;

    case 'SAVE_ID':
      var sid = {}; sid[K.SAVED_ID] = event.data.id;
      safeStorageSet(sid);
      break;

    case 'SAVE_BIN':
      if (Array.isArray(event.data.bins)) {
        var bd = {}; bd[K.SAVED_BINS] = event.data.bins;
        safeStorageSet(bd);
      } else {
        var sb = {}; sb[K.SAVED_BINS] = [event.data.bin];
        safeStorageSet(sb);
      }
      break;

    case 'GET_MUSIC_URL':
      try {
        if (isExtensionValid()) {
          const musicUrl = chrome.runtime.getURL('sounds/music.mp3');
          window.postMessage({
            type: 'MUSIC_URL',
            url: musicUrl
          }, '*');
        }
      } catch (e) {}
      break;

    case 'COPY_TO_CLIPBOARD_TEXT':
      if (event.data.text) {
        navigator.clipboard.writeText(event.data.text).catch(() => {
          const textArea = document.createElement('textarea');
          textArea.value = event.data.text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        });
      }
      break;
  }
});

function isPaymentPage() {
  const url = window.location.href.toLowerCase();
  const hostname = window.location.hostname.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();

  const allowedDomains = [
    'billing.gamma.app',
    'pay.openai.com',
    'checkout.stripe.com',
    'pay.krea.ai',
    'buy.stripe.com',
    'localhost'
  ];

  for (const domain of allowedDomains) {
    if (hostname === domain || hostname.endsWith('.' + domain)) {
      return true;
    }
  }

  if (hostname.endsWith('.stripe.com') || hostname === 'stripe.com') {
    return true;
  }

  if (hostname.startsWith('checkout.')) {
    return true;
  }

  if (url.includes('/c/pay/cs_live')) return true;
  if (url.includes('/c/pay/cs_test')) return true;
  if (url.includes('cs_live_')) return true;
  if (url.includes('cs_test_')) return true;
  if (url.includes('checkout.stripe.com/c/pay')) return true;
  if (url.includes('pay.krea.ai/c/pay')) return true;
  if (pathname.includes('/checkout')) return true;
  if (pathname.includes('/c/pay/')) return true;

  return false;
}

function hasStripeElements() {
  const url = window.location.href.toLowerCase();
  const hostname = window.location.hostname.toLowerCase();

  if (url.includes('cs_live') || url.includes('cs_test')) {
    return true;
  }

  if (hostname.startsWith('checkout.')) {
    return true;
  }

  if (!hostname.includes('stripe') &&
      !hostname.includes('pay') &&
      !hostname.includes('checkout') &&
      !hostname.includes('billing') &&
      !hostname.includes('gamma') &&
      !hostname.includes('openai') &&
      !hostname.includes('krea')) {
    return false;
  }

  if (document.querySelector('iframe[src*="stripe"]')) return true;
  if (document.querySelector('iframe[name*="stripe"]')) return true;
  if (document.querySelector('[class*="SubmitButton"]')) return true;
  if (document.querySelector('#cardNumber')) return true;

  return false;
}

function injectStyles() {
  if (!isExtensionValid()) return;
  if (document.getElementById('luisHitterStyles')) return;

  try {
    const link = document.createElement('link');
    link.id = 'luisHitterStyles';
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('styles.css');
    (document.head || document.documentElement).appendChild(link);
  } catch (e) {}
}

function injectScript() {
  if (!isExtensionValid()) return;
  if (window !== window.top) return;
  if (window.__luisHitterInjected) return;

  window.__luisHitterInjected = true;
  if (document.querySelector('script[data-luis-hitter]')) return;

  injectStyles();

  try {
    const iconMeta = document.createElement('meta');
    iconMeta.name = 'xorex-default-pfp';
    iconMeta.content = chrome.runtime.getURL('icons/icon128.png');
    document.head.appendChild(iconMeta);
  } catch (e) {}

  const moduleFiles = [
    'script/storage.js',
    'script/autofill.js'
  ];

  try {
    let loadedCount = 0;
    const totalModules = moduleFiles.length;

    function loadMainScript() {
      const mainScript = document.createElement('script');
      mainScript.src = chrome.runtime.getURL('script/inject.js');
      mainScript.setAttribute('data-luis-hitter', 'true');
      mainScript.onload = function() {
        this.remove();
      };
      (document.head || document.documentElement).appendChild(mainScript);
    }

    moduleFiles.forEach((file) => {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL(file);
      script.onload = function() {
        loadedCount++;
        if (loadedCount === totalModules) {
          setTimeout(loadMainScript, 50);
        }
        this.remove();
      };
      script.onerror = function() {
        loadedCount++;
        if (loadedCount === totalModules) {
          setTimeout(loadMainScript, 50);
        }
      };
      (document.head || document.documentElement).appendChild(script);
    });

    setTimeout(() => {
      if (loadedCount < totalModules) {
        loadMainScript();
      }
    }, 2000);

  } catch (e) {}
}

function checkAndInject() {
  // Force injection for testing on localhost
  if (window.location.hostname === 'localhost' || isPaymentPage() || hasStripeElements()) {
    injectScript();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkAndInject);
} else {
  checkAndInject();
}

setTimeout(checkAndInject, 1000);
setTimeout(checkAndInject, 3000);

const observer = new MutationObserver(() => {
  if (!window.__luisHitterInjected && (isPaymentPage() || hasStripeElements())) {
    injectScript();
    observer.disconnect();
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

setTimeout(() => observer.disconnect(), 10000);
