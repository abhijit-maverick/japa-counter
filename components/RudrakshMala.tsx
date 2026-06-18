import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, Image as SvgImage, G } from 'react-native-svg';
import { COLORS, MALA } from '../constants/theme';

interface Props {
  count: number;
  shouldSpin: boolean;
  onSpinComplete: () => void;
}

const BEAD_COUNT = MALA.cycleBeads;
const R = MALA.diameter / 2;
const CX = R;
const CY = R;
const BEAD_RADIUS = R * 0.065;
const MERU_RADIUS = R * 0.09; // larger guru bead

export default function RudrakshMala({ count, shouldSpin, onSpinComplete }: Props) {
  const rotAnim = useRef(new Animated.Value(0)).current;
  const currentRot = useRef(0);

  useEffect(() => {
    if (shouldSpin) {
      const stepDeg = 360 / BEAD_COUNT;
      currentRot.current += stepDeg;
      Animated.timing(rotAnim, {
        toValue: currentRot.current,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => onSpinComplete());
    }
  }, [shouldSpin]);

  const rotate = rotAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const litBeads = count % BEAD_COUNT;
  const size = MALA.diameter;

  return (
    <Animated.View style={{ width: size, height: size, transform: [{ rotate }] }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {/* Lit bead - warm gold rudraksh */}
          <RadialGradient id="beadLit" cx="35%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#D4A84B" />
            <Stop offset="40%" stopColor="#9B6B1A" />
            <Stop offset="100%" stopColor="#4A2800" />
          </RadialGradient>
          {/* Unlit bead - dark rudraksh */}
          <RadialGradient id="beadDark" cx="35%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#5A3010" />
            <Stop offset="50%" stopColor="#2E1505" />
            <Stop offset="100%" stopColor="#150800" />
          </RadialGradient>
          {/* Guru/Meru bead */}
          <RadialGradient id="beadMeru" cx="35%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#F0C060" />
            <Stop offset="40%" stopColor="#C8903A" />
            <Stop offset="100%" stopColor="#6B3A00" />
          </RadialGradient>
        </Defs>

        {/* Thread circle */}
        <Circle
          cx={CX} cy={CY} r={R * 0.88}
          fill="none"
          stroke="rgba(139,94,26,0.3)"
          strokeWidth={1.5}
        />

        {/* Beads */}
        {Array.from({ length: BEAD_COUNT }, (_, i) => {
          const angle = (i / BEAD_COUNT) * 2 * Math.PI - Math.PI / 2;
          const bx = CX + R * 0.88 * Math.cos(angle);
          const by = CY + R * 0.88 * Math.sin(angle);
          const isLit = i < litBeads;
          const isMeru = i === 0;
          const br = isMeru ? MERU_RADIUS : BEAD_RADIUS;
          const gradId = isMeru ? 'beadMeru' : isLit ? 'beadLit' : 'beadDark';

          return (
            <G key={i}>
              {/* Bead shadow */}
              <Circle
                cx={bx + br * 0.2}
                cy={by + br * 0.3}
                r={br}
                fill="rgba(0,0,0,0.3)"
              />
              {/* Main bead */}
              <Circle
                cx={bx} cy={by} r={br}
                fill={`url(#${gradId})`}
                stroke={isLit ? '#F0A830' : '#3A1500'}
                strokeWidth={isMeru ? 1 : 0.5}
              />
              {/* Highlight */}
              <Circle
                cx={bx - br * 0.28}
                cy={by - br * 0.28}
                r={br * 0.28}
                fill="rgba(255,255,255,0.2)"
              />
              {/* Rudraksh lines on lit beads */}
              {isLit && !isMeru && (
                <>
                  <Circle cx={bx} cy={by} r={br * 0.5} fill="none"
                    stroke="rgba(0,0,0,0.25)" strokeWidth={0.4} />
                  <Circle cx={bx} cy={by} r={br * 0.2}
                    fill="rgba(0,0,0,0.3)" />
                </>
              )}
            </G>
          );
        })}
      </Svg>
    </Animated.View>
  );
}
