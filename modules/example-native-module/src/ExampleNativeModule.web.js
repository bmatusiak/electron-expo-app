import { registerWebModule, NativeModule } from 'expo';

/**
 * @typedef {import('./ExampleNativeModule.types').ChangeEventPayload} ChangeEventPayload
 */

/**
 * @typedef {{
 *   onChange: (params: ChangeEventPayload) => void;
 * }} ExampleNativeModuleEvents
 */

class ExampleNativeModule extends NativeModule {
    PI = Math.PI;

    async setValueAsync(value) {
        this.emit('onChange', { value });
    }

    hello() {
        return 'Hello world! 👋';
    }
}

export default registerWebModule(ExampleNativeModule, 'ExampleNativeModule');
