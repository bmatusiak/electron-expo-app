import { requireNativeView } from 'expo';
import * as React from 'react';

/**
 * @typedef {import('./ExampleNativeModule.types').ExampleNativeModuleViewProps} ExampleNativeModuleViewProps
 */

const NativeView = requireNativeView('ExampleNativeModule');

/** @param {ExampleNativeModuleViewProps} props */
export default function ExampleNativeModuleView(props) {
  return <NativeView {...props} />;
}
