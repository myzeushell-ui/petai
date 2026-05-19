import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Star, AlertTriangle } from "lucide-react-native";
import { getNutritionPlan, getFoodRecommendations } from "../src/data/nutrition";
import { usePet } from "../src/contexts/PetContext";
import { Card } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { colors } from "../src/theme/colors";
import { spacing, radius, fontSize } from "../src/theme/spacing";

export default function NutritionScreen() {
  const { activePet } = usePet();
  const router = useRouter();
  const [tab, setTab] = useState<"plan" | "foods">("plan");
  const plan = getNutritionPlan(activePet.id);
  const foods = getFoodRecommendations(activePet.species === "cat" ? "cat" : "dog");

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Nutrition",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
              <ArrowLeft size={22} color={colors.text} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { fontWeight: "700" },
        }}
      />
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab("plan")} style={[styles.tab, tab === "plan" && styles.tabActive]}>
          <Text style={[styles.tabText, tab === "plan" && styles.tabTextActive]}>Diet Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab("foods")} style={[styles.tab, tab === "foods" && styles.tabActive]}>
          <Text style={[styles.tabText, tab === "foods" && styles.tabTextActive]}>Recommendations</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === "plan" ? (
          <>
            <Card variant="elevated" style={styles.card}>
              <Text style={styles.calories}>{plan.dailyCalories} <Text style={styles.kcalLabel}>kcal/day</Text></Text>
              <Text style={styles.subtitle}>{plan.meals} meals · {activePet.name}'s personalized target</Text>
              <View style={styles.macroRow}>
                <View style={styles.macro}>
                  <Text style={styles.macroValue}>{plan.protein}%</Text>
                  <Text style={styles.macroLabel}>Protein</Text>
                </View>
                <View style={styles.macro}>
                  <Text style={styles.macroValue}>{plan.fat}%</Text>
                  <Text style={styles.macroLabel}>Fat</Text>
                </View>
                <View style={styles.macro}>
                  <Text style={styles.macroValue}>{plan.fiber}%</Text>
                  <Text style={styles.macroLabel}>Fiber</Text>
                </View>
              </View>
            </Card>

            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              {plan.recommendations.map((r, i) => (
                <View key={i} style={styles.recRow}>
                  <View style={styles.recNum}><Text style={styles.recNumText}>{i + 1}</Text></View>
                  <Text style={styles.recText}>{r}</Text>
                </View>
              ))}
            </Card>

            <Card style={[styles.card, { borderColor: colors.danger + "40" }]}>
              <View style={styles.warningHeader}>
                <AlertTriangle size={18} color={colors.danger} />
                <Text style={[styles.sectionTitle, { color: colors.danger }]}>Foods to Avoid</Text>
              </View>
              <View style={styles.avoidGrid}>
                {plan.avoid.map((a) => (
                  <Badge key={a} label={a} variant="danger" style={{ marginRight: 6, marginBottom: 6 }} />
                ))}
              </View>
            </Card>
          </>
        ) : (
          <>
            {foods.map((f) => (
              <Card key={f.id} style={styles.foodCard}>
                <View style={styles.foodHeader}>
                  <Text style={styles.foodEmoji}>{f.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.foodName}>{f.name}</Text>
                    <Text style={styles.foodBrand}>{f.brand} · {f.type}</Text>
                    <View style={styles.foodMeta}>
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.foodRating}>{f.rating}</Text>
                      <Text style={styles.foodPrice}>· ${f.price}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.macroBars}>
                  <Bar label="Protein" value={f.proteinPercent} color={colors.primary} />
                  <Bar label="Fat" value={f.fatPercent} color={colors.warning} />
                  <Bar label="Fiber" value={f.fiberPercent} color={colors.info} />
                </View>
                <Text style={styles.foodIngredients}>{f.topIngredients.slice(0, 3).join(" · ")}</Text>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.barWrap}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.min(value, 100)}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.barValue}>{value}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
  tabs: { flexDirection: "row", gap: spacing.sm, padding: spacing.lg, paddingBottom: 0 },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: "center", borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: fontSize.sm, fontWeight: "600", color: colors.text },
  tabTextActive: { color: "#FFF" },
  content: { padding: spacing.lg },
  card: { marginBottom: spacing.md },
  calories: { fontSize: fontSize.hero, fontWeight: "800", color: colors.text },
  kcalLabel: { fontSize: fontSize.md, color: colors.textSecondary, fontWeight: "500" },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.lg },
  macroRow: { flexDirection: "row", justifyContent: "space-around", paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderLight },
  macro: { alignItems: "center" },
  macroValue: { fontSize: fontSize.xl, fontWeight: "800", color: colors.primary },
  macroLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, marginBottom: spacing.md },
  recRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  recNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary + "20", alignItems: "center", justifyContent: "center" },
  recNumText: { fontSize: fontSize.xs, color: colors.primary, fontWeight: "700" },
  recText: { flex: 1, fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },
  warningHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 0 },
  avoidGrid: { flexDirection: "row", flexWrap: "wrap" },
  foodCard: { marginBottom: spacing.md },
  foodHeader: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.md },
  foodEmoji: { fontSize: 36 },
  foodName: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  foodBrand: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 1, textTransform: "capitalize" },
  foodMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  foodRating: { fontSize: fontSize.sm, fontWeight: "700", color: colors.text },
  foodPrice: { fontSize: fontSize.xs, color: colors.textTertiary },
  macroBars: { gap: 6, marginBottom: spacing.sm },
  barWrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  barLabel: { fontSize: fontSize.xs, color: colors.textSecondary, width: 50, fontWeight: "500" },
  barTrack: { flex: 1, height: 6, backgroundColor: colors.borderLight, borderRadius: 3, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 3 },
  barValue: { fontSize: fontSize.xs, color: colors.text, fontWeight: "600", width: 30, textAlign: "right" },
  foodIngredients: { fontSize: fontSize.xs, color: colors.textTertiary, fontStyle: "italic", marginTop: 4 },
});
