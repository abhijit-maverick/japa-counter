import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { JapaMode } from '../hooks/useJapaStore';
import { COLORS, FONTS, SPACING, RADII, scale, moderateScale } from '../constants/theme';

interface Props {
  mode: JapaMode;
  onToggle: (mode: JapaMode) => void;
}

export default function JapaModeToggle({ mode, onToggle }: Props) {
  const slideAnim = useRef(new Animated.Value(mode === 'man' ? 0 : 1)).current;

  const toggle = (newMode: JapaMode) => {
    Animated.spring(slideAnim, {
      toValue: newMode === 'man' ? 0 : 1,
      useNativeDriver: true,
      tension: 180,
      friction: 10,
    }).start();
    onToggle(newMode);
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, scale(130)],
  });

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {/* Sliding pill */}
        <Animated.View style={[styles.pill, { transform: [{ translateX }] }]} />

        <TouchableOpacity style={styles.option} onPress={() => toggle('man')} activeOpacity={0.8}>
          <Text style={[styles.optionText, mode === 'man' && styles.optionTextActive]}>
            🤫  मन जप
          </Text>
          <Text style={[styles.optionSub, mode === 'man' && styles.optionSubActive]}>
            मानसिक
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => toggle('vaani')} activeOpacity={0.8}>
          <Text style={[styles.optionText, mode === 'vaani' && styles.optionTextActive]}>
            🎙️  वाणी जप
          </Text>
          <Text style={[styles.optionSub, mode === 'vaani' && styles.optionSubActive]}>
            स्वर
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  track: {
    flexDirection: 'row',
    backgroundColor: 'rgba(180,120,40,0.12)',
    borderRadius: RADII.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  pill: {
    position: 'absolute',
    top: 2,
    width: scale(128),
    bottom: 2,
    backgroundColor: COLORS.white,
    borderRadius: RADII.full,
    elevation: 2,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(200,144,58,0.3)',
  },
  option: {
    width: scale(128),
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    zIndex: 1,
  },
  optionText: {
    fontSize: moderateScale(13),
    color: COLORS.textMuted,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  optionTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  optionSub: {
    fontSize: moderateScale(9),
    color: COLORS.textHint,
    letterSpacing: 1,
    marginTop: 1,
  },
  optionSubActive: {
    color: COLORS.textMuted,
  },
});
