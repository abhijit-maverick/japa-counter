import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useJapaStore } from '../../hooks/useJapaStore';
import { COLORS, SPACING, RADII, scale } from '../../constants/theme';
import { format, parseISO, eachDayOfInterval, subDays } from 'date-fns';

export default function StreakScreen() {
  const { history, streak, todayCount, dailyGoal } = useJapaStore();

  const today = new Date();
  const past28 = eachDayOfInterval({ start: subDays(today, 27), end: today });
  const historyMap = new Map(history.map(h => [h.date, h]));

  const todayStr = format(today, 'yyyy-MM-dd');
  historyMap.set(todayStr, {
    date: todayStr,
    count: todayCount,
    goalMet: todayCount >= dailyGoal,
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>जप अनुक्रम</Text>
          <View style={styles.streakBadge}>
            <Text style={styles.streakNum}>🔥 {streak}</Text>
            <Text style={styles.streakLabel}>दिन का अनुक्रम</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {past28.map(day => {
            const ds = format(day, 'yyyy-MM-dd');
            const rec = historyMap.get(ds);
            const isToday = ds === todayStr;
            const goalMet = rec?.goalMet ?? false;
            const hasCount = (rec?.count ?? 0) > 0;
            return (
              <View key={ds} style={[
                styles.cell,
                goalMet && styles.cellGoal,
                hasCount && !goalMet && styles.cellPartial,
                isToday && styles.cellToday,
              ]}>
                <Text style={[styles.cellDay, (goalMet || hasCount) && styles.cellDayActive]}>
                  {format(day, 'd')}
                </Text>
                {goalMet && <Text style={styles.cellCheck}>✓</Text>}
                {isToday && <View style={styles.todayDot} />}
              </View>
            );
          })}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.cellGoal]} />
            <Text style={styles.legendText}>लक्ष्य पूरा</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.cellPartial]} />
            <Text style={styles.legendText}>आंशिक जप</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.legendBox} />
            <Text style={styles.legendText}>जप नहीं</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.xl, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: scale(22), fontWeight: '700', color: COLORS.primaryDark, letterSpacing: 2 },
  streakBadge: {
    marginTop: SPACING.lg,
    backgroundColor: 'rgba(240,168,48,0.15)',
    borderRadius: RADII.lg,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(240,168,48,0.4)',
  },
  streakNum: { fontSize: scale(36), fontWeight: '700', color: COLORS.primaryDark },
  streakLabel: { fontSize: scale(12), color: COLORS.textMuted, letterSpacing: 2, marginTop: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.lg,
    gap: SPACING.sm,
    justifyContent: 'center',
  },
  cell: {
    width: scale(38), height: scale(38),
    borderRadius: RADII.sm,
    backgroundColor: 'rgba(180,120,40,0.08)',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellGoal: { backgroundColor: 'rgba(240,168,48,0.3)', borderColor: COLORS.primaryGold },
  cellPartial: { backgroundColor: 'rgba(200,144,58,0.15)', borderColor: COLORS.primaryLight },
  cellToday: { borderWidth: 2, borderColor: COLORS.primary },
  cellDay: { fontSize: scale(11), color: COLORS.textHint, fontWeight: '500' },
  cellDayActive: { color: COLORS.primaryDark },
  cellCheck: { fontSize: scale(8), color: COLORS.primary, position: 'absolute', top: 2, right: 4 },
  todayDot: {
    position: 'absolute', bottom: 3,
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
    padding: SPACING.lg,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  legendBox: {
    width: scale(14), height: scale(14),
    borderRadius: RADII.sm,
    backgroundColor: 'rgba(180,120,40,0.08)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  legendText: { fontSize: scale(10), color: COLORS.textMuted, letterSpacing: 0.5 },
});
