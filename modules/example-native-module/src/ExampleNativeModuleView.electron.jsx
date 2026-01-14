import * as React from 'react';
import { isElectron } from 'expo-electron';

/**
 * @typedef {import('./ExampleNativeModule.types').ExampleNativeModuleViewProps} ExampleNativeModuleViewProps
 */

/** @param {ExampleNativeModuleViewProps} props */
export default function ExampleNativeModuleView(props) {
  const webviewRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof isElectron !== 'function' || !isElectron()) return;

    const el = webviewRef.current;
    if (!el || typeof el.addEventListener !== 'function') return;

    const handler = () => {
      try {
        props.onLoad({ nativeEvent: { url: props.url } });
      } catch (e) {
        // ignore
      }
    };

    el.addEventListener('did-finish-load', handler);
    return () => {
      try {
        el.removeEventListener('did-finish-load', handler);
      } catch (e) {
        // ignore
      }
    };
  }, [props.url, props.onLoad]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <webview
        ref={webviewRef}
        style={{ flex: 1 }}
        src={props.url}
      />
    </div>
  );
}
