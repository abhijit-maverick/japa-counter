import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const scale = (size: number) => (SCREEN_WIDTH / 390) * size;
export const verticalScale = (size: number) => (SCREEN_HEIGHT / 844) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const COLORS = {
  background: '#FDF3E3',
  backgroundSecondary: '#F5E6C8',
  backgroundCard: 'rgba(255,255,255,0.85)',
  primary: '#8B3A00',
  primaryLight: '#C8903A',
  primaryDark: '#5A1E00',
  primaryGold: '#F0A830',
  primaryGoldLight: '#FAC765',
  textPrimary: '#3A1500',
  textSecondary: '#7A4A10',
  textMuted: '#A07030',
  textHint: '#C8A870',
  border: 'rgba(180,120,40,0.25)',
  borderStrong: 'rgba(180,120,40,0.5)',
  success: '#4A7A1A',
  white: '#FFFFFF',
  beadLit: '#C8903A',
  beadDark: '#3A1A00',
  beadStrokeLit: '#F0A830',
  beadStrokeDark: '#5A2A00',
};

export const FONTS = {
  sizes: {
    xs: moderateScale(10),
    sm: moderateScale(12),
    md: moderateScale(14),
    lg: moderateScale(16),
    xl: moderateScale(20),
    xxl: moderateScale(28),
    xxxl: moderateScale(42),
    huge: moderateScale(56),
  },
  letterSpacing: {
    tight: 0.5,
    normal: 1,
    wide: 2,
    wider: 3,
    widest: 4,
  },
};

export const SPACING = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(28),
  xxxl: scale(40),
};

export const RADII = {
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(24),
  full: 9999,
};

export const MALA = {
  beadCount: 108,
  cycleBeads: 27,
  diameter: Math.min(SCREEN_WIDTH * 0.72, 280),
  buttonDiameter: Math.min(SCREEN_WIDTH * 0.46, 180),
};

export { SCREEN_WIDTH, SCREEN_HEIGHT };
