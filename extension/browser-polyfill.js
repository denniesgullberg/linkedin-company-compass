// Minimal browser API polyfill for cross-browser compatibility
// Firefox supports both `browser` and `chrome` namespaces in MV3
// This ensures `chrome.storage` and `chrome.runtime` work everywhere
if (typeof globalThis.chrome === 'undefined' && typeof globalThis.browser !== 'undefined') {
  globalThis.chrome = globalThis.browser;
}
