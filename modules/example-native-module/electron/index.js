const path = require('path');
const { EventEmitter } = require('events');
let native = null;
try {
    native = require(path.join(__dirname, 'build', 'Release', 'example-native-module.node'));
} catch (e) {
    try { native = require(path.join(__dirname, 'build', 'Debug', 'example-native-module.node')); } catch (e2) { native = null; }
}

const emitter = new EventEmitter();

function emitChange(value) {
    emitter.emit('change', { value: String(value) });
}

module.exports = {
    PI: Math.PI,
    multiply: (a, b) => (native && typeof native.multiply === 'function' ? native.multiply(a, b) : a * b),
    hello: () => (native && typeof native.hello === 'function' ? native.hello() : 'Hello From JS'),
    onChange: (cb) => {
        if (typeof cb !== 'function') return () => { };
        const handler = (payload) => cb(payload);
        emitter.on('change', handler);
        return () => {
            try { emitter.removeListener('change', handler); } catch (e) { }
        };
    },
    setValueAsync: async (value) => {
        // True-native style: call into the addon and let it drive the change event.
        if (native && typeof native.setValueAsync === 'function') {
            await native.setValueAsync(String(value), (v) => emitChange(v));
            return;
        }
        // Fallback when addon not built.
        emitChange(value);
    },
};
