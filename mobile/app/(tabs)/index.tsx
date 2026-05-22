import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, ChevronRight, AlertTriangle, TrendingUp, Award, Lightbulb, FlaskConical, Clock, FileText, Utensils, Dna, Mic, Settings, PawPrint, Sparkles, Stethoscope, Camera as CameraIcon, ScanLine } from "lucide-react-native";
import { usePet } from "../../src/contexts/PetContext";
import { useColors, useTheme } from "../../src/contexts/ThemeContext";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { HealthScoreRing } from "../../src/components/ui/HealthScoreRing";
import { GradientBackground } from "../../src/components/ui/GradientBackground";
import { PetCoverHeader } from "../../src/components/pet/PetCoverHeader";
import { DailyInsight } from "../../src/components/home/DailyInsight";
import { spacing, radius, fontSize } from "../../src/theme/spacing";
import { reminders } from "../../src/data/reminders";
import { aiInsights } from "../../src/data/aiInsights";
import { useRouter } from "expo-router";

const features = [
  { id: "breeds", label: "Breeds", Icon: PawPrint, color: "#22c55e" },
  { id: "reminders", label: "Reminders", Icon: Bell, color: "#EF4444" },
  { id: "timeline", label: "Timeline", Icon: Clock, color: "#3B82F6" },
  { id: "labs", label: "Lab Results", Icon: FlaskConical, color: "#0EA5E9" },
  { id: "vet-report", label: "Vet Report", Icon: FileText, color: "#A855F7" },
  { id: "nutrition", label: "Nutrition", Icon: Utensils, color: "#22c55e" },
  { id: "breeding", label: "Breeding", Icon: Dna, color: "#EC4899" },
  { id: "collar", label: "Smart Collar", Icon: Mic, color: "#F59E0B" },
];

