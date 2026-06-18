import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useJapaStore } from '../../hooks/useJapaStore';
import { COLORS, SPACING, RADII, scale } from '../../constants/theme';
import { format, parseISO } from 'date-fns';

export default function HistoryScreen() {
  const { history, dailyGoal } = useJapaStore();
  const maxCount = Math.max(...history.map(h => h.count), dailyGoal);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>जप इतिहास</Text>
        <Text style={styles.subtitle}>पिछले ९० दिन</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {history.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📿</Text>
            <Text style={styles.emptyText}>अभी तक कोई इतिहास नहीं</Text>
            <Text style={styles.emptySubText}>जप करना शुरू करें</Text>
          </View>
        ) : (
          history.map((day, i) => {
            const pct = Math.min(1, day.count / maxCount);
            const dateStr = format(parseISO(day.date), 'd MMM');
            return (
              <View key={day.date} style={styles.row}>
                <Text style={styles.dateText}>{dateStr}</Text>
                <View style={styles.barTrack}>
                  <View style={[
                    styles.barFill,
                    { width: `${Math.round(pct * 100)}%` },
                    day.goalMet && styles.barFillGoal,
                  ]} />
                </View>
                <Text style={[styles.countText, day.goalMet && styles.countGoal]}>
                  {day.count}
                  {day.goalMet ? ' ✓' : ''}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  title: { fontSize: scale(22), fontWeight: '700', color: COLORS.primaryDark, letterSpacing: 2 },
  subtitle: { fontSize: scale(11), color: COLORS.textMuted, letterSpacing: 1.5, marginTop: 4 },
  content: { padding: SPACING.lg },
  empty: { alignItems: 'center', paddingTop: scale(80) },
  emptyIcon: { fontSize: scale(48), marginBottom: SPACING.lg },
  emptyText: { fontSize: scale(16), color: COLORS.textSecondary, fontWeight: '600' },
  emptySubText: { fontSize: scale(13), color: COLORS.textMuted, marginTop: SPACING.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  dateText: { width: scale(48), fontSize: scale(11), color: COLORS.textMuted, letterSpacing: 0.5 },
  barTrack: {
    flex: 1,
    height: scale(20),
    backgroundColor: 'rgba(180,120,40,0.1)',
    borderRadius: RADII.sm,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADII.sm,
  },
  barFillGoal: { backgroundColor: COLORS.primaryGold },
  countText: { width: scale(48), fontSize: scale(11), color: COLORS.textSecondary, textAlign: 'right', fontWeight: '600' },
  countGoal: { color: COLORS.primary },
});
