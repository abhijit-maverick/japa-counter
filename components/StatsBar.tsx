import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADII, scale, moderateScale } from '../constants/theme';

interface Props {
  streak: number;
  todayCount: number;
  dailyGoal: number;
  totalCount: number;
}

export default function StatsBar({ streak, todayCount, dailyGoal, totalCount }: Props) {
  const formatTotal = (n: number) => n.toLocaleString('en-IN');

  return (
    <View style={styles.container}>
      <StatItem
        icon="🔥"
        value={streak.toString()}
        label="दिन"
        sublabel="अनुक्रम"
      />
      <View style={styles.divider} />
      <StatItem
        icon="✿"
        value={todayCount.toString()}
        label="आज"
        sublabel="जप"
      />
      <View style={styles.divider} />
      <StatItem
        icon="🎯"
        value={dailyGoal.toString()}
        label="लक्ष्य"
        sublabel="प्रतिदिन"
      />
      <View style={styles.divider} />
      <StatItem
        icon="ॐ"
        value={formatTotal(totalCount)}
        label="कुल"
        sublabel="जप"
      />
    </View>
  );
}

function StatItem({ icon, value, label, sublabel }: { icon: string; value: string; label: string; sublabel: string }) {
  return (
    <View style={styles.item}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.sublabel}>{sublabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(180,120,40,0.1)',
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: scale(40),
    backgroundColor: COLORS.border,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    fontSize: moderateScale(13),
    marginBottom: 2,
  },
  value: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  label: {
    fontSize: moderateScale(9),
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginTop: 1,
    fontWeight: '600',
  },
  sublabel: {
    fontSize: moderateScale(8),
    color: COLORS.textHint,
    letterSpacing: 1,
  },
});

function moderateScale(size: number, factor = 0.5) {
  return size;
}
