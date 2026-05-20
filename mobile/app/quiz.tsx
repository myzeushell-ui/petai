import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Sparkles, RotateCcw, AlertCircle, Heart, Activity, Volume2, GraduationCap, DollarSign, ChevronUp, ChevronDown } from "lucide-react-native";
import { allBreeds, BreedQuiz } from "../src/data/breeds";
import { Card } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { Button } from "../src/components/ui/Button";
import { useColors } from "../src/contexts/ThemeContext";
import { spacing, radius, fontSize } from "../src/theme/spacing";

type Priority = "size" | "energy" | "grooming" | "kids" | "pets" | "trainability" | "quiet" | "health" | "affection" | "independent";

interface QuizAnswers {
  size?: "toy" | "small" | "medium" | "large" | "giant" | "any";
  living?: "apartment" | "apartment-yard" | "small-yard" | "yard" | "acreage";
  activity?: "low" | "moderate" | "active" | "very-active";
  household?: string[];  // multi-select
  aloneTime?: "rare" | "4h" | "8h" | "more";
  experience?: "first" | "casual" | "confident" | "expert";
  grooming?: "low" | "moderate" | "high";
  shedding?: "minimal" | "some" | "any";
  roles?: string[];  // multi-select max 2
  vocal?: "quiet" | "some" | "alert" | "any";
  trainability?: "easy" | "willing" | "independent" | "any";
  healthRisk?: "healthy" | "ok" | "expert";
  priorities?: Priority[];  // ordered
}

const TOTAL_STEPS = 12;

// ----- Question definitions -----
const HOUSEHOLD_OPTIONS = [
  { value: "alone", label: "Just me / adults only", emoji: "👤" },
  { value: "kids-young", label: "Kids under 6", emoji: "👶" },
  { value: "kids-mid", label: "Kids 6-12", emoji: "🧒" },
  { value: "teens", label: "Teens", emoji: "🧑" },
  { value: "dogs", label: "Other dog(s)", emoji: "🐕" },
  { value: "cats", label: "Cat(s)", emoji: "🐈" },
  { value: "small-pets", label: "Small pets", emoji: "🐰" },
  { value: "planning-kids", label: "Planning kids soon", emoji: "🤰" },
];

const ROLE_OPTIONS = [
  { value: "companion", label: "Cuddle / lap dog", emoji: "🤗" },
  { value: "sport", label: "Running / hiking partner", emoji: "🏃" },
  { value: "family", label: "Family dog for kids", emoji: "👨‍👩‍👧" },
  { value: "watchdog", label: "Watchdog / alert", emoji: "🛡️" },
  { value: "working", label: "Training / sports partner", emoji: "🏆" },
  { value: "office", label: "Calm office buddy", emoji: "💼" },
  { value: "therapy", label: "Therapy / emotional support", emoji: "💚" },
];

const PRIORITY_LIST: Array<{ id: Priority; label: string; Icon: any }> = [
  { id: "size", label: "Size", Icon: Activity },
  { id: "energy", label: "Energy level", Icon: Activity },
  { id: "grooming", label: "Low grooming", Icon: Sparkles },
  { id: "kids", label: "Good with kids", Icon: Heart },
  { id: "pets", label: "Good with other pets", Icon: Heart },
  { id: "trainability", label: "Easy to train", Icon: GraduationCap },
  { id: "quiet", label: "Quiet", Icon: Volume2 },
  { id: "health", label: "Healthy / low vet bills", Icon: DollarSign },
  { id: "affection", label: "Affectionate", Icon: Heart },
  { id: "independent", label: "Independent", Icon: Activity },
];

