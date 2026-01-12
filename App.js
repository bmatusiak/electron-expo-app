import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import ExampleNativeModule, { ExampleNativeModuleView } from 'example-native-module';

export default function App() {
  const [logLines, setLogLines] = useState([]);
  const [lastChangeValue, setLastChangeValue] = useState(null);

  const [helloValue, setHelloValue] = useState(null);

  const [mulA, setMulA] = useState('2');
  const [mulB, setMulB] = useState('5');
  const [mulResult, setMulResult] = useState(null);

  const [setValueInput, setSetValueInput] = useState('abc');

  const [viewUrl, setViewUrl] = useState('https://www.google.com');
  const [viewLoadedUrl, setViewLoadedUrl] = useState(null);

  const log = useCallback((line) => {
    setLogLines((prev) => [String(line), ...prev].slice(0, 30));
  }, []);

  const pi = useMemo(() => {
    try {
      return ExampleNativeModule.PI;
    } catch (e) {
      return null;
    }
  }, []);

  const hasElectronNativeImpl = useMemo(() => {
    try {
      const root = (typeof globalThis !== 'undefined' && globalThis) ? globalThis : null;
      const impl = root && root.ElectronNative && root.ElectronNative['example-native-module'];
      return Boolean(impl && !impl._missing);
    } catch (e) {
      return false;
    }
  }, []);

  useEffect(() => {
    const addListener = ExampleNativeModule && ExampleNativeModule.addListener;
    if (typeof addListener !== 'function') {
      log('ExampleNativeModule.addListener not available');
      return;
    }

    const sub = addListener.call(ExampleNativeModule, 'onChange', (event) => {
      const value = event && typeof event.value !== 'undefined' ? String(event.value) : JSON.stringify(event);
      setLastChangeValue(value);
      log('onChange: ' + value);
    });

    return () => {
      try {
        if (sub && typeof sub.remove === 'function') sub.remove();
      } catch (e) {
        // ignore
      }
    };
  }, [log]);

  function runHello() {
    try {
      const v = ExampleNativeModule.hello();
      setHelloValue(String(v));
      log('hello() ok');
    } catch (e) {
      log('hello() failed: ' + (e && e.message));
    }
  }

  function runMultiply() {
    try {
      const a = Number(mulA);
      const b = Number(mulB);
      const r = ExampleNativeModule.multiply(a, b);
      setMulResult(String(r));
      log('multiply() ok');
    } catch (e) {
      log('multiply() failed: ' + (e && e.message));
    }
  }

  async function runSetValueAsync() {
    try {
      await ExampleNativeModule.setValueAsync(String(setValueInput));
      log('setValueAsync() resolved');
    } catch (e) {
      log('setValueAsync() failed: ' + (e && e.message));
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>example-native-module demo</Text>

        <Text style={styles.muted}>Platform: {Platform.OS}</Text>
        <Text style={styles.muted}>Electron native addon detected (web/electron only): {String(hasElectronNativeImpl)}</Text>

        <Text style={styles.section}>Constants</Text>
        <Text style={styles.mono}>PI: {pi == null ? '(unavailable)' : String(pi)}</Text>

        <Text style={styles.section}>hello()</Text>
        <View style={styles.row}>
          <Pressable style={styles.button} onPress={runHello}>
            <Text style={styles.buttonText}>Call hello()</Text>
          </Pressable>
        </View>
        <Text style={styles.mono}>{helloValue == null ? '(not called yet)' : helloValue}</Text>

        <Text style={styles.section}>multiply(a, b)</Text>
        <View style={styles.row}>
          <TextInput value={mulA} onChangeText={setMulA} style={styles.inputSmall} keyboardType="numeric" />
          <TextInput value={mulB} onChangeText={setMulB} style={styles.inputSmall} keyboardType="numeric" />
          <Pressable style={styles.button} onPress={runMultiply}>
            <Text style={styles.buttonText}>Multiply</Text>
          </Pressable>
        </View>
        <Text style={styles.mono}>Result: {mulResult == null ? '(not called yet)' : mulResult}</Text>

        <Text style={styles.section}>setValueAsync(value) → emits onChange</Text>
        <TextInput
          value={setValueInput}
          onChangeText={setSetValueInput}
          style={styles.input}
          placeholder="Value to send"
        />
        <View style={styles.row}>
          <Pressable style={styles.button} onPress={runSetValueAsync}>
            <Text style={styles.buttonText}>Call setValueAsync()</Text>
          </Pressable>
        </View>
        <Text style={styles.muted}>Last onChange value: {lastChangeValue == null ? '(none)' : lastChangeValue}</Text>

        <Text style={styles.section}>View</Text>
        <Text style={styles.muted}>
          Note: some sites block iframes via their own CSP/X-Frame-Options.
        </Text>
        <TextInput value={viewUrl} onChangeText={setViewUrl} style={styles.input} placeholder="URL (must allow framing on web/electron)" />
        <Text style={styles.muted}>Last view onLoad: {viewLoadedUrl == null ? '(none)' : viewLoadedUrl}</Text>
        <View style={styles.viewBox}>
          <ExampleNativeModuleView
            url={viewUrl}
            onLoad={(e) => {
              const url = e && e.nativeEvent && e.nativeEvent.url ? String(e.nativeEvent.url) : '(unknown)';
              setViewLoadedUrl(url);
              log('view onLoad: ' + url);
            }}
            style={styles.nativeView}
          />
        </View>

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
    alignItems: 'center',
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
  inputSmall: {
    minWidth: 72,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  viewBox: {
    height: 220,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    overflow: 'hidden',
  },
  nativeView: {
    flex: 1,
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
