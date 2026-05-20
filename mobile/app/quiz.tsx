import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw, Heart } from "lucide-react-native";
import { allBreeds } from "../src/data/breeds";
import { Breed } from "../src/types";
import { Card } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { Button } from "../src/components/ui/Button";
import { useColors } from "../src/contexts/ThemeContext";
import { spacing, radius, fontSize } from "../src/theme/spacing";

interface QuizAnswers {
  living: "apartment" | "house";
  activity: "low" | "moderate" | "high" | "very high";
  size: "small" | "medium" | "large" | "any";
  kids: boolean;
  otherPets: boolean;
  grooming: "low" | "moderate" | "high";
  experience: "first" | "some" | "experienced";
  shedding: "low" | "any";
}

const STEPS: Array<{
  key: keyof QuizAnswers;
  title: string;
  subtitle: string;
  options: Array<{ value: any; label: string; emoji: string }>;
}> = [
  {
    key: "living", title: "Where will you live with your dog?", subtitle: "Living space matters for breed comfort",
    options: [
      { value: "apartment", label: "Apartment / small home", emoji: "🏢" },
      { value: "house", label: "House with yard", emoji: "🏡" },
    ],
  },
  {
    key: "activity", title: "How active is your lifestyle?", subtitle: "Your dog will need to match your energy",
    options: [
      { value: "low", label: "Mostly relaxed", emoji: "😌" },
      { value: "moderate", label: "Regular walks", emoji: "🚶" },
      { value: "high", label: "Daily runs / hikes", emoji: "🏃" },
      { value: "very high", label: "Athlete-level active", emoji: "⛰️" },
    ],
  },
  {
    key: "size", title: "Preferred dog size?", subtitle: "From lap-sized to giant",
    options: [
      { value: "small", label: "Small (<15 kg)", emoji: "🐕" },
      { value: "medium", label: "Medium (15-25 kg)", emoji: "🐶" },
      { value: "large", label: "Large (25+ kg)", emoji: "🦮" },
      { value: "any", label: "No preference", emoji: "✨" },
    ],
  },
  {
    key: "kids", title: "Will the dog be around kids?", subtitle: "Some breeds are gentler with children",
    options: [
      { value: true, label: "Yes, has kids", emoji: "👨‍👩‍👧" },
      { value: false, label: "No kids", emoji: "🙅" },
    ],
  },
  {
    key: "otherPets", title: "Other pets at home?", subtitle: "Affects compatibility",
    options: [
      { value: true, label: "Yes, other pets", emoji: "🐈" },
      { value: false, label: "No other pets", emoji: "🚫" },
    ],
  },
  {
    key: "grooming", title: "Grooming time you can commit?", subtitle: "Some coats need daily care",
    options: [
      { value: "low", label: "Minimal", emoji: "✂️" },
      { value: "moderate", label: "Weekly brushing", emoji: "🪥" },
      { value: "high", label: "Daily / professional", emoji: "💇" },
    ],
  },
  {
    key: "experience", title: "Dog ownership experience?", subtitle: "Some breeds need experienced owners",
    options: [
      { value: "first", label: "First-time owner", emoji: "🆕" },
      { value: "some", label: "Some experience", emoji: "👌" },
      { value: "experienced", label: "Very experienced", emoji: "🏆" },
    ],
  },
  {
    key: "shedding", title: "Shedding tolerance?", subtitle: "Hair on furniture and clothes",
    options: [
      { value: "low", label: "Low shedding only", emoji: "🚫🐕" },
      { value: "any", label: "Doesn't matter", emoji: "🤷" },
    ],
  },
];

