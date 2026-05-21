import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Send, AlertTriangle, AlertCircle, Eye, Home, Sparkles, RotateCcw } from "lucide-react-native";
import { useColors, useTheme } from "../src/contexts/ThemeContext";
import { usePet } from "../src/contexts/PetContext";
import { Card } from "../src/components/ui/Card";
import { Button } from "../src/components/ui/Button";
import { GradientBackground } from "../src/components/ui/GradientBackground";
import { API_ENDPOINTS } from "../src/config/api";
import { spacing, radius, fontSize } from "../src/theme/spacing";

interface Verdict {
  severity: "emergency" | "urgent" | "monitor" | "at_home";
  headline: string;
  what_to_do: string[];
  red_flags: string[];
  likely_causes: string[];
}

interface Turn {
  role: "user" | "ai";
  text: string;
  options?: string[];
  verdict?: Verdict;
}

const SEVERITY_CONFIG = {
  emergency: { label: "EMERGENCY", color: "#EF4444", bg: "#7F1D1D", Icon: AlertTriangle, action: "Go to vet ER now" },
  urgent:    { label: "URGENT",    color: "#F59E0B", bg: "#78350F", Icon: AlertCircle,   action: "See vet within 24h" },
  monitor:   { label: "MONITOR",   color: "#FBBF24", bg: "#854D0E", Icon: Eye,           action: "Watch closely, vet in 3-5d if not improving" },
  at_home:   { label: "AT HOME",   color: "#22C55E", bg: "#14532D", Icon: Home,          action: "Home care should be enough" },
};

const QUICK_SYMPTOMS = [
  "Vomiting",
  "Diarrhea",
  "Not eating",
  "Limping",
  "Scratching a lot",
  "Lethargic",
  "Coughing",
  "Eye discharge",
  "Skin issue",
  "Bleeding",
  "Trouble breathing",
  "Behavior change",
];

