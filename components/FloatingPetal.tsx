import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path, Ellipse } from 'react-native-svg';

interface Props {
  x: number;
  y: number;
  size?: number;
  color?: string;
  onDone: () => void;
}

const PETAL_COLORS = [
  '#FFB7C5', '#FF8FA3', '#FFC8A2',
  '#FFDBDB', '#FF6B8A', '#FFD700', '#FFA500',
];

export default function FloatingPetal({ x, y, size = 18, color, onDone }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;

  const petalColor = color || PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
  const swayDir = Math.random() > 0.5 ? 1 : -1;

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(500),
        Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(translateY, {
        toValue: -120, duration: 1300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: swayDir * 25, duration: 650,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: swayDir * -15, duration: 650,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotate, {
        toValue: swayDir * 3, duration: 1300, useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1, tension: 200, friction: 8, useNativeDriver: true,
      }),
    ]).start(onDone);
  }, []);

  const spin = rotate.interpolate({
    inputRange: [-3, 3],
    outputRange: ['-45deg', '45deg'],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute', left: x, top: y,
        opacity, transform: [{ translateY }, { translateX }, { rotate: spin }, { scale }],
      }}
      pointerEvents="none"
    >
      <Svg width={size} height={size * 1.4} viewBox="0 0 20 28">
        <Path
          d="M10 2 C14 2, 18 8, 18 14 C18 20, 14 26, 10 26 C6 26, 2 20, 2 14 C2 8, 6 2, 10 2 Z"
          fill={petalColor}
          opacity={0.9}
        />
        <Path
          d="M10 4 C10 4, 10 14, 10 24"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={0.8}
          fill="none"
        />
        <Ellipse cx={7} cy={10} rx={2} ry={4} fill="rgba(255,255,255,0.3)" />
      </Svg>
    </Animated.View>
  );
}
