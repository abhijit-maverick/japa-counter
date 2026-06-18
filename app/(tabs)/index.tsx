import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ImageBackground, TouchableOpacity, Dimensions
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useJapaStore } from '../../hooks/useJapaStore';
import { useAudio } from '../../hooks/useAudio';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { getRandomRamText } from '../../constants/ramNames';
import { COLORS, SPACING, scale, SCREEN_WIDTH, SCREEN_HEIGHT, MALA } from '../../constants/theme';
import RudrakshMala from '../../components/RudrakshMala';
import CharanButton from '../../components/CharanButton';
import FloatingRamText from '../../components/FloatingRamText';
import StatsBar from '../../components/StatsBar';
import ProgressBar from '../../components/ProgressBar';
import JapaModeToggle from '../../components/JapaModeToggle';

interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
}

let textIdCounter = 0;

export default function HomeScreen() {
  const store = useJapaStore();
  const { playChant, playBgMusic, stopBgMusic } = useAudio();
  const [spinTrigger, setSpinTrigger] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [musicPlaying, setMusicPlaying] = useState(false);

  // Voice recognition — only active in vaani mode
  useVoiceRecognition({
    enabled: store.mode === 'vaani',
    onDetected: handleChant,
  });

  function handleChant() {
    store.increment();
    playChant();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSpinTrigger(true);
    spawnText();
  }

  function spawnText() {
    const margin = scale(60);
    const x = margin + Math.random() * (SCREEN_WIDTH - margin * 2);
    const y = scale(180) + Math.random() * (SCREEN_HEIGHT * 0.35);
    const id = `rt-${++textIdCounter}`;
    setFloatingTexts(prev => [...prev, { id, text: getRandomRamText(), x, y }]);
  }

  const removeText = useCallback((id: string) => {
    setFloatingTexts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleMusic = async () => {
    if (musicPlaying) {
      await stopBgMusic();
    } else {
      await playBgMusic();
    }
    setMusicPlaying(!musicPlaying);
  };

  if (!store.loaded) return null;

  return (
    <ImageBackground
      source={require('../../assets/images/temple_bg.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Warm overlay */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBtn}>
            <Text style={styles.topBtnText}>👑</Text>
          </TouchableOpacity>
          <Text style={styles.tagline}>|| श्रीराम जय राम जय जय राम ||</Text>
          <TouchableOpacity style={styles.topBtn} onPress={toggleMusic}>
            <Text style={styles.topBtnText}>{musicPlaying ? '🔔' : '🔕'}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <StatsBar
          streak={store.streak}
          todayCount={store.todayCount}
          dailyGoal={store.dailyGoal}
          totalCount={store.totalCount}
        />

        {/* Ram Naam Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>राम नाम जप</Text>
        </View>

        {/* Mala + Charan centre */}
        <View style={styles.centreArea}>
          <View style={styles.malaWrap}>
            <RudrakshMala
              count={store.todayCount}
              shouldSpin={spinTrigger}
              onSpinComplete={() => setSpinTrigger(false)}
            />
            <View style={[styles.charanOverlay, {
              width: MALA.buttonDiameter * 1.2,
              height: MALA.buttonDiameter * 1.2,
            }]}>
              <CharanButton onPress={handleChant} shouldPulse={false} />
            </View>
          </View>
        </View>

        {/* Mode toggle */}
        <JapaModeToggle mode={store.mode} onToggle={store.setMode} />

        {/* Vaani mode indicator */}
        {store.mode === 'vaani' && (
          <View style={styles.listeningRow}>
            <View style={styles.listeningDot} />
            <Text style={styles.listeningText}>श्रवण हो रहा है... "राम" बोलें</Text>
            <View style={styles.listeningDot} />
          </View>
        )}

        {/* Progress */}
        <ProgressBar current={store.todayCount} goal={store.dailyGoal} />

        {/* Diya decoration */}
        <View style={styles.diyaRow}>
          <Text style={styles.diyaEmoji}>🪷</Text>
          <Text style={styles.diyaEmoji}>🪔</Text>
          <Text style={styles.diyaEmoji}>🪷</Text>
        </View>
      </SafeAreaView>

      {/* Floating texts */}
      {floatingTexts.map(ft => (
        <FloatingRamText
          key={ft.id}
          id={ft.id}
          text={ft.text}
          x={ft.x}
          y={ft.y}
          onDone={removeText}
        />
      ))}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: COLORS.background },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(253,243,227,0.55)',
  },
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  topBtn: {
    width: scale(36), height: scale(36),
    borderRadius: scale(18),
    backgroundColor: 'rgba(180,120,40,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(180,120,40,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBtnText: { fontSize: scale(16) },
  tagline: {
    fontSize: scale(11),
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  banner: {
    marginHorizontal: SPACING.xl,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(180,120,40,0.3)',
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  bannerText: {
    fontSize: scale(22),
    color: COLORS.primaryDark,
    letterSpacing: 4,
    fontWeight: '700',
  },
  centreArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  malaWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: MALA.diameter,
    height: MALA.diameter,
  },
  charanOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listeningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    marginBottom: SPACING.xs,
  },
  listeningDot: {
    width: scale(6), height: scale(6),
    borderRadius: scale(3),
    backgroundColor: COLORS.primaryLight,
    opacity: 0.7,
  },
  listeningText: {
    fontSize: scale(10),
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
  diyaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  diyaEmoji: { fontSize: scale(18) },
});
