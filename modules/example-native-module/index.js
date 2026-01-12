// Reexport the native module. On web, it will be resolved to ExampleNativeModule.web.js
// and on native platforms to ExampleNativeModule.js
export { default } from './src/ExampleNativeModule';
export { default as ExampleNativeModuleView } from './src/ExampleNativeModuleView';
export * from './src/ExampleNativeModule.types';
