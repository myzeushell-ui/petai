import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, ChevronRight, AlertTriangle, TrendingUp, Award, Lightbulb, FlaskConical, Clock, FileText, Utensils, Dna, Mic } from "lucide-react-native";
import { usePet } from "../../src/contexts/PetContext";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { HealthScoreRing } from "../../src/components/ui/HealthScoreRing";
import { colors, getHealthColor } from "../../src/theme/colors";
import { spacing, radius, fontSize } from "../../src/theme/spacing";
import { reminders } from "../../src/data/reminders";
import { aiInsights } from "../../src/data/aiInsights";
import { useRouter } from "expo-router";

const features = [
  { id: "reminders", label: "Reminders", Icon: Bell, color: "#EF4444" },
  { id: "timeline", label: "Timeline", Icon: Clock, color: "#3B82F6" },
  { id: "labs", label: "Lab Results", Icon: FlaskConical, color: "#0EA5E9" },
  { id: "vet-report", label: "Vet Report", Icon: FileText, color: "#A855F7" },
  { id: "nutrition", label: "Nutrition", Icon: Utensils, color: "#22c55e" },
  { id: "breeding", label: "Breeding", Icon: Dna, color: "#EC4899" },
  { id: "collar", label: "Smart Collar", Icon: Mic, color: "#F59E0B" },
];

const insightIcons: Record<string, React.ReactNode> = {
  health_alert: <AlertTriangle size={18} color={colors.warning} />,
  recommendation: <Lightbulb size={18} color={colors.info} />,
  trend: <TrendingUp size={18} color={colors.primary} />,
  praise: <Award size={18} color={colors.primary} />,
};

export default function DashboardScreen() {
  const { activePet, pets, switchPet } = usePet();
  const router = useRouter();
  const petReminders = reminders.filter((r) => r.petId === activePet.id && !r.completed).slice(0, 3);
  const petInsights = aiInsights.filter((i) => i.petId === activePet.id).slice(0, 2);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}, Alex</Text>
            <Text style={styles.subtitle}>Here's how <Text style={{ color: activePet.color, fontWeight: "700" }}>{activePet.name}</Text> is doing</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Bell size={22} color={colors.text} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* Pet Switcher */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petSwitcher}>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              onPress={() => switchPet(pet.id)}
              style={[styles.petChip, pet.id === activePet.id && { backgroundColor: pet.color + "18", borderColor: pet.color }]}
            >
              <Text style={styles.petEmoji}>{pet.emoji}</Text>
              <View>
                <Text style={[styles.petChipName, pet.id === activePet.id && { color: pet.color }]}>{pet.name}</Text>
                <Text style={styles.petChipBreed}>{pet.breed}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Pet Profile + Health Score */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.profileInfo}>
              <View style={[styles.avatar, { backgroundColor: activePet.color + "20" }]}>
                <Text style={styles.avatarEmoji}>{activePet.emoji}</Text>
              </View>
              <View>
                <Text style={styles.petName}>{activePet.name}</Text>
                <Text style={styles.petBreed}>{activePet.breed}</Text>
                <Text style={styles.petMeta}>{activePet.age}y · {activePet.gender === "female" ? "♀" : "♂"} · {activePet.weight}{activePet.weightUnit}</Text>
              </View>
            </View>
            <HealthScoreRing score={activePet.healthScore} size={90} strokeWidth={8} />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Vaccines</Text>
              <Badge label="Up to date" variant="success" />
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>ALT Level</Text>
              <Badge label="Elevated" variant="warning" />
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Dental</Text>
              <Badge label="Due soon" variant="info" />
            </View>
          </View>
        </Card>

        {/* Feature Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore</Text>
          <View style={styles.featureGrid}>
            {features.map((f) => (
              <TouchableOpacity key={f.id} onPress={() => router.push(`/${f.id}` as any)} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: f.color + "18" }]}>
                  <f.Icon size={22} color={f.color} />
                </View>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reminders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
            <TouchableOpacity onPress={() => router.push("/reminders")}><Text style={styles.viewAll}>View all</Text></TouchableOpacity>
          </View>
          {petReminders.map((r) => (
            <Card key={r.id} style={styles.reminderCard}>
              <View style={styles.reminderRow}>
                <View style={[styles.priorityDot, { backgroundColor: r.priority === "high" ? colors.danger : r.priority === "medium" ? colors.warning : colors.textTertiary }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reminderTitle}>{r.title}</Text>
                  {r.description && <Text style={styles.reminderDesc}>{r.description}</Text>}
                </View>
                <Text style={styles.reminderDate}>{new Date(r.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* AI Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Health Insights</Text>
            <TouchableOpacity onPress={() => router.push("/assistant")}><Text style={styles.viewAll}>Ask AI</Text></TouchableOpacity>
          </View>
          {petInsights.map((insight) => (
            <Card key={insight.id} variant="elevated" style={styles.insightCard}>
              <View style={styles.insightHeader}>
                {insightIcons[insight.type]}
                <Text style={styles.insightTitle}>{insight.title}</Text>
              </View>
              <Text style={styles.insightBody}>{insight.body}</Text>
              {insight.actionable && insight.action && (
                <TouchableOpacity style={styles.insightAction}>
                  <Text style={styles.insightActionText}>{insight.action}</Text>
                  <ChevronRight size={14} color={colors.primary} />
                </TouchableOpacity>
              )}
            </Card>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
  scroll: { flex: 1 },
  content: { padding: spacing.lg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.lg },
  greeting: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: 2 },
  bellBtn: { padding: spacing.sm, position: "relative" },
  bellDot: { position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger },
  petSwitcher: { marginBottom: spacing.lg },
  petChip: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.xl, borderWidth: 1.5, borderColor: colors.border, marginRight: spacing.sm, backgroundColor: colors.surface },
  petEmoji: { fontSize: 24 },
  petChipName: { fontSize: fontSize.sm, fontWeight: "700", color: colors.text },
  petChipBreed: { fontSize: fontSize.xs, color: colors.textSecondary },
  profileCard: { marginBottom: spacing.xl },
  profileRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg },
  profileInfo: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  avatarEmoji: { fontSize: 28 },
  petName: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text },
  petBreed: { fontSize: fontSize.sm, color: colors.textSecondary },
  petMeta: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 2 },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  stat: { alignItems: "center", gap: spacing.xs },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: "500" },
  section: { marginTop: spacing.lg },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  viewAll: { fontSize: fontSize.sm, color: colors.primary, fontWeight: "600" },
  reminderCard: { marginBottom: spacing.sm, padding: spacing.md },
  reminderRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  reminderTitle: { fontSize: fontSize.md, fontWeight: "600", color: colors.text },
  reminderDesc: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 1 },
  reminderDate: { fontSize: fontSize.xs, color: colors.textTertiary, fontWeight: "500" },
  insightCard: { marginBottom: spacing.md },
  insightHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  insightTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 },
  insightBody: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  insightAction: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: spacing.md },
  insightActionText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: "600" },
  featureGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  featureCard: { width: "23%", alignItems: "center", paddingVertical: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, gap: 6 },
  featureIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  featureLabel: { fontSize: 10, fontWeight: "600", color: colors.text, textAlign: "center" },
});
