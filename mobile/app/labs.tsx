import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Upload, Sparkles } from "lucide-react-native";
import { labResults } from "../src/data/labResults";
import { LabPanel } from "../src/types";
import { usePet } from "../src/contexts/PetContext";
import { Card } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { Button } from "../src/components/ui/Button";
import { PetSwitcher } from "../src/components/pet/PetSwitcher";
import { colors } from "../src/theme/colors";
import { spacing, radius, fontSize } from "../src/theme/spacing";

const statusColors = {
  normal: colors.primary, low: colors.warning, high: colors.warning, critical: colors.danger,
};

export default function LabsScreen() {
  const { activePet } = usePet();
  const router = useRouter();
  const petLabs = labResults.filter((l) => l.petId === activePet.id);

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Lab Results",
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
      <ScrollView contentContainerStyle={styles.content}>
        <Button title="Upload New Report" icon={<Upload size={16} color="#FFF" />} style={{ marginBottom: spacing.lg }} />

        {petLabs.map((lab) => (
          <Card key={lab.id} variant="elevated" style={styles.labCard}>
            <View style={styles.labHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.labName}>{lab.testName}</Text>
                <Text style={styles.labMeta}>{lab.labName} · {new Date(lab.testDate).toLocaleDateString()}</Text>
              </View>
              <Badge
                label={lab.status}
                variant={lab.status === "normal" ? "success" : lab.status === "abnormal" || lab.status === "critical" ? "danger" : "warning"}
              />
            </View>

            {lab.aiAnalysis && (
              <View style={styles.aiBox}>
                <View style={styles.aiHeader}>
                  <Sparkles size={14} color={colors.primary} />
                  <Text style={styles.aiTitle}>AI Analysis</Text>
                </View>
                <Text style={styles.aiText}>{lab.aiAnalysis}</Text>
              </View>
            )}

            <View style={styles.panels}>
              {lab.panels.map((p: LabPanel, i: number) => (
                <View key={i} style={styles.panel}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.panelName}>{p.name}</Text>
                    <Text style={styles.panelRef}>Ref: {p.referenceMin}-{p.referenceMax} {p.unit}</Text>
                  </View>
                  <View style={styles.panelValue}>
                    <Text style={[styles.value, { color: statusColors[p.status] }]}>{p.value}</Text>
                    <Text style={styles.unit}>{p.unit}</Text>
                  </View>
                  <View style={[styles.statusDot, { backgroundColor: statusColors[p.status] }]} />
                </View>
              ))}
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
  content: { padding: spacing.lg },
  labCard: { marginBottom: spacing.lg },
  labHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.sm, marginBottom: spacing.md },
  labName: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  labMeta: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  aiBox: { backgroundColor: colors.primary + "10", borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: spacing.xs },
  aiTitle: { fontSize: fontSize.xs, color: colors.primary, fontWeight: "700", textTransform: "uppercase" },
  aiText: { fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },
  panels: { gap: spacing.sm },
  panel: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.borderLight, gap: spacing.md },
  panelName: { fontSize: fontSize.sm, fontWeight: "600", color: colors.text },
  panelRef: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 1 },
  panelValue: { alignItems: "flex-end" },
  value: { fontSize: fontSize.md, fontWeight: "700" },
  unit: { fontSize: fontSize.xs, color: colors.textTertiary },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
});
