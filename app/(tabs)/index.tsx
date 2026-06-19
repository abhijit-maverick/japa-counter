import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Alert
} from 'react-native';

export default function HomeScreen() {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState('ready');

  function handleTap() {
    try {
      setLog('tap received');
      setCount(c => c + 1);
      setLog('count updated: ' + (count + 1));
    } catch (e: any) {
      setLog('ERROR: ' + e.message);
      Alert.alert('Crash caught', e.message);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>॥ जय श्री राम ॥</Text>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.log}>Status: {log}</Text>
        <TouchableOpacity style={styles.btn} onPress={handleTap}>
          <Text style={styles.btnText}>🪷 जप करें</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDF3E3' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  title: { fontSize: 18, color: '#8B3A00', letterSpacing: 2, fontWeight: '600' },
  count: { fontSize: 80, fontWeight: '700', color: '#5A1E00' },
  log: { fontSize: 12, color: '#666', padding: 10, backgroundColor: '#eee', borderRadius: 8 },
  btn: {
    backgroundColor: '#C8903A',
    paddingHorizontal: 48, paddingVertical: 20, borderRadius: 50, elevation: 4,
  },
  btnText: { fontSize: 20, color: '#fff', fontWeight: '700' },
});
