import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Heart, Dna, FileText, Calendar } from "lucide-react-native";
import { usePet } from "../src/contexts/PetContext";
import { Card } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { Button } from "../src/components/ui/Button";
import { PetSwitcher } from "../src/components/pet/PetSwitcher";
import { colors } from "../src/theme/colors";
import { spacing, radius, fontSize } from "../src/theme/spacing";

const tabs = [
  { id: "heat", label: "Heat", Icon: Calendar },
  { id: "match", label: "Match", Icon: Heart },
  { id: "coi", label: "COI", Icon: Dna },
  { id: "contract", label: "Contract", Icon: FileText },
];

const candidates = [
  { id: 1, name: "Champion Maxwell", breed: "Golden Retriever", age: 5, matchScore: 94, predictedCOI: 4.2, titles: ["CH", "GCH", "BIS"], clearances: ["OFA Hips", "OFA Elbows", "Eyes Clear"], emoji: "🐕" },
  { id: 2, name: "Riverside Sterling", breed: "Golden Retriever", age: 4, matchScore: 87, predictedCOI: 6.8, titles: ["CH", "CD"], clearances: ["OFA Hips", "Eyes Clear", "Heart Clear"], emoji: "🦮" },
  { id: 3, name: "Sunset Trail Cooper", breed: "Golden Retriever", age: 6, matchScore: 82, predictedCOI: 5.5, titles: ["CH"], clearances: ["OFA Hips", "Eyes Clear"], emoji: "🐕" },
];

