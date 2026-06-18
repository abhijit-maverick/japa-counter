import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useJapaStore } from '../../hooks/useJapaStore';
import { COLORS, SPACING, RADII, scale } from '../../constants/theme';

const PRESET_GOALS = [11, 21, 54, 108, 216, 1008];

export default function SettingsScreen() {
  const { dailyGoal, setDailyGoal } = useJapaStore();
  const [customGoal, setCustomGoal] = useState('');

  const applyCustomGoal = () => {
    const n = parseInt(customGoal);
    if (!isNaN(n) && n > 0) {
      setDailyGoal(n);
      setCustomGoal('');
      Alert.alert('', `दैनिक लक्ष्य ${n} निर्धारित किया गया ✓`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>सेटिंग</Text>
          <Text style={styles.subtitle}>ॐ तत् सत्</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>दैनिक लक्ष्य</Text>
          <Text style={styles.sectionSub}>वर्तमान लक्ष्य: {dailyGoal} जप</Text>
          <View style={styles.presets}>
            {PRESET_GOALS.map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.presetBtn, dailyGoal === g && styles.presetBtnActive]}
                onPress={() => setDailyGoal(g)}
              >
                <Text style={[styles.presetText, dailyGoal === g && styles.presetTextActive]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.customRow}>
            <TextInput
              style={styles.input}
              placeholder="अन्य संख्या"
              placeholderTextColor={COLORS.textHint}
              keyboardType="number-pad"
              value={customGoal}
              onChangeText={setCustomGoal}
            />
            <TouchableOpacity style={styles.applyBtn} onPress={applyCustomGoal}>
              <Text style={styles.applyText}>लागू करें</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>वाणी जप के बारे में</Text>
          <Text style={styles.infoText}>
            वाणी जप मोड में, ऐप आपकी आवाज़ सुनता है।{'\n\n'}
            • धीरे बोलें या ज़ोर से — दोनों काम करेंगे{'\n'}
            • शोर में भी पहचान होगी{'\n'}
            • राम, जय राम, श्री राम — सभी स्वीकार्य हैं{'\n'}
            • किसी भी बोली में बोलें{'\n\n'}
            मन जप मोड में माइक बंद रहता है।
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>संस्करण</Text>
          <Text style={styles.infoText}>जय श्री राम — v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.xl, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: scale(22), fontWeight: '700', color: COLORS.primaryDark, letterSpacing: 2 },
  subtitle: { fontSize: scale(12), color: COLORS.textMuted, letterSpacing: 3, marginTop: 4 },
  section: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: { fontSize: scale(15), fontWeight: '700', color: COLORS.primaryDark, letterSpacing: 1, marginBottom: SPACING.xs },
  sectionSub: { fontSize: scale(12), color: COLORS.textMuted, marginBottom: SPACING.md, letterSpacing: 0.5 },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  presetBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADII.full,
    backgroundColor: 'rgba(180,120,40,0.1)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  presetBtnActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primaryLight },
  presetText: { fontSize: scale(14), color: COLORS.textSecondary, fontWeight: '600' },
  presetTextActive: { color: COLORS.white },
  customRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: scale(14),
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  applyBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADII.md,
    justifyContent: 'center',
  },
  applyText: { color: COLORS.white, fontWeight: '700', fontSize: scale(13), letterSpacing: 0.5 },
  infoText: { fontSize: scale(13), color: COLORS.textSecondary, lineHeight: scale(22), letterSpacing: 0.3 },
});