export default function DashboardScreen() {
  const { activePet, pets, switchPet } = usePet();
  const router = useRouter();
  const colors = useColors();
  const { theme } = useTheme();
  const styles = useStyles(colors);
  const isGlass = theme.style === "glass";

  const petReminders = reminders.filter((r) => r.petId === activePet.id && !r.completed).slice(0, 3);
  const petInsights = aiInsights.filter((i) => i.petId === activePet.id).slice(0, 2);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const insightIcons: Record<string, React.ReactNode> = {
    health_alert: <AlertTriangle size={18} color={colors.warning} />,
    recommendation: <Lightbulb size={18} color={colors.info} />,
    trend: <TrendingUp size={18} color={colors.primary} />,
    praise: <Award size={18} color={colors.primary} />,
  };

  return (
    <View style={styles.safe}>
      <GradientBackground>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Cover photo header (Facebook-style) with pet info + user avatar */}
          <PetCoverHeader
            height={260}
            onSettings={() => router.push("/settings")}
          />

          <View style={styles.below}>
            {/* Pet Switcher */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petSwitcher}>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  onPress={() => switchPet(pet.id)}
                  style={[
                    styles.petChip,
                    pet.id === activePet.id && { backgroundColor: colors.primary + "20", borderColor: colors.primary },
                  ]}
                >
                  <Text style={styles.petEmoji}>{pet.emoji}</Text>
                  <View>
                    <Text style={[styles.petChipName, pet.id === activePet.id && { color: colors.primary }]}>{pet.name}</Text>
                    <Text style={styles.petChipBreed}>{pet.breed}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Health Score Card */}
            <Card variant={isGlass ? "default" : "elevated"} style={styles.profileCard}>
              <View style={styles.profileRow}>
                <View>
                  <Text style={styles.scoreLabel}>Health Score</Text>
                  <Text style={styles.scoreNumber}>{activePet.healthScore}</Text>
                  <Text style={styles.scoreOf}>out of 100</Text>
                </View>
                <HealthScoreRing score={activePet.healthScore} size={90} strokeWidth={8} />
              </View>
              <View style={styles.statsRow}>
                <Badge label="✓ Vaccines" variant="success" />
                <Badge label="⚠ ALT high" variant="warning" />
                <Badge label="🦷 Dental" variant="info" />
              </View>
            </Card>

        {/* Daily AI Insight */}
        <DailyInsight />

        {/* AI VISION row — two buttons side by side */}
        <View style={{ flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md }}>
          <TouchableOpacity onPress={() => router.push("/vision?mode=pet")} style={[styles.aiBtn, { backgroundColor: colors.surface, borderColor: colors.primary + "40" }]}>
            <CameraIcon size={20} color={colors.primary} />
            <Text style={[styles.aiBtnText, { color: colors.text }]}>Photo analysis</Text>
            <Text style={[styles.aiBtnSub, { color: colors.textSecondary }]}>Breed · health · mood</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/vision?mode=lab")} style={[styles.aiBtn, { backgroundColor: colors.surface, borderColor: colors.primary + "40" }]}>
            <ScanLine size={20} color={colors.primary} />
            <Text style={[styles.aiBtnText, { color: colors.text }]}>Lab decoder</Text>
            <Text style={[styles.aiBtnSub, { color: colors.textSecondary }]}>Bloodwork → plain Eng</Text>
          </TouchableOpacity>
        </View>

        {/* AI TRIAGE HERO — primary action */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push("/triage")} style={[styles.quizHero, { backgroundColor: "#DC2626", shadowColor: "#DC2626" }]}>
          <View style={styles.quizHeroInner}>
            <View style={styles.quizIconBox}>
              <Stethoscope size={26} color="#FFF" strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.quizTitle}>Is {activePet.name} OK?</Text>
              <Text style={styles.quizSub}>AI symptom triage · know what to do in 60 sec</Text>
            </View>
            <View style={styles.quizArrowBox}>
              <ChevronRight size={20} color="#FFF" strokeWidth={3} />
            </View>
          </View>
        </TouchableOpacity>

        {/* QUIZ HERO BUTTON */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push("/quiz")} style={styles.quizHero}>
          <View style={styles.quizHeroInner}>
            <View style={styles.quizIconBox}>
              <Sparkles size={26} color="#FFF" strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.quizTitle}>Find Your Perfect Dog</Text>
              <Text style={styles.quizSub}>12-question quiz · personalized matches</Text>
            </View>
            <View style={styles.quizArrowBox}>
              <ChevronRight size={20} color="#FFF" strokeWidth={3} />
            </View>
          </View>
        </TouchableOpacity>

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
          </View>
        </ScrollView>
      </GradientBackground>
    </View>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.xxxl },
  below: { padding: spacing.lg, paddingTop: spacing.lg },
  scoreLabel: { fontSize: 11, fontWeight: "700", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 0.08 * 11 },
  scoreNumber: { fontSize: 48, fontWeight: "800", color: colors.text, lineHeight: 50, letterSpacing: -0.04 * 48, marginTop: 4 },
  scoreOf: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 2 },
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
  statsRow: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderLight },
  stat: { alignItems: "center", gap: spacing.xs },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: "500" },
  quizHero: { backgroundColor: colors.primary, borderRadius: radius.xl, marginBottom: spacing.md, marginTop: spacing.md, shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  quizHeroInner: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  quizIconBox: { width: 50, height: 50, borderRadius: 25, backgroundColor: "rgba(255,255,255,0.22)", alignItems: "center", justifyContent: "center" },
  quizTitle: { fontSize: fontSize.lg, fontWeight: "800", color: "#FFF" },
  quizSub: { fontSize: fontSize.xs, color: "rgba(255,255,255,0.9)", marginTop: 2 },
  quizArrowBox: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.22)", alignItems: "center", justifyContent: "center" },
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
  aiBtn: { flex: 1, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1.5, gap: 4 },
  aiBtnText: { fontSize: fontSize.sm, fontWeight: "700", marginTop: 4 },
  aiBtnSub: { fontSize: 10, fontWeight: "500" },
  featureGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  featureCard: { width: "23%", alignItems: "center", paddingVertical: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, gap: 6 },
  featureIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  featureLabel: { fontSize: 10, fontWeight: "600", color: colors.text, textAlign: "center" },
});
