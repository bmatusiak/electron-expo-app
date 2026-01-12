import { requireNativeModule } from 'expo';

/**
 * @typedef {import('./ExampleNativeModule.types').ExampleNativeModuleEvents} ExampleNativeModuleEvents
 */

/**
 * @typedef {import('expo').NativeModule<ExampleNativeModuleEvents> & {
 *   PI: number;
 *   hello(): string;
 *   setValueAsync(value: string): Promise<void>;
 * }} ExampleNativeModule
 */

// This call loads the native module object from the JSI.
export default /** @type {ExampleNativeModule} */ (
    requireNativeModule('ExampleNativeModule')
);
