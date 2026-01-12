const path = require('path');
let native = null;
try {
    native = require(path.join(__dirname, 'build', 'Release', 'example-native-module.node'));
} catch (e) {
    try { native = require(path.join(__dirname, 'build', 'Debug', 'example-native-module.node')); } catch (e2) { native = null; }
}

module.exports = {
    PI: Math.PI,
    multiply: (a, b) => (native && typeof native.multiply === 'function' ? native.multiply(a, b) : a * b),
    hello: () => (native && typeof native.hello === 'function' ? native.hello() : 'Hello From JS'),
    setValueAsync: async (_value) => {
        // Electron renderer uses the web implementation (NativeModule) to emit events.
        // This exists to keep the Electron native API shape aligned with iOS/Android.
        return;
    },
};
