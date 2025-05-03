// global.js - Polyfills for React Native
import 'react-native-url-polyfill/auto';

// Buffer polyfill
global.Buffer = require('buffer').Buffer;

// Process polyfill
global.process = require('process');

// Set up crypto
if (typeof global.crypto === 'undefined') {
  global.crypto = require('crypto-browserify');
}

// Add zlib polyfill to fix WebSocket issue
global.zlib = require('browserify-zlib');

// TextEncoder/TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('text-encoding').TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('text-encoding').TextDecoder;
}

// Ensure fetch API has all required methods for Supabase
if (typeof global.fetch !== 'undefined' && !global.fetch.toString().includes('native code')) {
  const originalFetch = global.fetch;
  global.fetch = (input, init) => {
    return originalFetch(input, init).then(response => {
      response.arrayBuffer = function() {
        return response.blob().then(blob => {
          return new Promise((resolve, reject) => {
            const reader = new global.FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
          });
        });
      };
      return response;
    });
  };
} 