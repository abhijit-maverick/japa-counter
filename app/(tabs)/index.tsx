import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

const RAM_TRIGGERS = [
  'ram', 'raam', 'rama', 'shri ram', 'jai ram',
  'jai shri ram', 'siyaram', 'hare ram', 'raghupati',
  'राम', 'जय राम', 'श्री राम', 'सियाराम',
];

function isRam(text: string) {
  const lower = text.toLowerCase().trim();
  return RAM_TRIGGERS.some(t => lower.includes(t));
}

export default function App() {
  const [count, setCount] = useState(0);
  const [listening, setListening] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const cooldown = useRef(false);
  const isListening = useRef(false);

  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results?.[0]?.transcript || '';
    if (!transcript) return;
    setLastHeard(transcript);
    addLog('👂 ' + transcript);
    if (!cooldown.current && isRam(transcript)) {
      cooldown.current = true;
      setCount(c => c + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      addLog('✅ राम counted!');
      setTimeout(() => { cooldown.current = false; }, 800);
    }
  });

  useSpeechRecognitionEvent('end', () => {
    if (isListening.current) setTimeout(() => startListening(false), 300);
  });

  useSpeechRecognitionEvent('error', (e) => {
    addLog('⚠️ ' + e.error);
    if (isListening.current) setTimeout(() => startListening(false), 1000);
  });

  function addLog(msg: string) {
    setLog(prev => [msg, ...prev].slice(0, 6));
  }

  async function startListening(requestPerm = true) {
    try {
      if (requestPerm) {
        const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!perm.granted) { addLog('❌ No permission'); return; }
      }
      ExpoSpeechRecognitionModule.start({
        lang: 'hi-IN',
        interimResults: true,
        continuous: true,
        requiresOnDeviceRecognition: false,
        addsPunctuation: false,
        contextualStrings: ['राम', 'ram', 'raam', 'jai ram', 'shri ram'],
      });
      isListening.current = true;
      setListening(true);
      addLog('🎙️ Started');
    } catch (e: any) {
      addLog('❌ ' + e.message);
    }
  }

  function stopListening() {
    isListening.current = false;
    setListening(false);
    try { ExpoSpeechRecognitionModule.stop(); } catch (e) {}
    addLog('⏹️ Stopped');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>॥ जय श्री राम ॥</Text>
        <Text style={styles.subtitle}>वाणी जप टेस्ट</Text>
        <Text style={styles.count}>{count}</Text>
        {lastHeard ? <Text style={styles.heard}>"{lastHeard}"</Text> : null}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: listening ? '#e74c3c' : '#27ae60' }]}
            onPress={listening ? stopListening : () => startListening(true)}
          >
            <Text style={styles.btnText}>{listening ? '⏹ Stop' : '🎙️ Start'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => { setCount(0); setLog([]); setLastHeard(''); }}>
          <Text style={styles.reset}>Reset</Text>
        </TouchableOpacity>
        <View style={styles.logBox}>
          <Text style={styles.logTitle}>Live Log:</Text>
          {log.map((l, i) => <Text key={i} style={styles.logText}>{l}</Text>)}
          {log.length === 0 && <Text style={styles.logText}>Waiting...</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDF3E3' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 10 },
  title: { fontSize: 20, fontWeight: '700', color: '#5A1E00', letterSpacing: 2 },
  subtitle: { fontSize: 13, color: '#A07030', letterSpacing: 1 },
  count: { fontSize: 90, fontWeight: '700', color: '#8B3A00', lineHeight: 100 },
  heard: { fontSize: 13, color: '#7A4A10', fontStyle: 'italic', textAlign: 'center' },
  btnRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  btn: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 40, elevation: 4 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  reset: { color: '#A07030', fontSize: 12, marginTop: 4 },
  logBox: { width: '100%', backgroundColor: '#1a1a1a', borderRadius: 12, padding: 12, marginTop: 8 },
  logTitle: { color: '#888', fontSize: 10, marginBottom: 4, letterSpacing: 1 },
  logText: { color: '#00ff00', fontSize: 11, marginBottom: 2 },
});