export default function TriageScreen() {
  const router = useRouter();
  const colors = useColors();
  const { theme } = useTheme();
  const { activePet } = usePet();
  const styles = useStyles(colors);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"live" | "mock" | "unknown">("unknown");
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [turns, loading]);

  const send = async (message: string) => {
    if (!message.trim()) return;
    const userTurn: Turn = { role: "user", text: message };
    setTurns((t) => [...t, userTurn]);
    setInput("");
    setLoading(true);

    try {
      const history = turns.map((t) => ({ role: (t.role === "ai" ? "assistant" : "user") as "user" | "assistant", content: t.text }));
      const res = await fetch(API_ENDPOINTS.triage, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history,
          petContext: { name: activePet.name, species: activePet.species, breed: activePet.breed, age: activePet.age },
        }),
      });
      const data = await res.json();
      setMode(data.mode_label === "live" ? "live" : "mock");

      const aiTurn: Turn = { role: "ai", text: data.message, options: data.options, verdict: data.verdict };
      setTurns((t) => [...t, aiTurn]);
    } catch {
      setTurns((t) => [...t, { role: "ai", text: "Network error. Please try again or contact your vet directly." }]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setTurns([]); setInput(""); };

  const verdictTurn = turns.find((t) => t.verdict);
  const verdict = verdictTurn?.verdict;
  const sev = verdict ? SEVERITY_CONFIG[verdict.severity] : null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.palette.background }}>
      <Stack.Screen options={{
        headerShown: true,
        title: "Symptom Triage",
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
            <ArrowLeft size={22} color={colors.text} />
          </TouchableOpacity>
        ),
        headerRight: () => turns.length > 0 ? (
          <TouchableOpacity onPress={reset} style={{ padding: 8 }}>
            <RotateCcw size={20} color={colors.text} />
          </TouchableOpacity>
        ) : null,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: "700", color: colors.text },
        headerTintColor: colors.text,
      }} />

      <GradientBackground>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={80}>
          <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>

            {turns.length === 0 && (
              <View>
                <View style={[styles.heroIcon, { backgroundColor: colors.primary + "20" }]}>
                  <Sparkles size={28} color={colors.primary} />
                </View>
                <Text style={styles.heroTitle}>What's wrong with {activePet.name}?</Text>
                <Text style={styles.heroSub}>I'll ask 3-5 quick questions, then tell you how urgent it is and what to do.</Text>

                <View style={styles.modePill}>
                  <View style={[styles.dot, { backgroundColor: mode === "live" ? colors.primary : "#F59E0B" }]} />
                  <Text style={[styles.modeText, mode === "live" && { color: colors.primary }]}>
                    {mode === "live" ? "Live Claude" : "Demo mode"}
                  </Text>
                </View>

                <Text style={styles.sectionTitle}>Common symptoms</Text>
                <View style={styles.chipRow}>
                  {QUICK_SYMPTOMS.map((s) => (
                    <TouchableOpacity key={s} style={[styles.chip, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={() => send(s)}>
                      <Text style={[styles.chipText, { color: colors.text }]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[styles.heroSub, { marginTop: spacing.lg, textAlign: "center" }]}>...or type what's happening below ↓</Text>
              </View>
            )}

            {turns.map((t, idx) => (
              <View key={idx} style={[styles.turn, t.role === "user" && styles.turnUser]}>
                <View style={[
                  styles.bubble,
                  t.role === "user" ? { backgroundColor: colors.primary } : { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
                ]}>
                  <Text style={[styles.bubbleText, t.role === "user" && { color: "#fff" }]}>{t.text}</Text>
                </View>

                {t.options && t.options.length > 0 && (
                  <View style={styles.optionsCol}>
                    {t.options.map((opt) => (
                      <TouchableOpacity key={opt} style={[styles.optionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => send(opt)}>
                        <Text style={[styles.optionText, { color: colors.text }]}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {t.verdict && sev && (
                  <View style={[styles.verdictCard, { backgroundColor: sev.color + "15", borderColor: sev.color }]}>
                    <View style={[styles.verdictHeader, { backgroundColor: sev.color }]}>
                      <sev.Icon size={20} color="#fff" />
                      <Text style={styles.verdictLabel}>{sev.label}</Text>
                    </View>
                    <View style={styles.verdictBody}>
                      <Text style={[styles.verdictHeadline, { color: colors.text }]}>{t.verdict.headline}</Text>
                      <Text style={[styles.verdictAction, { color: sev.color }]}>{sev.action}</Text>

                      {t.verdict.what_to_do.length > 0 && (
                        <View style={styles.verdictSection}>
                          <Text style={[styles.verdictSubtitle, { color: colors.textSecondary }]}>WHAT TO DO</Text>
                          {t.verdict.what_to_do.map((step, i) => (
                            <Text key={i} style={[styles.verdictItem, { color: colors.text }]}>{i + 1}. {step}</Text>
                          ))}
                        </View>
                      )}

                      {t.verdict.red_flags.length > 0 && (
                        <View style={styles.verdictSection}>
                          <Text style={[styles.verdictSubtitle, { color: colors.danger }]}>⚠ RED FLAGS — call vet immediately if you see</Text>
                          {t.verdict.red_flags.map((flag, i) => (
                            <Text key={i} style={[styles.verdictItem, { color: colors.text }]}>• {flag}</Text>
                          ))}
                        </View>
                      )}

                      {t.verdict.likely_causes.length > 0 && (
                        <View style={styles.verdictSection}>
                          <Text style={[styles.verdictSubtitle, { color: colors.textSecondary }]}>POSSIBLE CAUSES</Text>
                          {t.verdict.likely_causes.map((c, i) => (
                            <Text key={i} style={[styles.verdictItem, { color: colors.textSecondary }]}>• {c}</Text>
                          ))}
                        </View>
                      )}

                      <View style={styles.verdictActions}>
                        <Button title="Start over" variant="outline" size="sm" icon={<RotateCcw size={14} color={colors.text} />} onPress={reset} />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}

            {loading && (
              <View style={styles.turn}>
                <View style={[styles.bubble, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: spacing.sm }]}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={[styles.bubbleText, { color: colors.textSecondary }]}>Thinking...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {!verdict && (
            <View style={[styles.inputRow, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text }]}
                value={input}
                onChangeText={setInput}
                placeholder="Type what's happening..."
                placeholderTextColor={colors.textTertiary}
                onSubmitEditing={() => send(input)}
                returnKeyType="send"
                editable={!loading}
              />
              <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.primary, opacity: input.trim() && !loading ? 1 : 0.5 }]} onPress={() => send(input)} disabled={!input.trim() || loading}>
                <Send size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </GradientBackground>
    </View>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  heroIcon: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", marginBottom: spacing.md, marginTop: spacing.lg },
  heroTitle: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, letterSpacing: -0.02 * fontSize.xxl, marginBottom: spacing.sm },
  heroSub: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.lg },
  modePill: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.full, backgroundColor: "#F59E0B20", marginBottom: spacing.xl },
  dot: { width: 6, height: 6, borderRadius: 3 },
  modeText: { fontSize: 10, fontWeight: "700", color: "#F59E0B", letterSpacing: 0.5 },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: "700", color: colors.textTertiary, textTransform: "uppercase", letterSpacing: 0.08 * fontSize.xs, marginBottom: spacing.md },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1 },
  chipText: { fontSize: fontSize.sm, fontWeight: "600" },
  turn: { marginBottom: spacing.md, alignItems: "flex-start" },
  turnUser: { alignItems: "flex-end" },
  bubble: { maxWidth: "88%", paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderRadius: radius.xl },
  bubbleText: { fontSize: fontSize.md, color: colors.text, lineHeight: 22 },
  optionsCol: { marginTop: spacing.sm, gap: spacing.sm, alignSelf: "stretch" },
  optionBtn: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radius.lg, borderWidth: 1 },
  optionText: { fontSize: fontSize.md, fontWeight: "600" },
  verdictCard: { marginTop: spacing.md, borderRadius: radius.xl, borderWidth: 2, overflow: "hidden", alignSelf: "stretch" },
  verdictHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  verdictLabel: { color: "#fff", fontSize: fontSize.md, fontWeight: "800", letterSpacing: 0.06 * fontSize.md },
  verdictBody: { padding: spacing.lg, gap: spacing.md },
  verdictHeadline: { fontSize: fontSize.lg, fontWeight: "700", lineHeight: 24 },
  verdictAction: { fontSize: fontSize.sm, fontWeight: "700" },
  verdictSection: { gap: 4 },
  verdictSubtitle: { fontSize: 11, fontWeight: "800", letterSpacing: 0.05 * 11, marginBottom: 4 },
  verdictItem: { fontSize: fontSize.sm, lineHeight: 22 },
  verdictActions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  inputRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, borderTopWidth: 1 },
  input: { flex: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.xl, fontSize: fontSize.md },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
