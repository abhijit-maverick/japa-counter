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
  'jai shri ram', 'jai shree ram', 'shri ram', 'shree ram',
  'jai ram', 'jai raam', 'hare ram', 'hey ram',
  'siyaram', 'sita ram', 'sitaram', 'raghupati',
  'ram', 'raam', 'rama',
  'जय श्री राम', 'श्री राम', 'जय राम', 'सियाराम', 'सीताराम',
  'राम',
];

const SORTED_TRIGGERS = [...RAM_TRIGGERS].sort((a, b) => b.length - a.length);

function countRamOccurrences(transcript: string): number {
  let text = ' ' + transcript.toLowerCase().trim() + ' ';
  let count = 0;
  for (const trigger of SORTED_TRIGGERS) {
    const t = ' ' + trigger + ' ';
    let idx = text.indexOf(t);
    while (idx !== -1) {
      count++;
      text = text.slice(0, idx) + ' '.repeat(t.length) + text.slice(idx + t.length);
      idx = text.indexOf(t);
    }
  }
  return count;
}

export default function App() {
  const [count, setCount] = useState(0);
  const [listening, setListening] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const isListening = useRef(false);
  const maxSeenInPhrase = useRef(0);
  const sessionTotal = useRef(0);

  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results?.[0]?.transcript || '';
    const isFinal = (event as any).isFinal ?? false;
    if (!transcript) return;

    setLastHeard(transcript);
    const total = countRamOccurrences(transcript);

    if (total > maxSeenInPhrase.current) {
      const newOnes = total - maxSeenInPhrase.current;
      maxSeenInPhrase.current = total;
      sessionTotal.current += newOnes;
      setCount(c => c + newOnes);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      addLog(`✅ +${newOnes} (max: ${total}) — "${transcript}"`);
    } else if (total < maxSeenInPhrase.current) {
      // Engine revised downward — ignore, just log it
      addLog(`↩ revised down to ${total} — ignored`);
    } else {
      addLog(`… "${transcript}"`);
    }

    if (isFinal) {
      // Phrase ended — reset max for next phrase
      addLog(`🔚 phrase end (counted ${maxSeenInPhrase.current})`);
      maxSeenInPhrase.current = 0;
    }
  });

  useSpeechRecognitionEvent('end', () => {
    maxSeenInPhrase.current = 0;
    if (isListening.current) setTimeout(() => startListening(false), 50);
  });

  useSpeechRecognitionEvent('error', (e) => {
    addLog('⚠️ ' + e.error);
    maxSeenInPhrase.current = 0;
    const isPause = e.error === 'no-speech' || e.error === 'speech-timeout';
    if (isListening.current) setTimeout(() => startListening(false), isPause ? 50 : 1000);
  });

  function addLog(msg: string) {
    setLog(prev => [msg, ...prev].slice(0, 10));
  }

  async function startListening(requestPerm = true) {
    try {
      if (requestPerm) {
        const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!perm.granted) { addLog('❌ No permission'); return; }
      }
      maxSeenInPhrase.current = 0;
      sessionTotal.current = 0;
      ExpoSpeechRecognitionModule.start({
        lang: 'hi-IN',
        interimResults: true,
        continuous: true,
        requiresOnDeviceRecognition: false,
        addsPunctuation: false,
        contextualStrings: ['राम', 'ram', 'raam', 'jai ram', 'shri ram', 'jai shri ram'],
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
    maxSeenInPhrase.current = 0;
    try { ExpoSpeechRecognitionModule.stop(); } catch (e) {}
    addLog('⏹️ Stopped');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>॥ जय श्री राम ॥</Text>
        <Text style={styles.subtitle}>वाणी जप टेस्ट v5 — max tracking</Text>
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
        <TouchableOpacity onPress={() => {
          setCount(0); setLog([]); setLastHeard('');
          maxSeenInPhrase.current = 0; sessionTotal.current = 0;
        }}>
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