
(function() {
  'use strict';

  window.__XOREX_STORAGE_LOADED = true;

  var K = {
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

  window.XOREXKeys = K;
  window.XOREXStorage = window.XOREXStorage || {};
  var XOREXStorage = window.XOREXStorage;

  var requestCounter = 0;
  var pendingRequests = new Map();

  function storageRequest(action, data) {
    data = data || {};
    return new Promise(function(resolve) {
      var requestId = 'storage_' + (++requestCounter) + '_' + Date.now();

      var handler = function(event) {
        if (event.data && event.data.type === 'XOREX_STORAGE_RESPONSE' && event.data.requestId === requestId) {
          window.removeEventListener('message', handler);
          pendingRequests.delete(requestId);
          resolve(event.data.result);
        }
      };

      pendingRequests.set(requestId, handler);
      window.addEventListener('message', handler);

      window.postMessage({
        type: 'XOREX_STORAGE_REQUEST',
        requestId: requestId,
        action: action,
        data: data
      }, '*');

      setTimeout(function() {
        if (pendingRequests.has(requestId)) {
          window.removeEventListener('message', handler);
          pendingRequests.delete(requestId);
          resolve(null);
        }
      }, 3000);
    });
  }

  var RANDOM_BG_COLORS = [
    "#1a1a2e", "#16213e", "#0f3460", "#1b262c", "#2c3e50",
    "#1f1f38", "#2d2d44", "#1e3a5f", "#2b2b52", "#1c1c3c"
  ];

  XOREXStorage.getRandomBgColor = function() {
    return RANDOM_BG_COLORS[Math.floor(Math.random() * RANDOM_BG_COLORS.length)];
  };

  XOREXStorage.loadBackgroundColor = function(callback) {
    storageRequest('GET', { keys: [K.BG_COLOR, K.HAS_CUSTOM_COLOR] }).then(function(result) {
      result = result || {};
      var color = result[K.BG_COLOR] || XOREXStorage.getRandomBgColor();
      var userSet = result[K.HAS_CUSTOM_COLOR] || false;
      callback(color, userSet);
    });
  };

  XOREXStorage.saveBackgroundColor = function(color, userSet) {
    var data = {};
    data[K.BG_COLOR] = color;
    data[K.HAS_CUSTOM_COLOR] = userSet !== false;
    storageRequest('SET', data);
  };

  XOREXStorage.loadCustomNameEmail = function(callback) {
    storageRequest('GET', { keys: [K.CUSTOM_NAME, K.CUSTOM_EMAIL] }).then(function(result) {
      result = result || {};
      callback(result[K.CUSTOM_NAME] || '', result[K.CUSTOM_EMAIL] || '');
    });
  };

  XOREXStorage.saveCustomName = function(name) {
    var data = {};
    data[K.CUSTOM_NAME] = name;
    storageRequest('SET', data);
  };

  XOREXStorage.saveCustomEmail = function(email) {
    var data = {};
    data[K.CUSTOM_EMAIL] = email;
    storageRequest('SET', data);
  };

  XOREXStorage.loadCardHistory = function(callback) {
    storageRequest('GET', { keys: [K.CARD_HISTORY] }).then(function(result) {
      result = result || {};
      var history = result[K.CARD_HISTORY] || [];
      callback(Array.isArray(history) ? history : []);
    });
  };

  XOREXStorage.saveCardHistory = function(history) {
    var data = {};
    data[K.CARD_HISTORY] = history.slice(-100);
    storageRequest('SET', data);
  };

  XOREXStorage.addToCardHistory = function(entry, callback) {
    XOREXStorage.loadCardHistory(function(history) {
      history.push(entry);
      XOREXStorage.saveCardHistory(history);
      if (callback) callback(history);
    });
  };

  XOREXStorage.loadSavedBINs = function(callback) {
    storageRequest('GET', { keys: [K.SAVED_BINS] }).then(function(result) {
      result = result || {};
      var bins = result[K.SAVED_BINS] || [];
      callback(Array.isArray(bins) ? bins : []);
    });
  };

  XOREXStorage.saveBINs = function(bins) {
    var data = {};
    data[K.SAVED_BINS] = bins;
    storageRequest('SET', data);
  };

  XOREXStorage.loadToggleState = function(toggleType, callback) {
    var keyMap = {
      'hitSound': K.TOGGLE_HIT_SOUND,
      'autoSS': K.TOGGLE_AUTO_SS
    };
    var key = keyMap[toggleType] || ('xorex_toggle_' + toggleType);
    storageRequest('GET', { keys: [key] }).then(function(result) {
      result = result || {};
      callback(result[key] !== undefined ? result[key] : true);
    });
  };

  XOREXStorage.saveToggleState = function(toggleType, value) {
    var keyMap = {
      'hitSound': K.TOGGLE_HIT_SOUND,
      'autoSS': K.TOGGLE_AUTO_SS
    };
    var key = keyMap[toggleType] || ('xorex_toggle_' + toggleType);
    var data = {};
    data[key] = value;
    storageRequest('SET', data);
  };

  XOREXStorage.loadSavedId = function(callback) {
    storageRequest('GET', { keys: [K.SAVED_ID] }).then(function(result) {
      result = result || {};
      callback(result[K.SAVED_ID] || '');
    });
  };

  XOREXStorage.saveId = function(id) {
    var data = {};
    data[K.SAVED_ID] = id;
    storageRequest('SET', data);
  };

  XOREXStorage.loadAllData = function(callback) {
    var allKeys = [];
    var kNames = Object.keys(K);
    for (var i = 0; i < kNames.length; i++) {
      allKeys.push(K[kNames[i]]);
    }
    storageRequest('GET', { keys: allKeys }).then(function(result) {
      result = result || {};
      callback(result);
    });
  };

})();
