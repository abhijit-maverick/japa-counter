import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, Easing } from 'react-native';
import { COLORS, FONTS, SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants/theme';

interface Props {
  id: string;
  text: string;
  x: number;
  y: number;
  onDone: (id: string) => void;
}

export default function FloatingRamText({ id, text, x, y, onDone }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.sequence([
      // Appear + scale up
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1.1, useNativeDriver: true, tension: 200, friction: 8 }),
      ]),
      // Hold briefly
      Animated.delay(300),
      // Float up + fade out
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 600, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -80, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.85, duration: 600, useNativeDriver: true }),
      ]),
    ]).start(() => onDone(id));
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { left: x, top: y, opacity, transform: [{ translateY }, { scale }] },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
  },
  text: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.primary,
    textShadowColor: 'rgba(255,200,100,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    letterSpacing: FONTS.letterSpacing.wide,
  },
});