export default function BreedingScreen() {
  const { activePet } = usePet();
  const router = useRouter();
  const [tab, setTab] = useState("heat");

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Breeding Suite",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
              <ArrowLeft size={22} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => <View style={{ marginRight: 8 }}><PetSwitcher /></View>,
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { fontWeight: "700" },
        }}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabRow}>
        {tabs.map(({ id, label, Icon }) => (
          <TouchableOpacity key={id} onPress={() => setTab(id)} style={[styles.tab, tab === id && styles.tabActive]}>
            <Icon size={14} color={tab === id ? "#FFF" : colors.text} />
            <Text style={[styles.tabText, tab === id && styles.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === "heat" && (
          <>
            <Card variant="elevated" style={styles.card}>
              <Badge label="Currently in Estrus" variant="warning" />
              <Text style={styles.bigNumber}>Day 11</Text>
              <Text style={styles.subtitle}>Optimal mating window: Days 10-14</Text>
              <View style={styles.phases}>
                {["Proestrus", "Estrus", "Diestrus", "Anestrus"].map((p, i) => (
                  <View key={p} style={[styles.phase, i === 1 && styles.phaseActive]}>
                    <Text style={[styles.phaseText, i === 1 && styles.phaseTextActive]}>{p}</Text>
                  </View>
                ))}
              </View>
            </Card>
            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>Cycle History</Text>
              <View style={styles.statRow}>
                <Stat label="Avg cycle" value="6.2 mo" />
                <Stat label="Last heat" value="Nov '25" />
                <Stat label="Cycles tracked" value="4" />
              </View>
            </Card>
          </>
        )}
        {tab === "match" && (
          <>
            <Text style={styles.intro}>AI-matched compatible studs for {activePet.name}</Text>
            {candidates.map((c) => (
              <Card key={c.id} variant="elevated" style={styles.card}>
                <View style={styles.candidateHeader}>
                  <Text style={styles.candidateEmoji}>{c.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.candidateName}>{c.name}</Text>
                    <Text style={styles.candidateMeta}>{c.breed} · {c.age}y</Text>
                  </View>
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreValue}>{c.matchScore}%</Text>
                    <Text style={styles.scoreLabel}>match</Text>
                  </View>
                </View>
                <View style={styles.titlesRow}>
                  {c.titles.map((t) => <Badge key={t} label={t} variant="purple" />)}
                </View>
                <Text style={styles.coiText}>Predicted COI: <Text style={{ fontWeight: "700", color: c.predictedCOI < 6 ? colors.primary : colors.warning }}>{c.predictedCOI}%</Text></Text>
                <Text style={styles.clearancesLabel}>Health Clearances:</Text>
                <View style={styles.clearances}>
                  {c.clearances.map((cl) => <Text key={cl} style={styles.clearance}>✓ {cl}</Text>)}
                </View>
                <Button title="Contact Owner" size="sm" variant="outline" style={{ marginTop: spacing.md }} />
              </Card>
            ))}
          </>
        )}
        {tab === "coi" && (
          <Card variant="elevated" style={styles.card}>
            <Text style={styles.sectionTitle}>COI Calculator</Text>
            <Text style={styles.intro}>Coefficient of Inbreeding analysis across 10 generations</Text>
            <View style={styles.coiCircle}>
              <Text style={styles.coiBig}>4.8%</Text>
              <Text style={styles.coiLabel}>Predicted COI</Text>
            </View>
            <View style={styles.coiBar}>
              <View style={[styles.coiBarFill, { width: "48%" }]} />
            </View>
            <Text style={styles.coiHint}>Below 6% is considered healthy genetic diversity</Text>
            <View style={styles.coiStats}>
              <View style={styles.coiStat}>
                <Text style={styles.coiStatValue}>10</Text>
                <Text style={styles.coiStatLabel}>Generations</Text>
              </View>
              <View style={styles.coiStat}>
                <Text style={styles.coiStatValue}>1,024</Text>
                <Text style={styles.coiStatLabel}>Ancestors</Text>
              </View>
              <View style={styles.coiStat}>
                <Text style={styles.coiStatValue}>AKC+FCI</Text>
                <Text style={styles.coiStatLabel}>Database</Text>
              </View>
            </View>
          </Card>
        )}
        {tab === "contract" && (
          <Card variant="elevated" style={styles.card}>
            <Text style={styles.sectionTitle}>Breeding Contract Generator</Text>
            <Text style={styles.intro}>AKC-compliant 6-page contract with e-signature support</Text>
            <View style={styles.contractSection}>
              <Text style={styles.contractLabel}>Stud Fee:</Text>
              <Text style={styles.contractValue}>$2,500</Text>
            </View>
            <View style={styles.contractSection}>
              <Text style={styles.contractLabel}>Guarantee:</Text>
              <Text style={styles.contractValue}>Live puppy or repeat breeding</Text>
            </View>
            <View style={styles.contractSection}>
              <Text style={styles.contractLabel}>Health Tests Required:</Text>
              <Text style={styles.contractValue}>OFA Hips, Elbows, Eyes</Text>
            </View>
            <Button title="Generate Contract ($4.90)" style={{ marginTop: spacing.lg }} />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
  tabBar: { maxHeight: 52, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  tabRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingVertical: spacing.sm },
  tab: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, backgroundColor: colors.backgroundSecondary },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: fontSize.sm, fontWeight: "600", color: colors.text },
  tabTextActive: { color: "#FFF" },
  content: { padding: spacing.lg },
  intro: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md, lineHeight: 20 },
  card: { marginBottom: spacing.md },
  bigNumber: { fontSize: fontSize.hero, fontWeight: "800", color: colors.text, marginTop: spacing.sm },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.lg },
  phases: { flexDirection: "row", gap: 4 },
  phase: { flex: 1, padding: spacing.sm, alignItems: "center", borderRadius: radius.md, backgroundColor: colors.backgroundSecondary },
  phaseActive: { backgroundColor: colors.warning + "20" },
  phaseText: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: "500" },
  phaseTextActive: { color: colors.warning, fontWeight: "700" },
  sectionTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  statRow: { flexDirection: "row", justifyContent: "space-around" },
  statBox: { alignItems: "center" },
  statValue: { fontSize: fontSize.lg, fontWeight: "800", color: colors.text },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  candidateHeader: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.md },
  candidateEmoji: { fontSize: 36 },
  candidateName: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  candidateMeta: { fontSize: fontSize.xs, color: colors.textSecondary },
  scoreBox: { alignItems: "center" },
  scoreValue: { fontSize: fontSize.xl, fontWeight: "800", color: colors.primary },
  scoreLabel: { fontSize: fontSize.xs, color: colors.textSecondary },
  titlesRow: { flexDirection: "row", gap: 4, marginBottom: spacing.sm, flexWrap: "wrap" },
  coiText: { fontSize: fontSize.sm, color: colors.text, marginBottom: spacing.sm },
  clearancesLabel: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: "600", marginBottom: 4, textTransform: "uppercase" },
  clearances: { gap: 2 },
  clearance: { fontSize: fontSize.sm, color: colors.text },
  coiCircle: { alignItems: "center", marginVertical: spacing.lg },
  coiBig: { fontSize: 56, fontWeight: "800", color: colors.primary },
  coiLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
  coiBar: { height: 8, backgroundColor: colors.borderLight, borderRadius: 4, overflow: "hidden", marginBottom: spacing.sm },
  coiBarFill: { height: "100%", backgroundColor: colors.primary, borderRadius: 4 },
  coiHint: { fontSize: fontSize.xs, color: colors.textTertiary, textAlign: "center", marginBottom: spacing.lg },
  coiStats: { flexDirection: "row", justifyContent: "space-around", paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderLight },
  coiStat: { alignItems: "center" },
  coiStatValue: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  coiStatLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  contractSection: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  contractLabel: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: "500" },
  contractValue: { fontSize: fontSize.sm, color: colors.text, fontWeight: "700", flex: 1, textAlign: "right" },
});
