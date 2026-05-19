import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, MapPin, User, Sparkles, Pill } from "lucide-react-native";
import { vetReports } from "../src/data/vetReports";
import { usePet } from "../src/contexts/PetContext";
import { Card } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { colors } from "../src/theme/colors";
import { spacing, radius, fontSize } from "../src/theme/spacing";

export default function VetReportScreen() {
  const { activePet } = usePet();
  const router = useRouter();
  const report = vetReports.find((r) => r.petId === activePet.id);

  if (!report) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ title: "Vet Report" }} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No vet reports yet for {activePet.name}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Vet Report",
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
        <Card variant="elevated" style={styles.headerCard}>
          <Text style={styles.clinic}>{report.clinicName}</Text>
          <View style={styles.metaRow}>
            <User size={14} color={colors.textSecondary} />
            <Text style={styles.meta}>{report.vetName}</Text>
          </View>
          {report.clinicAddress && (
            <View style={styles.metaRow}>
              <MapPin size={14} color={colors.textSecondary} />
              <Text style={styles.meta}>{report.clinicAddress}</Text>
            </View>
          )}
          <View style={styles.dateBadges}>
            <Badge label={`Visit: ${new Date(report.visitDate).toLocaleDateString()}`} variant="info" />
            {report.followUpDate && (
              <Badge label={`Follow-up: ${new Date(report.followUpDate).toLocaleDateString()}`} variant="warning" />
            )}
          </View>
        </Card>

        {report.aiSummary && (
          <Card style={[styles.section, styles.aiCard]}>
            <View style={styles.sectionHeader}>
              <Sparkles size={16} color={colors.primary} />
              <Text style={styles.sectionTitle}>AI Summary</Text>
            </View>
            <Text style={styles.sectionText}>{report.aiSummary}</Text>
          </Card>
        )}

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Chief Complaint</Text>
          <Text style={styles.sectionText}>{report.chiefComplaint}</Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnoses</Text>
          {report.diagnosis.map((d, i) => (
            <Text key={i} style={styles.bullet}>• {d}</Text>
          ))}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Treatment Plan</Text>
          {report.treatment.map((t, i) => (
            <Text key={i} style={styles.bullet}>• {t}</Text>
          ))}
        </Card>

        {report.prescriptions.length > 0 && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Prescriptions</Text>
            {report.prescriptions.map((p, i) => (
              <View key={i} style={styles.prescription}>
                <Pill size={18} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rxName}>{p.medication}</Text>
                  <Text style={styles.rxMeta}>{p.dosage} · {p.frequency} · {p.duration}</Text>
                  {p.notes && <Text style={styles.rxNotes}>{p.notes}</Text>}
                </View>
              </View>
            ))}
          </Card>
        )}

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Vet Notes</Text>
          <Text style={styles.sectionText}>{report.notes}</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  emptyText: { fontSize: fontSize.md, color: colors.textSecondary },
  content: { padding: spacing.lg },
  headerCard: { marginBottom: spacing.lg },
  clinic: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text, marginBottom: spacing.sm },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  meta: { fontSize: fontSize.sm, color: colors.textSecondary, flex: 1 },
  dateBadges: { flexDirection: "row", gap: 6, marginTop: spacing.sm, flexWrap: "wrap" },
  section: { marginBottom: spacing.md },
  aiCard: { backgroundColor: colors.primary + "08", borderColor: colors.primary + "30" },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: spacing.sm },
  sectionTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  sectionText: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 21 },
  bullet: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 21, marginLeft: 4, marginBottom: 4 },
  prescription: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start", paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.borderLight },
  rxName: { fontSize: fontSize.md, fontWeight: "600", color: colors.text },
  rxMeta: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  rxNotes: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 4, fontStyle: "italic" },
});
