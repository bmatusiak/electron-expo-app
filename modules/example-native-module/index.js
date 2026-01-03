const path = require('path');
let native = null;
try {
    native = require(path.join(__dirname, 'build', 'Release', 'example-native-module.node'));
} catch (e) {
    try { native = require(path.join(__dirname, 'build', 'Debug', 'example-native-module.node')); } catch (e2) { native = null; }
}

module.exports = {
    multiply: (a, b) => (native && typeof native.multiply === 'function' ? native.multiply(a, b) : a * b),
    hello: () => (native && typeof native.hello === 'function' ? native.hello() : 'Hello From JS')
};
