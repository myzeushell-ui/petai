import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Heart, Thermometer, Activity, MapPin, Wifi, Battery, Mic, Sparkles } from "lucide-react-native";
import { usePet } from "../src/contexts/PetContext";
import { Card } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { colors } from "../src/theme/colors";
import { spacing, radius, fontSize } from "../src/theme/spacing";

const emotions = [
  { name: "Joy", value: 72, color: "#22c55e" },
  { name: "Stress", value: 14, color: "#F59E0B" },
  { name: "Anxiety", value: 8, color: "#A855F7" },
  { name: "Pain", value: 0, color: "#EF4444" },
  { name: "Alertness", value: 6, color: "#3B82F6" },
];

export default function CollarScreen() {
  const { activePet } = usePet();
  const router = useRouter();
  const [heartRate, setHeartRate] = useState(92);
  const [waveform, setWaveform] = useState<number[]>(Array.from({ length: 40 }, () => Math.random() * 0.8 + 0.2));

  useEffect(() => {
    const tick = setInterval(() => {
      setHeartRate(Math.round(88 + Math.random() * 10));
      setWaveform(Array.from({ length: 40 }, () => Math.random() * 0.9 + 0.1));
    }, 800);
    return () => clearInterval(tick);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Smart Collar",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
              <ArrowLeft size={22} color={colors.text} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { fontWeight: "700" },
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.deviceRow}>
          <Badge label="● Connected" variant="success" />
          <View style={styles.deviceMeta}>
            <Wifi size={12} color={colors.primary} />
            <Text style={styles.deviceText}>Strong</Text>
            <Battery size={12} color={colors.primary} />
            <Text style={styles.deviceText}>84%</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <Card variant="elevated" style={styles.statCard}>
            <Heart size={20} color={colors.danger} />
            <Text style={styles.statValue}>{heartRate}</Text>
            <Text style={styles.statUnit}>bpm</Text>
            <Text style={styles.statLabel}>Heart Rate</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Thermometer size={20} color={colors.warning} />
            <Text style={styles.statValue}>38.6</Text>
            <Text style={styles.statUnit}>°C</Text>
            <Text style={styles.statLabel}>Temperature</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Activity size={20} color={colors.primary} />
            <Text style={styles.statValue}>6.4</Text>
            <Text style={styles.statUnit}>km</Text>
            <Text style={styles.statLabel}>Activity</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <MapPin size={20} color={colors.info} />
            <Text style={[styles.statValue, { fontSize: fontSize.md }]}>Home</Text>
            <Text style={styles.statUnit}>safe zone</Text>
            <Text style={styles.statLabel}>Location</Text>
          </Card>
        </View>

        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Mic size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Voice AI · Bark Analysis</Text>
            <Badge label="Live" variant="success" />
          </View>
          <View style={styles.waveform}>
            {waveform.map((h, i) => (
              <View key={i} style={[styles.waveBar, { height: `${h * 100}%`, backgroundColor: colors.primary }]} />
            ))}
          </View>
          <Text style={styles.barkText}>Detected: <Text style={{ fontWeight: "700" }}>Happy / Excited bark</Text></Text>
        </Card>

        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Emotion Dashboard</Text>
          {emotions.map((e) => (
            <View key={e.name} style={styles.emotionRow}>
              <Text style={styles.emotionName}>{e.name}</Text>
              <View style={styles.emotionBar}>
                <View style={[styles.emotionFill, { width: `${e.value}%`, backgroundColor: e.color }]} />
              </View>
              <Text style={styles.emotionValue}>{e.value}%</Text>
            </View>
          ))}
        </Card>

        <Card style={[styles.section, { backgroundColor: colors.primary + "08", borderColor: colors.primary + "30" }]}>
          <View style={styles.sectionHeader}>
            <Sparkles size={16} color={colors.primary} />
            <Text style={styles.sectionTitle}>AI Behavioral Insight</Text>
          </View>
          <Text style={styles.insightText}>
            {activePet.name} is having a great day. Activity is up 12% from yesterday and emotional state is predominantly joyful with very low stress markers. No abnormal behaviors detected.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
  content: { padding: spacing.lg },
  deviceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg },
  deviceMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  deviceText: { fontSize: fontSize.xs, color: colors.text, fontWeight: "600", marginRight: spacing.sm },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  statCard: { width: "47%", padding: spacing.md, alignItems: "flex-start" },
  statValue: { fontSize: fontSize.xxxl, fontWeight: "800", color: colors.text, marginTop: spacing.sm },
  statUnit: { fontSize: fontSize.xs, color: colors.textSecondary },
  statLabel: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 4, fontWeight: "600", textTransform: "uppercase" },
  section: { marginBottom: spacing.md },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 },
  waveform: { flexDirection: "row", alignItems: "flex-end", gap: 2, height: 80, marginBottom: spacing.sm },
  waveBar: { flex: 1, borderRadius: 2, minHeight: 4 },
  barkText: { fontSize: fontSize.sm, color: colors.text },
  emotionRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  emotionName: { fontSize: fontSize.sm, color: colors.text, width: 70 },
  emotionBar: { flex: 1, height: 8, backgroundColor: colors.borderLight, borderRadius: 4, overflow: "hidden" },
  emotionFill: { height: "100%", borderRadius: 4 },
  emotionValue: { fontSize: fontSize.xs, color: colors.text, fontWeight: "700", width: 36, textAlign: "right" },
  insightText: { fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },
});