// ----- Scoring (C-BARQ + Iams priority weighting) -----
function scoreBreed(b: BreedQuiz, a: QuizAnswers): { score: number; reasons: string[]; warnings: string[] } {
  if (b.species !== "dog") return { score: 0, reasons: [], warnings: [] };

  const priorityMultipliers: Partial<Record<Priority, number>> = {};
  (a.priorities ?? []).forEach((p, i) => {
    priorityMultipliers[p] = i < 3 ? 2 : i < 6 ? 1.3 : 1;
  });
  const mult = (key: Priority) => priorityMultipliers[key] ?? 1;

  let raw = 0;
  let max = 0;
  const reasons: string[] = [];
  const warnings: string[] = [];

  // Q1 Size (weight 15)
  if (a.size) {
    const w = 15 * mult("size");
    max += w;
    const map: any = { toy: "small", small: "small", medium: "medium", large: "large", giant: "giant" };
    if (a.size === "any") raw += w;
    else if (map[a.size] === b.size) { raw += w; reasons.push(`${b.size} size — your preference`); }
    else if (Math.abs(["small","medium","large","giant"].indexOf(map[a.size]) - ["small","medium","large","giant"].indexOf(b.size)) === 1) raw += w * 0.5;
  }

  // Q2 Living (weight 12)
  if (a.living) {
    const w = 12;
    max += w;
    if (a.living === "apartment" || a.living === "apartment-yard") {
      if (b.apartment) { raw += w; reasons.push("apartment-friendly"); }
      else if (b.size === "large" || b.size === "giant") { raw += w * 0.1; warnings.push(`needs more space than apartment offers`); }
      else raw += w * 0.4;
    } else if (a.living === "acreage" || a.living === "yard") {
      raw += w; if (b.activity === "very high" || b.activity === "high") reasons.push("thrives with yard space");
    } else raw += w * 0.7;
  }

  // Q3 Activity (weight 18)
  if (a.activity) {
    const w = 18 * mult("energy");
    max += w;
    const userIdx = ["low","moderate","active","very-active"].indexOf(a.activity);
    const breedIdx = ["low","moderate","high","very high"].indexOf(b.activity);
    const diff = Math.abs(userIdx - breedIdx);
    if (diff === 0) { raw += w; reasons.push(`matches your ${a.activity.replace("-"," ")} lifestyle`); }
    else if (diff === 1) raw += w * 0.7;
    else if (diff === 2) { raw += w * 0.3; if (breedIdx > userIdx) warnings.push("needs more exercise than you may provide"); }
    else { raw += w * 0.05; warnings.push(breedIdx > userIdx ? "very high energy — risk of behavior issues if under-exercised" : "low energy — may seem lazy to you"); }
  }

  // Q4 Household (weight 15)
  if (a.household && a.household.length) {
    const hasYoungKids = a.household.includes("kids-young") || a.household.includes("planning-kids");
    const hasKids = hasYoungKids || a.household.includes("kids-mid");
    const hasCats = a.household.includes("cats");
    const hasSmallPets = a.household.includes("small-pets");
    const hasDogs = a.household.includes("dogs");

    if (hasKids) {
      const w = 10 * mult("kids");
      max += w;
      if (b.goodWithKids) { raw += w; reasons.push("great with kids"); }
      else { warnings.push("not recommended around young children"); raw += w * 0.1; }
    }
    if (hasCats || hasDogs) {
      const w = 8 * mult("pets");
      max += w;
      if (b.goodWithPets && b.prey <= 3) { raw += w; reasons.push("gets along with other pets"); }
      else { raw += w * 0.2; if (b.prey >= 4) warnings.push("high prey drive — risky with cats/small pets"); }
    }
    if (hasSmallPets && b.prey >= 4) warnings.push(`prey drive ${b.prey}/5 — small pets at risk`);
  }

  // Q5 Alone time (weight 10)
  if (a.aloneTime) {
    const w = 10;
    max += w;
    if (a.aloneTime === "rare" || a.aloneTime === "4h") raw += w;
    else if (a.aloneTime === "8h") {
      if (b.attachmentLevel <= 3) { raw += w * 0.9; reasons.push("handles alone time well"); }
      else { raw += w * 0.3; warnings.push("velcro dog — separation anxiety risk"); }
    } else {  // more
      if (b.attachmentLevel <= 2) raw += w * 0.8;
      else { raw += w * 0.1; warnings.push("not suited to long workdays alone"); }
    }
  }

  // Q6 Experience (weight 10)
  if (a.experience) {
    const w = 10 * mult("trainability");
    max += w;
    if (a.experience === "first") {
      if (b.trainability === "easy") { raw += w; reasons.push("beginner-friendly"); }
      else if (b.trainability === "moderate") raw += w * 0.6;
      else { raw += w * 0.1; warnings.push("not recommended for first-time owners"); }
    } else if (a.experience === "expert") raw += w;
    else raw += w * 0.85;
  }

  // Q7 Grooming + shedding (weight 12)
  if (a.grooming) {
    const w = 6 * mult("grooming");
    max += w;
    if (a.grooming === b.grooming) raw += w;
    else if (a.grooming === "high") raw += w * 0.8;
    else if (a.grooming === "low" && b.grooming === "high") { raw += w * 0.1; warnings.push("high grooming demands"); }
    else raw += w * 0.5;
  }
  if (a.shedding) {
    const w = 6 * mult("grooming");
    max += w;
    if (a.shedding === "any") raw += w;
    else if (a.shedding === "minimal") {
      if (b.shedding === "low" || b.hypoallergenic) { raw += w; if (b.hypoallergenic) reasons.push("hypoallergenic coat"); }
      else if (b.shedding === "moderate") raw += w * 0.3;
      else { raw += w * 0.05; warnings.push("heavy shedder"); }
    } else raw += w * 0.7;
  }

  // Q8 Roles (weight 12)
  if (a.roles && a.roles.length) {
    const w = 12;
    max += w;
    const overlap = a.roles.filter((r) => b.roles.includes(r as any)).length;
    if (overlap >= 1) { raw += w * (overlap / a.roles.length); reasons.push(`fits ${a.roles.join("/")} role`); }
  }

  // Q9 Vocal (weight 7)
  if (a.vocal) {
    const w = 7 * mult("quiet");
    max += w;
    if (a.vocal === "any") raw += w;
    else if (a.vocal === "quiet") {
      if (b.vocalLevel <= 2) { raw += w; reasons.push("quiet"); }
      else if (b.vocalLevel === 3) raw += w * 0.4;
      else { raw += w * 0.05; warnings.push(`vocal level ${b.vocalLevel}/5 — may bark a lot`); }
    } else if (a.vocal === "alert") {
      if (b.vocalLevel >= 3 && b.watchdog >= 3) { raw += w; reasons.push("alert watchdog"); }
      else raw += w * 0.6;
    } else raw += w * 0.8;
  }

  // Q10 Trainability (weight 10)
  if (a.trainability) {
    const w = 10 * mult("trainability");
    max += w;
    if (a.trainability === "any") raw += w;
    else if (a.trainability === "easy" && b.trainability === "easy") { raw += w; reasons.push("eager to please"); }
    else if (a.trainability === "willing" && (b.trainability === "easy" || b.trainability === "moderate")) raw += w;
    else if (a.trainability === "independent" && b.trainability === "stubborn") { raw += w; reasons.push("independent thinker"); }
    else raw += w * 0.5;
  }

  // Q11 Health risk (weight 12) — PetAI moat
  if (a.healthRisk) {
    const w = 12 * mult("health");
    max += w;
    if (a.healthRisk === "healthy") {
      if (b.healthRiskScore <= 4) { raw += w; reasons.push("low health-risk breed"); }
      else if (b.healthRiskScore <= 6) raw += w * 0.5;
      else { raw += w * 0.05; warnings.push(`prone to ${b.healthIssues.slice(0,2).join(", ")}`); }
    } else if (a.healthRisk === "ok") {
      if (b.healthRiskScore <= 7) raw += w;
      else raw += w * 0.6;
    } else raw += w;  // expert — no penalty
  }

  return {
    score: max > 0 ? Math.round((raw / max) * 100) : 0,
    reasons: [...new Set(reasons)].slice(0, 4),
    warnings: [...new Set(warnings)].slice(0, 3),
  };
}

