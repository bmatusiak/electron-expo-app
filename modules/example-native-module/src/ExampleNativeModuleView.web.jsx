import * as React from 'react';

/**
 * @typedef {import('./ExampleNativeModule.types').ExampleNativeModuleViewProps} ExampleNativeModuleViewProps
 */

/** @param {ExampleNativeModuleViewProps} props */
export default function ExampleNativeModuleView(props) {
  const isElectron = (() => {
    try {
      const w = typeof window !== 'undefined' ? window : undefined;
      const ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
      return Boolean(
        // Typical Electron renderer UA includes "Electron/xx"
        (ua && ua.includes('Electron/')) ||
        // expo-electron preload exposes these in the main world
        (w && w.ElectronNative) ||
        (w && w.electron)
      );
    } catch (e) {
      return false;
    }
  })();

  if (isElectron) {
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
