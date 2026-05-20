import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ChevronRight, Heart, Bot, FlaskConical, Sparkles } from "lucide-react-native";
import { useColors } from "../src/contexts/ThemeContext";
import { spacing, radius, fontSize } from "../src/theme/spacing";

const { width } = Dimensions.get("window");

const slides = [
  {
    emoji: "🐾",
    title: "Welcome to PetAI",
    body: "The AI-powered health platform that keeps your pet thriving — from puppy to senior.",
    color: "#22c55e",
  },
  {
    Icon: Bot,
    title: "AI vet on demand",
    body: "Get instant answers about your pet's health, behavior, and care. Trained on veterinary literature.",
    color: "#6366F1",
  },
  {
    Icon: FlaskConical,
    title: "Decode lab results",
    body: "Upload bloodwork and we'll translate medical jargon into plain English with personalized recommendations.",
    color: "#0EA5E9",
  },
  {
    Icon: Heart,
    title: "Everything in one place",
    body: "Reminders, breeding, marketplace, vet consultations — your pet's entire life, organized.",
    color: "#EC4899",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const colors = useColors();
  const styles = useStyles(colors);
  const [step, setStep] = useState(0);
  const slide = slides[step];
  const Icon = (slide as any).Icon;

  const next = () => {
    if (step === slides.length - 1) {
      router.replace("/(tabs)");
    } else {
      setStep(step + 1);
    }
  };

  const skip = () => router.replace("/(tabs)");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: slide.color + "08" }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        {step < slides.length - 1 && (
          <TouchableOpacity onPress={skip}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: slide.color }]}>
          {slide.emoji ? (
            <Text style={styles.emojiBig}>{slide.emoji}</Text>
          ) : (
            <Icon size={60} color="#FFF" strokeWidth={2.5} />
          )}
        </View>

        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>

        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === step && { backgroundColor: slide.color, width: 24 },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={next}
          style={[styles.button, { backgroundColor: slide.color }]}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>
            {step === slides.length - 1 ? "Get Started" : "Continue"}
          </Text>
          <ChevronRight size={20} color="#FFF" />
        </TouchableOpacity>

        {step === slides.length - 1 && (
          <View style={styles.disclaimerWrap}>
            <Sparkles size={12} color={colors.textTertiary} />
            <Text style={styles.disclaimer}>No sign-up required to try</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: spacing.lg, paddingTop: spacing.md, height: 44 },
  skip: { fontSize: fontSize.md, color: colors.textSecondary, fontWeight: "600", padding: spacing.sm },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xxl },
  iconCircle: { width: 140, height: 140, borderRadius: 70, alignItems: "center", justifyContent: "center", marginBottom: spacing.xxxl },
  emojiBig: { fontSize: 70 },
  title: { fontSize: 32, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: spacing.md },
  body: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: "center", lineHeight: 24, maxWidth: width * 0.85 },
  dots: { flexDirection: "row", gap: 6, marginTop: spacing.xxxl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  footer: { padding: spacing.xl, gap: spacing.md },
  button: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: spacing.lg, borderRadius: radius.xl, gap: spacing.sm },
  buttonText: { fontSize: fontSize.lg, color: "#FFF", fontWeight: "700" },
  disclaimerWrap: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 },
  disclaimer: { fontSize: fontSize.xs, color: colors.textTertiary, textAlign: "center" },
});