function scoreBreed(breed: Breed, a: Partial<QuizAnswers>): number {
  if (breed.species !== "dog") return -1;
  let score = 0;
  let maxScore = 0;

  if (a.living) {
    maxScore += 20;
    if (a.living === "apartment" && breed.apartment) score += 20;
    else if (a.living === "house") score += 15;
    else if (a.living === "apartment" && !breed.apartment) score += 0;
  }
  if (a.activity) {
    maxScore += 20;
    if (a.activity === breed.activity) score += 20;
    else if (Math.abs(["low","moderate","high","very high"].indexOf(a.activity) - ["low","moderate","high","very high"].indexOf(breed.activity)) === 1) score += 12;
    else score += 4;
  }
  if (a.size) {
    maxScore += 15;
    if (a.size === "any" || a.size === breed.size) score += 15;
    else if (Math.abs(["small","medium","large","giant"].indexOf(a.size) - ["small","medium","large","giant"].indexOf(breed.size)) === 1) score += 8;
  }
  if (a.kids !== undefined) {
    maxScore += 10;
    if (!a.kids) score += 10;
    else if (breed.goodWithKids) score += 10;
  }
  if (a.otherPets !== undefined) {
    maxScore += 10;
    if (!a.otherPets) score += 10;
    else if (breed.goodWithPets) score += 10;
  }
  if (a.grooming) {
    maxScore += 10;
    if (a.grooming === breed.grooming) score += 10;
    else if (a.grooming === "high" || breed.grooming === "low") score += 6;
  }
  if (a.experience) {
    maxScore += 8;
    if (a.experience === "experienced") score += 8;
    else if (a.experience === "some" && breed.trainability !== "stubborn") score += 8;
    else if (a.experience === "first" && breed.trainability === "easy") score += 8;
    else if (a.experience === "first" && breed.trainability === "stubborn") score += 1;
    else score += 4;
  }
  if (a.shedding) {
    maxScore += 7;
    if (a.shedding === "any") score += 7;
    else if (a.shedding === "low" && breed.shedding === "low") score += 7;
    else if (a.shedding === "low" && breed.shedding === "moderate") score += 3;
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

export default function QuizScreen() {
  const router = useRouter();
  const colors = useColors();
  const styles = useStyles(colors);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [showResults, setShowResults] = useState(false);

  const matches = useMemo(() => {
    if (!showResults) return [];
    return allBreeds
      .map((b) => ({ breed: b, score: scoreBreed(b, answers) }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [showResults, answers]);

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const handleSelect = (value: any) => {
    const newAnswers = { ...answers, [current.key]: value };
    setAnswers(newAnswers);
    if (step < STEPS.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      setTimeout(() => setShowResults(true), 200);
    }
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <Stack.Screen
          options={{
            headerShown: true, title: "Your Matches",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                <ArrowLeft size={22} color={colors.text} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={reset} style={{ padding: 8 }}>
                <RotateCcw size={20} color={colors.text} />
              </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: colors.surface },
            headerTitleStyle: { fontWeight: "700", color: colors.text },
          }}
        />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.resultHeader}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + "20" }]}>
              <Sparkles size={28} color={colors.primary} />
            </View>
            <Text style={styles.resultTitle}>Your perfect dog matches</Text>
            <Text style={styles.resultSub}>Based on your lifestyle and preferences</Text>
          </View>

          {matches.map((m, i) => (
            <Card key={m.breed.id} variant="elevated" style={[styles.matchCard, i === 0 && styles.topMatch]}>
              {i === 0 && (
                <View style={styles.topBadge}>
                  <Text style={styles.topBadgeText}>🏆 BEST MATCH</Text>
                </View>
              )}
              <View style={styles.matchRow}>
                <Text style={styles.matchEmoji}>{m.breed.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.matchName}>{m.breed.name}</Text>
                  <Text style={styles.matchOrigin}>{m.breed.group} · {m.breed.origin}</Text>
                </View>
                <View style={styles.scoreBox}>
                  <Text style={[styles.scoreNum, { color: m.score >= 80 ? colors.primary : m.score >= 60 ? colors.warning : colors.textSecondary }]}>{m.score}%</Text>
                  <Text style={styles.scoreLabel}>match</Text>
                </View>
              </View>
              <Text style={styles.matchDesc}>{m.breed.description}</Text>
              <View style={styles.matchTags}>
                <Badge label={m.breed.size} variant="info" />
                <Badge label={m.breed.activity} variant="warning" />
                <Badge label={m.breed.grooming + " care"} variant="default" />
              </View>
              <View style={styles.traitGrid}>
                {m.breed.traits.slice(0, 3).map((t) => (
                  <View key={t} style={[styles.trait, { backgroundColor: colors.primary + "12" }]}>
                    <Text style={[styles.traitText, { color: colors.primary }]}>{t}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.matchMeta}>
                <Text style={styles.metaItem}>📏 {m.breed.weight}</Text>
                <Text style={styles.metaItem}>⏳ {m.breed.lifespan}</Text>
              </View>
            </Card>
          ))}

          <Button title="Retake Quiz" variant="outline" onPress={reset} icon={<RotateCcw size={16} color={colors.text} />} style={{ marginTop: spacing.md }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true, title: "Find Your Perfect Dog",
          headerLeft: () => (
            <TouchableOpacity onPress={() => step === 0 ? router.back() : setStep(step - 1)} style={{ padding: 8 }}>
              <ArrowLeft size={22} color={colors.text} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { fontWeight: "700", color: colors.text },
        }}
      />

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.stepLabel}>STEP {step + 1} OF {STEPS.length}</Text>
        <Text style={styles.question}>{current.title}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>

        <View style={styles.optionsGrid}>
          {current.options.map((opt) => {
            const isSelected = answers[current.key] === opt.value;
            return (
              <TouchableOpacity
                key={String(opt.value)}
                onPress={() => handleSelect(opt.value)}
                style={[styles.option, isSelected && { borderColor: colors.primary, backgroundColor: colors.primary + "10" }]}
                activeOpacity={0.7}
              >
                <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                <Text style={[styles.optionLabel, isSelected && { color: colors.primary, fontWeight: "700" }]}>{opt.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {step > 0 && (
          <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backRow}>
            <ArrowLeft size={16} color={colors.textSecondary} />
            <Text style={styles.backText}>Previous question</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  progressBar: { height: 4, backgroundColor: colors.borderLight, marginHorizontal: spacing.lg, marginTop: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  stepLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: "700", letterSpacing: 0.5, marginBottom: spacing.sm, marginTop: spacing.lg },
  question: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, marginBottom: spacing.sm, lineHeight: 30 },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 20 },
  optionsGrid: { gap: spacing.sm },
  option: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg },
  optionEmoji: { fontSize: 32 },
  optionLabel: { fontSize: fontSize.md, color: colors.text, fontWeight: "500", flex: 1 },
  backRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: spacing.xl, padding: spacing.sm },
  backText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: "500" },
  resultHeader: { alignItems: "center", marginBottom: spacing.xl },
  iconCircle: { width: 70, height: 70, borderRadius: 35, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  resultTitle: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, textAlign: "center" },
  resultSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4, textAlign: "center" },
  matchCard: { marginBottom: spacing.md, position: "relative" },
  topMatch: { borderWidth: 2, borderColor: colors.primary },
  topBadge: { position: "absolute", top: -10, left: spacing.md, backgroundColor: colors.primary, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.full, zIndex: 1 },
  topBadgeText: { fontSize: 10, color: "#FFF", fontWeight: "800", letterSpacing: 0.5 },
  matchRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.md, marginTop: 4 },
  matchEmoji: { fontSize: 40 },
  matchName: { fontSize: fontSize.lg, fontWeight: "800", color: colors.text },
  matchOrigin: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  scoreBox: { alignItems: "center" },
  scoreNum: { fontSize: fontSize.xxl, fontWeight: "800" },
  scoreLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: -4 },
  matchDesc: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.md },
  matchTags: { flexDirection: "row", gap: 6, marginBottom: spacing.md, flexWrap: "wrap" },
  traitGrid: { flexDirection: "row", gap: 6, marginBottom: spacing.md, flexWrap: "wrap" },
  trait: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.full },
  traitText: { fontSize: fontSize.xs, fontWeight: "700" },
  matchMeta: { flexDirection: "row", gap: spacing.lg, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.borderLight },
  metaItem: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: "500" },
});
