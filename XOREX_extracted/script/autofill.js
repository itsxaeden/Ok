(function() {
  'use strict';

  window.__XOREX_AUTOFILL_LOADED = true;

  window.XOREXAutofill = window.XOREXAutofill || {};

  XOREXAutofill.CARD_FIELD_SELECTORS = [
    '#cardNumber', '[name="cardNumber"]', '[autocomplete="cc-number"]',
    '[data-elements-stable-field-name="cardNumber"]',
    'input[placeholder*="Card number"]', 'input[placeholder*="card number"]',
    'input[aria-label*="Card number"]', '[class*="CardNumberInput"] input',
    '[class*="cardNumber"] input', 'input[name="number"]',
    'input[id*="card-number"]', 'input[name*="card_number"]',
    'input[placeholder*="0000"]', 'input[placeholder*="1234"]'
  ];

  XOREXAutofill.EXPIRY_FIELD_SELECTORS = [
    '#cardExpiry', '[name="cardExpiry"]', '[autocomplete="cc-exp"]',
    '[data-elements-stable-field-name="cardExpiry"]',
    'input[placeholder*="MM / YY"]', 'input[placeholder*="MM/YY"]',
    'input[placeholder*="MM"]', 'input[aria-label*="expir"]',
    '[class*="CardExpiry"] input', '[class*="expiry"] input',
    'input[name="expiry"]', 'input[name="exp"]'
  ];

  XOREXAutofill.CVC_FIELD_SELECTORS = [
    '#cardCvc', '[name="cardCvc"]', '[autocomplete="cc-csc"]',
    '[data-elements-stable-field-name="cardCvc"]',
    'input[placeholder*="CVC"]', 'input[placeholder*="CVV"]',
    'input[aria-label*="CVC"]', 'input[aria-label*="CVV"]',
    'input[aria-label*="security code"]', 'input[aria-label*="Security code"]',
    '[class*="CardCvc"] input', '[class*="cvc"] input',
    'input[name="cvc"]', 'input[name="cvv"]'
  ];

  XOREXAutofill.NAME_FIELD_SELECTORS = [
    '#billingName', '[name="billingName"]', '[autocomplete="cc-name"]', '[autocomplete="name"]',
    'input[placeholder*="Name on card"]', 'input[placeholder*="name on card"]',
    'input[aria-label*="Name"]', '[class*="billingName"] input', 'input[name="name"]'
  ];

  XOREXAutofill.EMAIL_FIELD_SELECTORS = [
    'input[type="email"]', 'input[name*="email"]', 'input[autocomplete="email"]',
    'input[id*="email"]', 'input[placeholder*="email"]', 'input[placeholder*="Email"]',
    '[class*="email"] input', 'input[aria-label*="email"]'
  ];

  XOREXAutofill.ADDRESS_FIELD_SELECTORS = [
    '#billingAddressLine1', '[name="billingAddressLine1"]', '[autocomplete="address-line1"]'
  ];

  XOREXAutofill.CITY_FIELD_SELECTORS = [
    '#billingLocality', '[name="billingLocality"]', '[autocomplete="address-level2"]'
  ];

  XOREXAutofill.POSTAL_FIELD_SELECTORS = [
    '#billingPostalCode', '[name="billingPostalCode"]', '[autocomplete="postal-code"]'
  ];

  XOREXAutofill.COUNTRY_FIELD_SELECTORS = [
    '#billingCountry', '[name="billingCountry"]', '[autocomplete="country"]'
  ];

  XOREXAutofill.SUBMIT_BUTTON_SELECTORS = [
    '.SubmitButton', '[class*="SubmitButton"]', 'button[type="submit"]',
    '[data-testid*="submit"]', '[data-testid*="pay"]'
  ];

  XOREXAutofill.wait = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  XOREXAutofill.hasCardFields = function() {
    for (const selector of XOREXAutofill.CARD_FIELD_SELECTORS) {
      if (document.querySelector(selector)) return true;
    }
    if (document.querySelector('[class*="StripeElement"], [class*="CardElement"]')) {
      return true;
    }
    return false;
  };

  XOREXAutofill.hasSubmitButton = function() {
    for (const selector of XOREXAutofill.SUBMIT_BUTTON_SELECTORS) {
      try {
        if (document.querySelector(selector)) return true;
      } catch (e) {}
    }
    return false;
  };

  XOREXAutofill.findField = function(selectors) {
    for (const selector of selectors) {
      try {
        const element = document.querySelector(selector);
        if (element) return element;
      } catch (e) {}
    }
    return null;
  };

  XOREXAutofill.findAndClickField = async function(selectors, fieldName) {
    for (const selector of selectors) {
      try {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          const rect = element.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            element.click();
            element.focus?.();
            await XOREXAutofill.wait(50);
            return true;
          }
        }
      } catch (e) {}
    }
    return false;
  };

  XOREXAutofill.simulateInput = function(element, value) {
    if (!element) return;

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;

    if (element.tagName === "INPUT" && nativeInputValueSetter) {
      nativeInputValueSetter.call(element, value);
    } else if (element.tagName === "TEXTAREA" && nativeTextAreaValueSetter) {
      nativeTextAreaValueSetter.call(element, value);
    } else {
      element.value = value;
    }

    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.dispatchEvent(new Event("blur", { bubbles: true }));
  };

  XOREXAutofill.simulateSelectChange = function(element, value) {
    if (!element) return;

    element.value = value;
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.dispatchEvent(new Event("input", { bubbles: true }));
  };

  XOREXAutofill.typeText = async function(text, delay = 10) {
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

      await XOREXAutofill.wait(delay);
    }
  };

  XOREXAutofill.pressTab = async function() {
    const tabDown = new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', keyCode: 9, which: 9, bubbles: true });
    const tabUp = new KeyboardEvent('keyup', { key: 'Tab', code: 'Tab', keyCode: 9, which: 9, bubbles: true });
    document.activeElement?.dispatchEvent(tabDown);
    document.activeElement?.dispatchEvent(tabUp);
    await XOREXAutofill.wait(50);
  };

  XOREXAutofill.isInvoiceStripePage = function() {
    const url = window.location.href;
    return url.includes('invoice.stripe.com') || url.includes('/invoice/');
  };

  XOREXAutofill.isCheckoutStripePage = function() {
    const url = window.location.href;
    return url.includes('checkout.stripe.com');
  };

  XOREXAutofill.isPaymentPage = function() {
    const url = window.location.href;
    if (url.includes('checkout.stripe.com') || url.includes('invoice.stripe.com')) {
      return true;
    }
    if (XOREXAutofill.hasCardFields()) {
      return true;
    }
    if (document.querySelector('[class*="StripeElement"], [class*="PaymentElement"]')) {
      return true;
    }
    return false;
  };

  XOREXAutofill.simulateStripeElementsInput = async function(card, mm, yy, cvv) {

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

    let cardFieldFound = await XOREXAutofill.findAndClickField(cardNumberSelectors, 'card number');

    if (!cardFieldFound) {
      const stripeElements = document.querySelectorAll('[class*="StripeElement"], [class*="CardElement"], [class*="PaymentElement"]');
      for (const el of stripeElements) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 100 && rect.height > 20) {
          el.click();
          await XOREXAutofill.wait(80);
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
          await XOREXAutofill.wait(50);
          cardFieldFound = true;
        }
      }
    }

    if (cardFieldFound) {
      await XOREXAutofill.typeText(card, 8);
      await XOREXAutofill.wait(80);

      await XOREXAutofill.pressTab();
      await XOREXAutofill.typeText(mm + yy, 8);
      await XOREXAutofill.wait(80);

      await XOREXAutofill.pressTab();
      await XOREXAutofill.typeText(cvv, 8);
      await XOREXAutofill.wait(80);
    }

  };

  XOREXAutofill.fillStripeElementsIframes = async function(card, mm, yy, cvv) {
    const iframes = document.querySelectorAll('iframe[name*="__privateStripeFrame"], iframe[title*="Secure"], iframe[src*="stripe"]');

    for (const iframe of iframes) {
      try {
        const rect = iframe.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          iframe.click();
          await XOREXAutofill.wait(30);
        }
      } catch (e) {
      }
    }

    const stripeInputWrappers = document.querySelectorAll('[class*="StripeElement"], [class*="CardElement"], [class*="PaymentElement"]');
    for (const wrapper of stripeInputWrappers) {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        wrapper.click();
        await XOREXAutofill.wait(30);
      }
    }

    if (XOREXAutofill.isInvoiceStripePage()) {
      await XOREXAutofill.simulateStripeElementsInput(card, mm, yy, cvv);
    }
  };

  XOREXAutofill.randomHumanNames = [
    "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
    "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth",
    "Nancy", "Betty", "Margaret", "Sandra", "Ashley", "Dorothy", "Kimberly", "Emily", "Donna", "Michelle",
    "Alex", "Chris", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery", "Cameron"
  ];

  XOREXAutofill.getRandomName = function() {
    return XOREXAutofill.randomHumanNames[Math.floor(Math.random() * XOREXAutofill.randomHumanNames.length)];
  };

  XOREXAutofill.getRandomEmail = function() {
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
    const name = XOREXAutofill.randomHumanNames[Math.floor(Math.random() * XOREXAutofill.randomHumanNames.length)].toLowerCase();
    const randomNum = Math.floor(Math.random() * 9999);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return name + randomNum + "@" + domain;
  };

  XOREXAutofill.getRandomStreet = function() {
    const streets = ["Main Street", "Oak Road", "Park Avenue", "Maple Drive", "Cedar Lane", "Pine Street", "Lake Drive", "Forest Avenue"];
    const number = Math.floor(Math.random() * 999) + 1;
    return number + " " + streets[Math.floor(Math.random() * streets.length)];
  };

})();
