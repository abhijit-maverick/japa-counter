import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet, View, Image, Easing } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { COLORS, MALA, scale } from '../constants/theme';

interface Props {
  onPress: () => void;
  shouldPulse: boolean;
}

export default function CharanButton({ onPress, shouldPulse }: Props) {
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const D = MALA.buttonDiameter;

  // Breathing glow always on
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1.06, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Ripple on tap
  const triggerRipple = () => {
    ripple1.setValue(0);
    ripple2.setValue(0);
    Animated.parallel([
      Animated.timing(ripple1, { toValue: 1, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(ripple2, { toValue: 1, duration: 900, delay: 150, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.93, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 6 }),
    ]).start();
  };

  const handlePress = () => {
    triggerRipple();
    onPress();
  };

  const rippleScale1 = ripple1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] });
  const rippleOpacity1 = ripple1.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.7, 0.5, 0] });
  const rippleScale2 = ripple2.interpolate({ inputRange: [0, 1], outputRange: [1, 2.3] });
  const rippleOpacity2 = ripple2.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.5, 0.3, 0] });

  return (
    <View style={[styles.wrapper, { width: D * 2.4, height: D * 2.4, alignItems: 'center', justifyContent: 'center' }]}>
      {/* Ripple rings */}
      <Animated.View style={[styles.ripple, {
        width: D, height: D, borderRadius: D / 2,
        transform: [{ scale: rippleScale1 }],
        opacity: rippleOpacity1,
        borderColor: COLORS.primaryGold,
      }]} />
      <Animated.View style={[styles.ripple, {
        width: D, height: D, borderRadius: D / 2,
        transform: [{ scale: rippleScale2 }],
        opacity: rippleOpacity2,
        borderColor: COLORS.primaryLight,
      }]} />

      {/* Breathing glow ring */}
      <Animated.View style={[styles.glowRing, {
        width: D + scale(16), height: D + scale(16),
        borderRadius: (D + scale(16)) / 2,
        transform: [{ scale: glowAnim }],
      }]} />

      {/* Main button */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.92}
          style={[styles.button, { width: D, height: D, borderRadius: D / 2 }]}
        >
          <Image
            source={require('../assets/images/ram_charan.png')}
            style={[styles.image, { width: D, height: D, borderRadius: D / 2 }]}
            resizeMode="cover"
          />
          {/* Subtle gold border overlay */}
          <View style={[styles.borderOverlay, { width: D, height: D, borderRadius: D / 2 }]} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  ripple: {
    position: 'absolute',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  glowRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(240,168,48,0.4)',
    backgroundColor: 'transparent',
  },
  button: {
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#C8903A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  image: { position: 'absolute' },
  borderOverlay: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'rgba(240,168,48,0.7)',
    backgroundColor: 'transparent',
  },
});
