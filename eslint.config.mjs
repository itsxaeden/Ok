export default [
  {
    files: ["XOREX_extracted/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        chrome: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        clearTimeout: "readonly",
        fetch: "readonly",
        XMLHttpRequest: "readonly",
        URL: "readonly",
        Blob: "readonly",
        FileReader: "readonly",
        Event: "readonly",
        KeyboardEvent: "readonly",
        InputEvent: "readonly",
        HTMLElement: "readonly",
        MutationObserver: "readonly",
        navigator: "readonly",
        location: "readonly",
        Audio: "readonly",
        Image: "readonly",
        atob: "readonly",
        btoa: "readonly",
        self: "readonly",
        localStorage: "readonly",
        requestAnimationFrame: "readonly",
        performance: "readonly",
        alert: "readonly"
      }
    },
    rules: {
      "no-undef": "warn",
      "no-unused-vars": "warn",
      "no-redeclare": "warn"
    }
  }
];
