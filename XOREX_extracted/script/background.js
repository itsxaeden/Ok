
async function registerServiceWorker() {
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: [{
        id: 1,
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders: [{
            header: "content-type",
            operation: "set",
            value: "application/x-www-form-urlencoded"
          }]
        },
        condition: {
          urlFilter: "||api.stripe.com/",
          resourceTypes: ["xmlhttprequest"]
        }
      }]
    });
  } catch (error) {}
}

chrome.runtime.onStartup.addListener(async () => {
  await registerServiceWorker();
  setupKeepAlive();
});

chrome.runtime.onInstalled.addListener(async () => {
  await registerServiceWorker();
  setupKeepAlive();
});

const ALARM_NAME = 'xorex-keepalive';

function setupKeepAlive() {
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: 0.33 });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    chrome.runtime.getPlatformInfo(() => {});
  }
});

setInterval(() => {
  chrome.runtime.getPlatformInfo(() => {});
}, 20000);

setupKeepAlive();

const ports = new Set();

chrome.runtime.onConnect.addListener((port) => {
  ports.add(port);
  registerServiceWorker();
  port.onDisconnect.addListener(() => {
    ports.delete(port);
  });
  const pingInterval = setInterval(() => {
    try {
      port.postMessage({ type: 'PING' });
    } catch (e) {
      clearInterval(pingInterval);
    }
  }, 25000);
});

let offscreenCreated = false;

async function ensureOffscreenDocument() {
  if (offscreenCreated) return true;
  try {
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT']
    });
    if (existingContexts.length > 0) {
      offscreenCreated = true;
      return true;
    }
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Play success sound notification'
    });
    offscreenCreated = true;
    return true;
  } catch (error) {
    if (error.message?.includes('already exists')) {
      offscreenCreated = true;
      return true;
    }
    return false;
  }
}

const capturedHits = new Map();

async function captureScreenshot(tabId) {
  try {
    let result = await chrome.storage.local.get(["xorex_toggle_auto_ss"]);
    if (result.xorex_toggle_auto_ss === false) {
      return null;
    }
    let lastCapture = capturedHits.get(tabId);
    let now = Date.now();
    if (lastCapture && now - lastCapture < 5000) {
      return null;
    }
    capturedHits.set(tabId, now);
    setTimeout(() => capturedHits.delete(tabId), 10000);
    await new Promise(resolve => setTimeout(resolve, 500));
    let tab;
    if (tabId) {
      tab = await chrome.tabs.get(tabId);
    } else {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      tab = activeTab;
    }
    if (!tab || !tab.windowId) {
      throw new Error("Invalid tab or window");
    }
    await chrome.windows.update(tab.windowId, { focused: true });
    await chrome.tabs.update(tab.id, { active: true });
    await new Promise(resolve => setTimeout(resolve, 100));
    let dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: "png",
      quality: 100
    });
    if (!dataUrl) {
      return null;
    }
    await ensureOffscreenDocument();
    await chrome.runtime.sendMessage({
      type: "COPY_TO_CLIPBOARD",
      dataUrl: dataUrl
    }).catch(() => {});
    let timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await chrome.downloads.download({
      url: dataUrl,
      filename: "XOREX_" + timestamp + ".png",
      saveAs: false
    });
    return dataUrl;
  } catch (error) {
    return null;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TELEGRAM_SEND") {
    (async () => {
      try {
        const response = await fetch("https://api.telegram.org/bot" + message.botToken + "/sendMessage", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: message.chatId,
            text: message.text,
            parse_mode: 'HTML',
            disable_web_page_preview: message.disablePreview || false
          })
        });
        const result = await response.json();
        sendResponse(result);
      } catch (e) {
        sendResponse({ ok: false, description: e.message });
      }
    })();
    return true;
  }
  if (message.type === "FETCH_IMAGE") {
    (async () => {
      try {
        const resp = await fetch(message.url);
        if (!resp.ok) { sendResponse({ success: false }); return; }
        const blob = await resp.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          sendResponse({ success: true, dataUrl: reader.result });
        };
        reader.onerror = () => sendResponse({ success: false });
        reader.readAsDataURL(blob);
      } catch (e) {
        sendResponse({ success: false, error: e.message });
      }
    })();
    return true;
  }
  if (message.type === "PLAY_SUCCESS_SOUND_OFFSCREEN") {
    ensureOffscreenDocument().then(created => {
      if (created) {
        setTimeout(() => {
          chrome.runtime.sendMessage({ type: 'PLAY_SUCCESS_SOUND', volume: message.volume || 1.0 }).catch(() => {});
        }, 100);
      }
    });
    return false;
  }
  if (message.type === "PLAY_CUSTOM_PREVIEW") {
    chrome.storage.local.get(['xorex_music_data'], (result) => {
      const audioData = result.xorex_music_data;
      if (audioData) {
        ensureOffscreenDocument().then(created => {
          if (created) {
            setTimeout(() => {
              chrome.runtime.sendMessage({ type: 'PLAY_CUSTOM_PREVIEW', audioData: audioData }).catch(() => {});
            }, 100);
          }
        });
      }
    });
    return false;
  }
  if (message.type === "STOP_CUSTOM_PREVIEW") {
    ensureOffscreenDocument().then(created => {
      if (created) {
        chrome.runtime.sendMessage({ type: 'STOP_CUSTOM_PREVIEW' }).catch(() => {});
      }
    });
    return false;
  }
  if (message.type === "PLAY_BACKGROUND_MUSIC") {
    chrome.storage.local.get(['xorex_music_data'], (result) => {
      const audioData = result.xorex_music_data;
      if (audioData) {
        ensureOffscreenDocument().then(created => {
          if (created) {
            setTimeout(() => {
              chrome.runtime.sendMessage({ type: 'PLAY_BACKGROUND_MUSIC', audioData: audioData, volume: message.volume }).catch(() => {});
            }, 100);
          }
        });
      }
    });
    return false;
  }
  if (message.type === "STOP_BACKGROUND_MUSIC") {
    ensureOffscreenDocument().then(created => {
      if (created) {
        chrome.runtime.sendMessage({ type: 'STOP_BACKGROUND_MUSIC' }).catch(() => {});
      }
    });
    return false;
  }
  if (message.type === "CAPTURE_SCREENSHOT") {
    const tabId = sender && sender.tab ? sender.tab.id : null;
    captureScreenshot(tabId).then((dataUrl) => {
      sendResponse({ dataUrl: dataUrl });
    });
    return true;
  }
  return false;
});
