import * as React from 'react';
import { isElectron } from 'expo-electron';

/**
 * @typedef {import('./ExampleNativeModule.types').ExampleNativeModuleViewProps} ExampleNativeModuleViewProps
 */

/** @param {ExampleNativeModuleViewProps} props */
export default function ExampleNativeModuleView(props) {
  const inElectron = (() => {
    try {
      return typeof isElectron === 'function' ? isElectron() : false;
    } catch (e) {
      return false;
    }
  })();

  if (inElectron) {
    try {
      const ElectronView = require('./ExampleNativeModuleView.electron').default;
      if (ElectronView) return <ElectronView {...props} />;
    } catch (e) {
      // fall back to iframe
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <iframe
        title="ExampleNativeModuleView"
        style={{ flex: 1, border: 'none' }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
