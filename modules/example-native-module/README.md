# example-native-module

Example Expo Module used as a demo for `expo-electron` autolinking.

It provides:

- **Android / iOS (Expo Modules):** a native module named `ExampleNativeModule` + a native view named `ExampleNativeModule`.
- **Web:** a web implementation registered via `registerWebModule`.
- **Electron:** an optional native Node-API addon (`.node`) exposed to the renderer through `expo-electron`’s preload bridge as `window.ElectronNative['example-native-module']`.

## API

JavaScript entrypoints:

- `ExampleNativeModule` (default export)
- `ExampleNativeModuleView`

Methods / constants:

- `PI: number`
- `hello(): string`
- `multiply(a: number, b: number): number`
- `setValueAsync(value: string): Promise<void>`
- event: `onChange` → `{ value: string }`

## Usage

### Module

```js
import ExampleNativeModule from 'example-native-module';

console.log(ExampleNativeModule.PI);
console.log(ExampleNativeModule.hello());
console.log(ExampleNativeModule.multiply(2, 3));

const sub = ExampleNativeModule.addListener('onChange', (event) => {
  console.log('onChange', event.value);
});

await ExampleNativeModule.setValueAsync('hello');

sub.remove();
```

### View

```jsx
import * as React from 'react';
import { View } from 'react-native';
import { ExampleNativeModuleView } from 'example-native-module';

export function Demo() {
  return (
    <View style={{ flex: 1 }}>
      <ExampleNativeModuleView
        style={{ flex: 1 }}
        url="https://example.com"
        onLoad={(e) => console.log('loaded', e.nativeEvent.url)}
      />
    </View>
  );
}
```

- On **Android/iOS**, this renders the native view.
- On **Electron**, it prefers an Electron `<webview>` (see `src/ExampleNativeModuleView.electron.jsx`).
- On **other web**, it falls back to an `<iframe>`.

## Electron integration (how it works)

- `expo-electron` scans your app’s **top-level** `dependencies`/`devDependencies` for packages that contain `electron/index.js`.
- For each matched package, `expo-electron` exposes the module in the renderer as:

```js
window.ElectronNative['example-native-module']
```

- This package’s web implementation (`src/ExampleNativeModule.web.js`) detects that bridge and forwards calls/events to it when present.

### Building the Electron native addon

The Electron addon lives in `electron/` and is built with `node-gyp` + `node-addon-api`.

From this package folder:

```bash
cd electron
npm install
npm run build
```

If the addon isn’t built (or fails to load), the JS implementation falls back to pure JS (`hello` and `multiply`) and still emits `onChange` events.

#### Electron ABI note (important)

If you see errors like **“Module version mismatch / NODE_MODULE_VERSION …”**, the addon was built against the wrong runtime.

Rebuild it against your Electron version:

**Windows (PowerShell)**

```powershell
cd electron
$env:npm_config_runtime='electron'
$env:npm_config_target='YOUR_ELECTRON_VERSION'
$env:npm_config_disturl='https://electronjs.org/headers'
$env:npm_config_build_from_source='true'
npm run build
```

**Windows (cmd.exe)**

```bat
cd electron
set npm_config_runtime=electron
set npm_config_target=YOUR_ELECTRON_VERSION
set npm_config_disturl=https://electronjs.org/headers
set npm_config_build_from_source=true
npm run build
```

## Repo layout

- `src/ExampleNativeModule.js`: native (Android/iOS) module wrapper via `requireNativeModule('ExampleNativeModule')`
- `src/ExampleNativeModule.web.js`: web/electron implementation (uses `window.ElectronNative` when available)
- `src/ExampleNativeModuleView.jsx`: native view wrapper (`requireNativeView`)
- `src/ExampleNativeModuleView.web.jsx`: web view implementation (Electron detection + fallback)
- `src/ExampleNativeModuleView.electron.jsx`: Electron `<webview>` implementation
- `android/` and `ios/`: Expo Modules native implementations
- `electron/`: Node-API addon (`binding.gyp`, `src/addon.cc`) + JS wrapper (`electron/index.js`)

## Development prerequisites

- Node.js + npm
- For building the Electron addon:
  - Python (for node-gyp)
  - C++ toolchain (Windows: Visual Studio Build Tools)

## Troubleshooting

- **Electron native module missing:** check `window.electron.getNativeModuleStatus()` (exposed by `expo-electron` preload) and ensure the addon binary exists and can be required.
- **No events on Electron:** ensure the renderer is running with the `expo-electron` preload that exposes `window.ElectronNative`.
