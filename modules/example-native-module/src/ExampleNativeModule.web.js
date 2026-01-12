import { registerWebModule, NativeModule } from 'expo';

/**
 * @typedef {import('./ExampleNativeModule.types').ChangeEventPayload} ChangeEventPayload
 */

/**
 * @typedef {{
 *   onChange: (params: ChangeEventPayload) => void;
 * }} ExampleNativeModuleEvents
 */

function getElectronNativeImpl() {
    try {
        const root = (typeof globalThis !== 'undefined' && globalThis) ? globalThis : null;
        const nativeRoot = root && root.ElectronNative;
        if (!nativeRoot) return null;
        const impl = nativeRoot['example-native-module'];
        if (!impl || impl._missing) return null;
        return impl;
    } catch (e) {
        return null;
    }
}

class ExampleNativeModule extends NativeModule {
    PI = Math.PI;

    constructor() {
        super();
        const impl = getElectronNativeImpl();
        if (impl && typeof impl.onChange === 'function') {
            try {
                impl.onChange((payload) => {
                    if (payload && typeof payload.value !== 'undefined') {
                        this.emit('onChange', { value: String(payload.value) });
                    }
                });
            } catch (e) {
                // ignore
            }
        }
    }

    async setValueAsync(value) {
        const impl = getElectronNativeImpl();
        if (impl && typeof impl.setValueAsync === 'function') {
            await impl.setValueAsync(value);
            return;
        }
        this.emit('onChange', { value });
    }

    hello() {
        const impl = getElectronNativeImpl();
        if (impl && typeof impl.hello === 'function') return impl.hello();
        return 'Hello From JS';
    }

    multiply(a, b) {
        const impl = getElectronNativeImpl();
        if (impl && typeof impl.multiply === 'function') return impl.multiply(a, b);
        return a * b;
    }
}

export default registerWebModule(ExampleNativeModule, 'ExampleNativeModule');
