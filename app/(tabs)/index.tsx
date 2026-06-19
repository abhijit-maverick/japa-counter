import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Alert
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useJapaStore } from '../../hooks/useJapaStore';

export default function App() {
  const store = useJapaStore();
  const [log, setLog] = useState<string[]>([]);

  function addLog(msg: string) {
    setLog(prev => [msg, ...prev].slice(0, 6));
  }

  function handleTap() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    store.increment();
    addLog('👆 Tap: ' + (store.todayCount + 1));
  }

  if (!store.loaded) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>॥ जय श्री राम ॥</Text>
        <Text style={styles.count}>{store.todayCount}</Text>
        <TouchableOpacity style={styles.btn} onPress={handleTap}>
          <Text style={styles.btnText}>🪷 जप करें</Text>
        </TouchableOpacity>
        <Text style={styles.total}>Total: {store.totalCount} | Streak: 🔥{store.streak}</Text>
        <View style={styles.logBox}>
          {log.map((l, i) => <Text key={i} style={styles.logText}>{l}</Text>)}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDF3E3' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#5A1E00', letterSpacing: 2 },
  count: { fontSize: 90, fontWeight: '700', color: '#8B3A00' },
  btn: { backgroundColor: '#C8903A', paddingHorizontal: 48, paddingVertical: 20, borderRadius: 50, elevation: 4 },
  btnText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  total: { fontSize: 13, color: '#7A4A10' },
  logBox: { width: '100%', backgroundColor: '#1a1a1a', borderRadius: 12, padding: 12 },
  logText: { color: '#00ff00', fontSize: 11, marginBottom: 2 },
});
