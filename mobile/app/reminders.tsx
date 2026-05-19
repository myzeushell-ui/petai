import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Pill, Syringe, Stethoscope, Scissors, Bell, Check } from "lucide-react-native";
import { reminders as initialReminders } from "../src/data/reminders";
import { Reminder } from "../src/types";
import { usePet } from "../src/contexts/PetContext";
import { Card } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { colors, getPriorityColor } from "../src/theme/colors";
import { spacing, radius, fontSize } from "../src/theme/spacing";

const typeIcons: Record<Reminder["type"], React.ComponentType<any>> = {
  medication: Pill, vaccination: Syringe, checkup: Stethoscope, grooming: Scissors, custom: Bell,
};

export default function RemindersScreen() {
  const { activePet } = usePet();
  const router = useRouter();
  const [items, setItems] = useState<Reminder[]>(initialReminders);

  const petReminders = items.filter((r) => r.petId === activePet.id);
  const pending = petReminders.filter((r) => !r.completed);
  const completed = petReminders.filter((r) => r.completed);

  const toggle = (id: string) => {
    setItems((prev) => prev.map((r) => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Reminders",
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
        <Text style={styles.sectionTitle}>Pending ({pending.length})</Text>
        {pending.map((r) => {
          const Icon = typeIcons[r.type];
          return (
            <Card key={r.id} style={styles.card}>
              <TouchableOpacity onPress={() => toggle(r.id)} style={styles.row}>
                <View style={[styles.iconBox, { backgroundColor: getPriorityColor(r.priority) + "18" }]}>
                  <Icon size={20} color={getPriorityColor(r.priority)} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{r.title}</Text>
                  {r.description && <Text style={styles.desc}>{r.description}</Text>}
                  <View style={styles.metaRow}>
                    <Badge label={r.priority} variant={r.priority === "high" ? "danger" : r.priority === "medium" ? "warning" : "default"} />
                    {r.recurring && <Text style={styles.recurring}>↻ {r.recurringInterval}</Text>}
                    <Text style={styles.date}>{new Date(r.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</Text>
                  </View>
                </View>
                <View style={styles.checkbox} />
              </TouchableOpacity>
            </Card>
          );
        })}

        {completed.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Completed ({completed.length})</Text>
            {completed.map((r) => {
              const Icon = typeIcons[r.type];
              return (
                <Card key={r.id} style={[styles.card, { opacity: 0.6 }]}>
                  <TouchableOpacity onPress={() => toggle(r.id)} style={styles.row}>
                    <View style={[styles.iconBox, { backgroundColor: colors.primary + "18" }]}>
                      <Icon size={20} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.title, { textDecorationLine: "line-through" }]}>{r.title}</Text>
                      <Text style={styles.date}>{new Date(r.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</Text>
                    </View>
                    <View style={[styles.checkbox, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                      <Check size={16} color="#FFF" />
                    </View>
                  </TouchableOpacity>
                </Card>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
  content: { padding: spacing.lg },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginBottom: spacing.md },
  card: { marginBottom: spacing.sm, padding: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconBox: { width: 40, height: 40, borderRadius: radius.lg, alignItems: "center", justifyContent: "center" },
  title: { fontSize: fontSize.md, fontWeight: "600", color: colors.text },
  desc: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: 6 },
  recurring: { fontSize: fontSize.xs, color: colors.textTertiary, fontWeight: "500" },
  date: { fontSize: fontSize.xs, color: colors.textTertiary, marginLeft: "auto" },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
});
