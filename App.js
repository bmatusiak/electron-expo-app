import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ExpoElectron from 'expo-electron';

export default function App() {
  const electron = useMemo(() => ExpoElectron.getElectronBridge(), []);
  const desktop = useMemo(() => ExpoElectron.createDesktopApi(electron), [electron]);

  const [lastDeepLink, setLastDeepLink] = useState(null);
  const [themeInfo, setThemeInfo] = useState(null);
  const [powerEvents, setPowerEvents] = useState([]);
  const [userDataPath, setUserDataPath] = useState(null);
  const [clipboardText, setClipboardText] = useState('Hello from Electron + Expo');
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [lastDialogJson, setLastDialogJson] = useState(null);
  const [logLines, setLogLines] = useState([]);

  function log(line) {
    setLogLines((prev) => [String(line), ...prev].slice(0, 30));
  }

  const nativeHello = useMemo(() => {
    try {
      const mod = ExpoElectron.requireNativeModule('example-native-module');
      if (mod && typeof mod.hello === 'function') return mod.hello();
    } catch (e) {
      // ignore
    }
    return 'No native module found';
  }, []);

  useEffect(() => {
    if (!electron) return;

    let unsubDeepLink = null;
    let unsubTheme = null;
    let unsubPower = null;

    try {
      if (typeof electron.onDeepLink === 'function') {
        unsubDeepLink = electron.onDeepLink((url) => {
          setLastDeepLink(String(url || ''));
          log('deep link: ' + String(url || ''));
        });
      }
    } catch (e) {
      log('onDeepLink failed: ' + (e && e.message));
    }

    try {
      if (typeof electron.onThemeChanged === 'function') {
        unsubTheme = electron.onThemeChanged((payload) => {
          setThemeInfo(payload);
          log('theme updated: ' + JSON.stringify(payload));
        });
      }
    } catch (e) {
      log('onThemeChanged failed: ' + (e && e.message));
    }

    try {
      if (typeof electron.onPowerEvent === 'function') {
        unsubPower = electron.onPowerEvent((payload) => {
          setPowerEvents((prev) => [payload, ...prev].slice(0, 20));
          log('power event: ' + JSON.stringify(payload));
        });
      }
    } catch (e) {
      log('onPowerEvent failed: ' + (e && e.message));
    }

    (async () => {
      try {
        if (typeof electron.getTheme === 'function') {
          const t = await electron.getTheme();
          setThemeInfo(t);
          log('theme: ' + JSON.stringify(t));
        }
        if (typeof electron.getPath === 'function') {
          const p = await electron.getPath('userData');
          setUserDataPath(p);
          log('userData path: ' + String(p));
        }
      } catch (e) {
        log('init failed: ' + (e && e.message));
      }
    })();

    return () => {
      try {
        if (typeof unsubDeepLink === 'function') unsubDeepLink();
        if (typeof unsubTheme === 'function') unsubTheme();
        if (typeof unsubPower === 'function') unsubPower();
      } catch (e) {
        // ignore
      }
    };
  }, [electron]);

  const isElectron = useMemo(() => ExpoElectron.isElectron(), []);

  async function openFileDialog() {
    try {
      const res = await desktop.openFileDialog({
        title: 'Pick a file',
        properties: ['openFile'],
      });
      setLastDialogJson(JSON.stringify(res, null, 2));
      const fp = res && Array.isArray(res.filePaths) && res.filePaths[0];
      if (fp) setSelectedFilePath(fp);
      log('open dialog: ' + JSON.stringify(res));
    } catch (e) {
      log('openFileDialog failed: ' + (e && e.message));
    }
  }

  async function saveFileDialog() {
    try {
      const res = await desktop.saveFileDialog({
        title: 'Save a file',
        defaultPath: selectedFilePath || undefined,
      });
      setLastDialogJson(JSON.stringify(res, null, 2));
      log('save dialog: ' + JSON.stringify(res));
    } catch (e) {
      log('saveFileDialog failed: ' + (e && e.message));
    }
  }

  async function readClipboard() {
    try {
      const t = await desktop.readClipboardText();
      setClipboardText(String(t || ''));
      log('clipboard read');
    } catch (e) {
      log('readClipboardText failed: ' + (e && e.message));
    }
  }

  async function writeClipboard() {
    try {
      await desktop.writeClipboardText(clipboardText);
      log('clipboard written');
    } catch (e) {
      log('writeClipboardText failed: ' + (e && e.message));
    }
  }

  async function openExternal() {
    try {
      const ok = await desktop.openExternal('https://expo.dev');
      log('openExternal result: ' + String(ok));
    } catch (e) {
      log('openExternal failed: ' + (e && e.message));
    }
  }

  async function showInFolder() {
    if (!selectedFilePath) return log('no selected file path');
    try {
      const ok = await desktop.showItemInFolder(selectedFilePath);
      log('showItemInFolder result: ' + String(ok));
    } catch (e) {
      log('showItemInFolder failed: ' + (e && e.message));
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>expo-electron demo</Text>
        <Text style={styles.section}>Native module</Text>
        <Text style={styles.mono}>{nativeHello}</Text>

        <Text style={styles.section}>Electron bridge</Text>
        <Text>Electron detected: {String(isElectron)}</Text>
        <Text style={styles.muted}>
          Last deep link: {lastDeepLink ? String(lastDeepLink) : '(none)'}
        </Text>

        <Text style={styles.muted}>
          Theme: {themeInfo ? JSON.stringify(themeInfo) : '(unknown)'}
        </Text>
        <Text style={styles.muted}>
          userData: {userDataPath ? String(userDataPath) : '(unknown)'}
        </Text>

        <Text style={styles.section}>Dialogs</Text>
        <View style={styles.row}>
          <Pressable style={styles.button} onPress={openFileDialog}>
            <Text style={styles.buttonText}>Open file</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={saveFileDialog}>
            <Text style={styles.buttonText}>Save file</Text>
          </Pressable>
        </View>
        <Text style={styles.muted}>Selected file: {selectedFilePath ? String(selectedFilePath) : '(none)'}</Text>
        <View style={styles.row}>
          <Pressable style={styles.button} onPress={showInFolder}>
            <Text style={styles.buttonText}>Show in folder</Text>
          </Pressable>
        </View>
        {lastDialogJson ? <Text style={styles.mono}>{lastDialogJson}</Text> : null}

        <Text style={styles.section}>Clipboard</Text>
        <TextInput
          value={clipboardText}
          onChangeText={setClipboardText}
          style={styles.input}
          placeholder="Clipboard text"
        />
        <View style={styles.row}>
          <Pressable style={styles.button} onPress={readClipboard}>
            <Text style={styles.buttonText}>Read</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={writeClipboard}>
            <Text style={styles.buttonText}>Write</Text>
          </Pressable>
        </View>

        <Text style={styles.section}>Shell</Text>
        <View style={styles.row}>
          <Pressable style={styles.button} onPress={openExternal}>
            <Text style={styles.buttonText}>Open expo.dev</Text>
          </Pressable>
        </View>

        <Text style={styles.section}>Power events</Text>
        <Text style={styles.muted}>Latest: {powerEvents[0] ? JSON.stringify(powerEvents[0]) : '(none)'} </Text>

        <Text style={styles.section}>Log</Text>
        {logLines.length === 0 ? <Text style={styles.muted}>(empty)</Text> : null}
        {logLines.map((l, idx) => (
          <Text key={String(idx)} style={styles.monoLine}>
            {l}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  section: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  muted: {
    color: '#444',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  mono: {
    fontFamily: 'monospace',
    color: '#111827',
  },
  monoLine: {
    fontFamily: 'monospace',
    color: '#111827',
    fontSize: 12,
  },
});
