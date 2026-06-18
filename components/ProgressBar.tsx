import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADII, scale, moderateScale } from '../constants/theme';

interface Props {
  current: number;
  goal: number;
}

export default function ProgressBar({ current, goal }: Props) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const pct = Math.min(1, current / goal);

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: pct,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const label = goal === 108
    ? `${current} / १०८`
    : `${current} / ${goal}`;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.pct}>{Math.round(pct * 100)}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, {
            width: widthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            })
          }]}
        />
        {/* Dot marker */}
        <Animated.View style={[styles.dot, {
          left: widthAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          })
        }]} />
      </View>
      <Text style={styles.subLabel}>आज का लक्ष्य</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: scale(12),
    color: COLORS.textSecondary,
    letterSpacing: 1,
    fontWeight: '600',
  },
  pct: {
    fontSize: scale(12),
    color: COLORS.primaryLight,
    fontWeight: '700',
  },
  track: {
    height: scale(6),
    backgroundColor: 'rgba(180,120,40,0.18)',
    borderRadius: RADII.full,
    overflow: 'visible',
    position: 'relative',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADII.full,
  },
  dot: {
    position: 'absolute',
    top: scale(-3),
    width: scale(12),
    height: scale(12),
    borderRadius: RADII.full,
    backgroundColor: COLORS.primaryGold,
    borderWidth: 2,
    borderColor: COLORS.white,
    marginLeft: scale(-6),
    elevation: 2,
  },
  subLabel: {
    fontSize: scale(9),
    color: COLORS.textHint,
    letterSpacing: 1.5,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});
