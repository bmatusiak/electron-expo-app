import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {

  let message = 'No native module found';
  if (globalThis.ElectronNative && globalThis.ElectronNative['example-native-module'] && !globalThis.ElectronNative['example-native-module']._missing)
    message = globalThis.ElectronNative['example-native-module'].hello()
  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
