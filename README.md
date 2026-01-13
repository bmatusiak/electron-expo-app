# electron-expo-app

A small example project for developing, testing, and inspecting how Expo web apps are packaged for Electron — including support for native modules.

Overview
- Purpose: iterate on building an Expo web app inside Electron, exercise native modules, and inspect the generated Electron app bundle.

Important notes
- Project Electron folder: `electron/` is created by `expo-electron prebuild`, but is intended to be edited by developers. Prebuild copies missing template files and will not overwrite existing ones.
- Generated artifacts: autolink overwrites `electron/main/preload.js` and `electron/electron-resources.json` (these are generated).
- Template location: the Electron entry template lives at [modules/expo-electron/main/main.js](modules/expo-electron/main/main.js).
	- Preload: `preload.js` is produced automatically by the autolink process; changes should be made in [modules/expo-electron/lib/autolink.js](modules/expo-electron/lib/autolink.js).
	- Template changes: if you update the template and want those changes copied into an existing `electron/` folder, delete the specific file(s) under `electron/main/` (or delete the entire `electron/` folder) and rerun `npx expo-electron prebuild`.

Repository layout (high level)
- `electron/` — project Electron sources (editable) and packaging workspace outputs under `electron/build/`.
- `modules/example-native-module/` — example native addon source and build artifacts.
- `modules/expo-electron/` — local helper/cli used to prebuild, autolink, start Electron, and package.

Development tips
- Make changes in `modules/expo-electron/`, `modules/*`, and the project root.
- Treat `electron/` as your app's Electron layer: edit it directly, but expect autolink to regenerate `electron/main/preload.js`.
- Inspect `electron/build/` for the packaging workspace and outputs.

If you need more guidance on build commands or workflows, check [modules/expo-electron/README.md](modules/expo-electron/README.md).

