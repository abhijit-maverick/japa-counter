import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Alert
} from 'react-native';
import { useJapaStore } from '../../hooks/useJapaStore';

export default function HomeScreen() {
  const store = useJapaStore();
  const [count, setCount] = useState(0);

  function handleTap() {
    try {
      setCount(c => c + 1);
      store.increment();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>॥ जय श्री राम ॥</Text>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.sub}>राम नाम जप</Text>
        <TouchableOpacity style={styles.btn} onPress={handleTap}>
          <Text style={styles.btnText}>🪷 जप करें</Text>
        </TouchableOpacity>
        <Text style={styles.total}>कुल: {store.totalCount}</Text>
        <Text style={styles.streak}>🔥 {store.streak} दिन</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDF3E3' },
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20,
  },
  title: { fontSize: 18, color: '#8B3A00', letterSpacing: 2, fontWeight: '600' },
  count: { fontSize: 80, fontWeight: '700', color: '#5A1E00' },
  sub: { fontSize: 16, color: '#A07030', letterSpacing: 3 },
  btn: {
    backgroundColor: '#C8903A',
    paddingHorizontal: 48,
    paddingVertical: 20,
    borderRadius: 50,
    elevation: 4,
  },
  btnText: { fontSize: 20, color: '#fff', fontWeight: '700' },
  total: { fontSize: 14, color: '#7A4A10' },
  streak: { fontSize: 14, color: '#7A4A10' },
});
