import * as React from 'react';

/**
 * @typedef {import('./ExampleNativeModule.types').ExampleNativeModuleViewProps} ExampleNativeModuleViewProps
 */

/** @param {ExampleNativeModuleViewProps} props */
export default function ExampleNativeModuleView(props) {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <webview
        style={{ flex: 1 }}
        src={props.url}
        // Use 'did-finish-load' instead of 'onLoad' for webview
        onDidFinishLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