// ----- Screen -----
export default function QuizScreen() {
  const router = useRouter();
  const colors = useColors();
  const styles = useStyles(colors);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [priorities, setPriorities] = useState<Priority[]>(PRIORITY_LIST.map((p) => p.id));

  // Real-time breed pool counter (Purina trick)
  const breedPool = useMemo(() => {
    const dogs = allBreeds.filter((b) => b.species === "dog");
    if (Object.keys(answers).length === 0) return dogs.length;
    return dogs.filter((b) => scoreBreed(b, answers).score >= 40).length;
  }, [answers]);

  const results = useMemo(() => {
    if (!showResults) return [];
    const final = { ...answers, priorities };
    return allBreeds
      .filter((b) => b.species === "dog")
      .map((b) => ({ breed: b, ...scoreBreed(b, final) }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [showResults, answers, priorities]);

  const totalDogs = allBreeds.filter((b) => b.species === "dog").length;

  const set = <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setTimeout(() => next(), 250);
  };

  const toggleMulti = (key: "household" | "roles", value: string, max?: number) => {
    setAnswers((prev) => {
      const list = (prev[key] as string[]) ?? [];
      if (list.includes(value)) return { ...prev, [key]: list.filter((v) => v !== value) };
      if (max && list.length >= max) return { ...prev, [key]: [...list.slice(1), value] };
      return { ...prev, [key]: [...list, value] };
    });
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else setShowResults(true);
  };

  const reset = () => { setAnswers({}); setStep(0); setShowResults(false); };

  const movePriority = (id: Priority, dir: -1 | 1) => {
    setPriorities((prev) => {
      const i = prev.indexOf(id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const arr = [...prev];
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  };

  // ----- Results screen -----
  if (showResults) {
    return (
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <Stack.Screen options={{
          headerShown: true, title: "Your Matches",
          headerLeft: () => <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}><ArrowLeft size={22} color={colors.text} /></TouchableOpacity>,
          headerRight: () => <TouchableOpacity onPress={reset} style={{ padding: 8 }}><RotateCcw size={20} color={colors.text} /></TouchableOpacity>,
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { fontWeight: "700", color: colors.text },
          headerTintColor: colors.text,
        }} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.resultHeader}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + "20" }]}>
              <Sparkles size={28} color={colors.primary} />
            </View>
            <Text style={styles.resultTitle}>Your top dog matches</Text>
            <Text style={styles.resultSub}>Personalized using your priority rankings</Text>
          </View>

          {results.map((m, i) => (
            <Card key={m.breed.id} variant="elevated" style={[styles.matchCard, i === 0 && { borderWidth: 2, borderColor: colors.primary }]}>
              {i === 0 && (
                <View style={[styles.topBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.topBadgeText}>🏆 BEST MATCH</Text>
                </View>
              )}
              <View style={styles.matchRow}>
                <Text style={styles.matchEmoji}>{m.breed.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.matchName}>{m.breed.name}</Text>
                  <Text style={styles.matchOrigin}>{m.breed.group} · {m.breed.weight}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={[styles.scoreNum, { color: m.score >= 80 ? colors.primary : m.score >= 60 ? colors.warning : colors.textSecondary }]}>{m.score}%</Text>
                  <Text style={styles.scoreLabel}>match</Text>
                </View>
              </View>

              <Text style={styles.matchDesc}>{m.breed.description}</Text>

              {m.reasons.length > 0 && (
                <View style={styles.whyBox}>
                  <Text style={styles.whyLabel}>WHY THIS BREED</Text>
                  {m.reasons.map((r, idx) => (
                    <Text key={idx} style={[styles.whyItem, { color: colors.text }]}>• {r}</Text>
                  ))}
                </View>
              )}

              {m.warnings.length > 0 && (
                <View style={[styles.warningBox, { backgroundColor: colors.warning + "12", borderColor: colors.warning + "40" }]}>
                  <View style={styles.warningHeader}>
                    <AlertCircle size={14} color={colors.warning} />
                    <Text style={[styles.whyLabel, { color: colors.warning }]}>WATCH OUT</Text>
                  </View>
                  {m.warnings.map((w, idx) => (
                    <Text key={idx} style={[styles.whyItem, { color: colors.text }]}>• {w}</Text>
                  ))}
                </View>
              )}

              <View style={styles.costRow}>
                <View style={styles.costItem}>
                  <DollarSign size={14} color={colors.textSecondary} />
                  <Text style={styles.costText}>~${(m.breed.lifetimeCostUSD / 1000).toFixed(0)}K / 10y</Text>
                </View>
                <View style={styles.costItem}>
                  <Heart size={14} color={colors.textSecondary} />
                  <Text style={styles.costText}>{m.breed.lifespan}</Text>
                </View>
                <View style={styles.costItem}>
                  <Activity size={14} color={colors.textSecondary} />
                  <Text style={styles.costText}>{m.breed.activity} energy</Text>
                </View>
              </View>
            </Card>
          ))}

          <Button title="Retake Quiz" variant="outline" onPress={reset} icon={<RotateCcw size={16} color={colors.text} />} style={{ marginTop: spacing.md }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ----- Question screens -----
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen options={{
        headerShown: true, title: "Find Your Perfect Dog",
        headerLeft: () => <TouchableOpacity onPress={() => step === 0 ? router.back() : setStep(step - 1)} style={{ padding: 8 }}><ArrowLeft size={22} color={colors.text} /></TouchableOpacity>,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: "700", color: colors.text },
        headerTintColor: colors.text,
      }} />

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
      </View>

      <View style={styles.poolBox}>
        <Text style={styles.poolNum}>{breedPool}</Text>
        <Text style={styles.poolText}>of {totalDogs} breeds match so far</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.stepLabel}>STEP {step + 1} OF {TOTAL_STEPS}</Text>

        {step === 0 && <SingleChoice
          title="What size dog feels right for your home?"
          subtitle="Size affects everything: food cost, lifespan, handling"
          options={[
            { value: "toy", label: "Toy (<5 kg)", emoji: "🐕" },
            { value: "small", label: "Small (5-15 kg)", emoji: "🐶" },
            { value: "medium", label: "Medium (15-25 kg)", emoji: "🐕" },
            { value: "large", label: "Large (25-40 kg)", emoji: "🦮" },
            { value: "giant", label: "Giant (40+ kg)", emoji: "🐺" },
            { value: "any", label: "No preference", emoji: "✨" },
          ]}
          selected={answers.size} onSelect={(v: string) => set("size", v as any)} colors={colors} styles={styles}
        />}

        {step === 1 && <SingleChoice
          title="Where will your dog live?"
          subtitle="Living space sets hard constraints"
          options={[
            { value: "apartment", label: "Apartment, no outdoor space", emoji: "🏢" },
            { value: "apartment-yard", label: "Apartment + balcony/shared", emoji: "🏬" },
            { value: "small-yard", label: "House, small yard", emoji: "🏡" },
            { value: "yard", label: "House, average yard", emoji: "🏠" },
            { value: "acreage", label: "Large yard or acreage", emoji: "🌳" },
          ]}
          selected={answers.living} onSelect={(v: string) => set("living", v as any)} colors={colors} styles={styles}
        />}

        {step === 2 && <SingleChoice
          title="How active is your lifestyle?"
          subtitle="Your dog will match your energy"
          options={[
            { value: "low", label: "Light — under 30 min walks", emoji: "😌" },
            { value: "moderate", label: "Moderate — 30-60 min", emoji: "🚶" },
            { value: "active", label: "Active — 1-2 hr runs/hikes", emoji: "🏃" },
            { value: "very-active", label: "Very active — 2+ hr athletic", emoji: "⛰️" },
          ]}
          selected={answers.activity} onSelect={(v: string) => set("activity", v as any)} colors={colors} styles={styles}
        />}

        {step === 3 && <MultiChoice
          title="Who else lives in your home?"
          subtitle="Select all that apply"
          options={HOUSEHOLD_OPTIONS}
          selected={answers.household ?? []} onToggle={(v: string) => toggleMulti("household", v)}
          onContinue={() => next()}
          colors={colors} styles={styles}
        />}

        {step === 4 && <SingleChoice
          title="How long will the dog be alone on a weekday?"
          subtitle="Separation anxiety is a top return reason"
          options={[
            { value: "rare", label: "Almost never — someone's home", emoji: "🏠" },
            { value: "4h", label: "Up to 4 hours", emoji: "⏰" },
            { value: "8h", label: "4-8 hours", emoji: "💼" },
            { value: "more", label: "8+ hours regularly", emoji: "🌙" },
          ]}
          selected={answers.aloneTime} onSelect={(v: string) => set("aloneTime", v as any)} colors={colors} styles={styles}
        />}

        {step === 5 && <SingleChoice
          title="How much experience do you have with dogs?"
          subtitle="Some breeds need experienced handlers"
          options={[
            { value: "first", label: "First-time owner", emoji: "🆕" },
            { value: "casual", label: "Grew up with dogs", emoji: "👌" },
            { value: "confident", label: "Confident multi-dog experience", emoji: "🏆" },
            { value: "expert", label: "Pro / working-dog background", emoji: "🎓" },
          ]}
          selected={answers.experience} onSelect={(v: string) => set("experience", v as any)} colors={colors} styles={styles}
        />}

        {step === 6 && <SingleChoice
          title="Grooming time you can commit?"
          subtitle="The coat-care gap is huge for new owners"
          options={[
            { value: "low", label: "5 min / week — minimal", emoji: "🪶" },
            { value: "moderate", label: "15 min / week — weekly brushing", emoji: "🪥" },
            { value: "high", label: "30+ min + professional groomer", emoji: "💇" },
          ]}
          selected={answers.grooming} onSelect={(v: string) => set("grooming", v as any)} colors={colors} styles={styles}
        />}

        {step === 7 && <SingleChoice
          title="Shedding tolerance?"
          subtitle="No dog is truly hypoallergenic — but some shed less"
          options={[
            { value: "minimal", label: "Must be minimal / low-shed", emoji: "🚫" },
            { value: "some", label: "Some shedding is OK", emoji: "🤷" },
            { value: "any", label: "Doesn't matter", emoji: "✨" },
          ]}
          selected={answers.shedding} onSelect={(v: string) => set("shedding", v as any)} colors={colors} styles={styles}
        />}

        {step === 8 && <MultiChoice
          title="What role will your dog play?"
          subtitle="Pick up to 2"
          options={ROLE_OPTIONS}
          selected={answers.roles ?? []} onToggle={(v: string) => toggleMulti("roles", v, 2)}
          onContinue={() => next()}
          colors={colors} styles={styles}
        />}

        {step === 9 && <SingleChoice
          title="How vocal can your dog be?"
          subtitle="Neighbors and HOAs matter"
          options={[
            { value: "quiet", label: "Quiet only", emoji: "🤫" },
            { value: "some", label: "Some barking is fine", emoji: "🗣️" },
            { value: "alert", label: "I want an alert dog", emoji: "📢" },
            { value: "any", label: "Don't care", emoji: "✨" },
          ]}
          selected={answers.vocal} onSelect={(v: string) => set("vocal", v as any)} colors={colors} styles={styles}
        />}

        {step === 10 && <SingleChoice
          title="Trainability preference?"
          subtitle="Eager students vs independent thinkers"
          options={[
            { value: "easy", label: "Eager to please, easy to train", emoji: "🎓" },
            { value: "willing", label: "Smart, willing to work", emoji: "🧠" },
            { value: "independent", label: "Independent, does its own thing", emoji: "🦊" },
            { value: "any", label: "Don't care", emoji: "✨" },
          ]}
          selected={answers.trainability} onSelect={(v: string) => set("trainability", v as any)} colors={colors} styles={styles}
        />}

        {step === 11 && (
          <View>
            <Text style={styles.question}>How does breed health risk factor in?</Text>
            <Text style={styles.subtitle}>Some breeds have known issues — surgery costs $5-15K</Text>
            <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
              {[
                { value: "healthy", label: "Want the healthiest possible — low vet bills", emoji: "💚" },
                { value: "ok", label: "Some risk is OK if I love the breed", emoji: "🤝" },
                { value: "expert", label: "I'm experienced with breed-specific care", emoji: "🩺" },
              ].map((opt) => {
                const isSel = answers.healthRisk === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setAnswers((p) => ({ ...p, healthRisk: opt.value as any }))}
                    style={[styles.option, isSel && { borderColor: colors.primary, backgroundColor: colors.primary + "10" }]}
                  >
                    <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                    <Text style={[styles.optionLabel, isSel && { color: colors.primary, fontWeight: "700" }]}>{opt.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {answers.healthRisk && (
              <View style={{ marginTop: spacing.xxl }}>
                <View style={styles.priorityHeader}>
                  <Sparkles size={16} color={colors.primary} />
                  <Text style={styles.priorityTitle}>Now rank what matters MOST to you</Text>
                </View>
                <Text style={[styles.subtitle, { marginBottom: spacing.md }]}>Top 3 will heavily influence your matches</Text>

                <View style={{ gap: 6 }}>
                  {priorities.map((id, idx) => {
                    const item = PRIORITY_LIST.find((p) => p.id === id)!;
                    const Icon = item.Icon;
                    const isTop = idx < 3;
                    return (
                      <View key={id} style={[styles.priorityRow, isTop && { borderColor: colors.primary, backgroundColor: colors.primary + "10" }]}>
                        <View style={[styles.priorityNum, { backgroundColor: isTop ? colors.primary : colors.backgroundSecondary }]}>
                          <Text style={[styles.priorityNumText, { color: isTop ? "#FFF" : colors.text }]}>{idx + 1}</Text>
                        </View>
                        <Icon size={18} color={isTop ? colors.primary : colors.textSecondary} />
                        <Text style={[styles.priorityLabel, isTop && { color: colors.primary, fontWeight: "700" }]}>{item.label}</Text>
                        <View style={{ flexDirection: "row", gap: 4 }}>
                          <TouchableOpacity disabled={idx === 0} onPress={() => movePriority(id, -1)} style={[styles.arrowBtn, idx === 0 && { opacity: 0.3 }]}>
                            <ChevronUp size={16} color={colors.text} />
                          </TouchableOpacity>
                          <TouchableOpacity disabled={idx === priorities.length - 1} onPress={() => movePriority(id, 1)} style={[styles.arrowBtn, idx === priorities.length - 1 && { opacity: 0.3 }]}>
                            <ChevronDown size={16} color={colors.text} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>

                <Button title="See My Matches →" onPress={() => setShowResults(true)} style={{ marginTop: spacing.xl }} />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ----- Sub-components -----
function SingleChoice({ title, subtitle, options, selected, onSelect, colors, styles }: any) {
  return (
    <View>
      <Text style={styles.question}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
        {options.map((opt: any) => {
          const isSel = selected === opt.value;
          return (
            <Pressable key={String(opt.value)} onPress={() => onSelect(opt.value)}
              style={[styles.option, isSel && { borderColor: colors.primary, backgroundColor: colors.primary + "10" }]}>
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              <Text style={[styles.optionLabel, isSel && { color: colors.primary, fontWeight: "700" }]}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function MultiChoice({ title, subtitle, options, selected, onToggle, onContinue, colors, styles }: any) {
  return (
    <View>
      <Text style={styles.question}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
        {options.map((opt: any) => {
          const isSel = selected.includes(opt.value);
          return (
            <Pressable key={String(opt.value)} onPress={() => onToggle(opt.value)}
              style={[styles.option, isSel && { borderColor: colors.primary, backgroundColor: colors.primary + "10" }]}>
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              <Text style={[styles.optionLabel, isSel && { color: colors.primary, fontWeight: "700" }]}>{opt.label}</Text>
              {isSel && <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 18 }}>✓</Text>}
            </Pressable>
          );
        })}
      </View>
      <Button title={selected.length > 0 ? "Continue →" : "Skip"} onPress={onContinue} variant={selected.length > 0 ? "primary" : "outline"} style={{ marginTop: spacing.lg }} />
    </View>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  progressBar: { height: 4, backgroundColor: colors.borderLight, marginHorizontal: spacing.lg, marginTop: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  poolBox: { flexDirection: "row", alignItems: "baseline", gap: 6, paddingHorizontal: spacing.lg, marginTop: spacing.sm },
  poolNum: { fontSize: fontSize.xl, fontWeight: "800", color: colors.primary },
  poolText: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: "500" },
  stepLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: "700", letterSpacing: 0.5, marginBottom: spacing.sm },
  question: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, marginBottom: spacing.sm, lineHeight: 30 },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  option: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg },
  optionEmoji: { fontSize: 28 },
  optionLabel: { fontSize: fontSize.md, color: colors.text, fontWeight: "500", flex: 1 },
  priorityHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs },
  priorityTitle: { fontSize: fontSize.lg, fontWeight: "800", color: colors.text },
  priorityRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md },
  priorityNum: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  priorityNumText: { fontSize: fontSize.sm, fontWeight: "800" },
  priorityLabel: { fontSize: fontSize.md, color: colors.text, fontWeight: "500", flex: 1 },
  arrowBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.backgroundSecondary, alignItems: "center", justifyContent: "center" },
  resultHeader: { alignItems: "center", marginBottom: spacing.xl },
  iconCircle: { width: 70, height: 70, borderRadius: 35, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  resultTitle: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, textAlign: "center" },
  resultSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4, textAlign: "center" },
  matchCard: { marginBottom: spacing.lg, position: "relative" },
  topBadge: { position: "absolute", top: -10, left: spacing.md, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.full, zIndex: 1 },
  topBadgeText: { fontSize: 10, color: "#FFF", fontWeight: "800", letterSpacing: 0.5 },
  matchRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.md, marginTop: 4 },
  matchEmoji: { fontSize: 40 },
  matchName: { fontSize: fontSize.lg, fontWeight: "800", color: colors.text },
  matchOrigin: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  scoreNum: { fontSize: fontSize.xxl, fontWeight: "800" },
  scoreLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: -4 },
  matchDesc: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.md },
  whyBox: { marginBottom: spacing.sm, padding: spacing.md, backgroundColor: colors.primary + "10", borderRadius: radius.md },
  whyLabel: { fontSize: 10, fontWeight: "800", color: colors.primary, letterSpacing: 0.5, marginBottom: 6 },
  whyItem: { fontSize: fontSize.sm, marginBottom: 2, lineHeight: 19 },
  warningBox: { padding: spacing.md, borderRadius: radius.md, borderWidth: 1, marginBottom: spacing.md },
  warningHeader: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 },
  costRow: { flexDirection: "row", gap: spacing.lg, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.borderLight, flexWrap: "wrap" },
  costItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  costText: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: "600" },
});
