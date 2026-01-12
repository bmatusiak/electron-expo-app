import * as React from 'react';

/**
 * @typedef {import('./ExampleNativeModule.types').ExampleNativeModuleViewProps} ExampleNativeModuleViewProps
 */

/** @param {ExampleNativeModuleViewProps} props */
export default function ExampleNativeModuleView(props) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
