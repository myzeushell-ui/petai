import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Syringe, Stethoscope, Scissors, Pill, AlertTriangle, FlaskConical, FileText } from "lucide-react-native";
import { healthEvents } from "../src/data/healthEvents";
import { HealthEvent } from "../src/types";
import { usePet } from "../src/contexts/PetContext";
import { Card } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { colors } from "../src/theme/colors";
import { spacing, radius, fontSize } from "../src/theme/spacing";

const typeIcons: Record<HealthEvent["type"], React.ComponentType<any>> = {
  vaccination: Syringe, checkup: Stethoscope, surgery: Scissors, medication: Pill,
  symptom: AlertTriangle, lab: FlaskConical, note: FileText,
};

const typeColors: Record<HealthEvent["type"], string> = {
  vaccination: colors.info, checkup: colors.primary, surgery: colors.danger,
  medication: "#A855F7", symptom: colors.warning, lab: "#0EA5E9", note: colors.textTertiary,
};

export default function TimelineScreen() {
  const { activePet } = usePet();
  const router = useRouter();
  const events = healthEvents.filter((e) => e.petId === activePet.id).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Health Timeline",
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
        {events.map((event, idx) => {
          const Icon = typeIcons[event.type];
          const color = typeColors[event.type];
          return (
            <View key={event.id} style={styles.eventRow}>
              <View style={styles.timeline}>
                <View style={[styles.dot, { backgroundColor: color }]}>
                  <Icon size={14} color="#FFF" />
                </View>
                {idx < events.length - 1 && <View style={styles.line} />}
              </View>
              <Card style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{event.title}</Text>
                  <Text style={styles.date}>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</Text>
                </View>
                <Text style={styles.desc}>{event.description}</Text>
                {(event.vetName || event.clinicName) && (
                  <Text style={styles.meta}>
                    {event.vetName}{event.vetName && event.clinicName && " · "}{event.clinicName}
                  </Text>
                )}
                {event.severity && (
                  <View style={{ marginTop: spacing.sm }}>
                    <Badge label={event.severity + (event.resolved ? " · resolved" : "")} variant={event.severity === "high" ? "danger" : event.severity === "medium" ? "warning" : "default"} />
                  </View>
                )}
              </Card>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
  content: { padding: spacing.lg },
  eventRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.lg },
  timeline: { alignItems: "center", width: 32 },
  dot: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  line: { flex: 1, width: 2, backgroundColor: colors.border, marginTop: 4 },
  card: { flex: 1 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.xs, gap: spacing.sm },
  title: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 },
  date: { fontSize: fontSize.xs, color: colors.textTertiary },
  desc: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 19 },
  meta: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: spacing.sm, fontStyle: "italic" },
});
