import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Camera, Image as ImgIcon, Sparkles, Heart, Activity, Eye, AlertTriangle, FlaskConical } from "lucide-react-native";
import { useColors, useTheme } from "../src/contexts/ThemeContext";
import { usePet } from "../src/contexts/PetContext";
import { Card } from "../src/components/ui/Card";
import { Button } from "../src/components/ui/Button";
import { Badge } from "../src/components/ui/Badge";
import { GradientBackground } from "../src/components/ui/GradientBackground";
import { pickFromGallery, takePhoto } from "../src/services/photos";
import { API_ENDPOINTS } from "../src/config/api";
import { spacing, radius, fontSize } from "../src/theme/spacing";

interface PetAnalysis {
  breed: { name: string; confidence: number };
  age_estimate: string;
  body_condition: { score: number; label: string; note: string };
  coat: { condition: string; note: string };
  concerns: string[];
  mood: string;
  summary: string;
  mode_label?: string;
}

interface LabAnalysis {
  test_name: string;
  panels: Array<{ name: string; value: number; unit: string; ref_low?: number; ref_high?: number; status: string }>;
  overall_status: string;
  summary: string;
  concerning_values: string[];
  recommendations: string[];
  vet_questions: string[];
  mode_label?: string;
}

export default function VisionScreen() {
  const { mode = "pet" } = useLocalSearchParams<{ mode?: "pet" | "lab" }>();
  const router = useRouter();
  const colors = useColors();
  const { theme } = useTheme();
  const { activePet } = usePet();
  const styles = useStyles(colors);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PetAnalysis | LabAnalysis | null>(null);

  const isLab = mode === "lab";

  const pickGallery = async () => {
    const r = await pickFromGallery({ base64: true, aspect: isLab ? [3, 4] : [1, 1] });
    if (r?.uri) { setImageUri(r.uri); setImageBase64(r.base64 ?? null); setAnalysis(null); }
  };
  const captureCamera = async () => {
    const r = await takePhoto({ base64: true, aspect: isLab ? [3, 4] : [1, 1] });
    if (r?.uri) { setImageUri(r.uri); setImageBase64(r.base64 ?? null); setAnalysis(null); }
  };

  const analyze = async () => {
    if (!imageBase64) { Alert.alert("Pick a photo first"); return; }
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.vision, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          mode: isLab ? "lab" : "pet",
          petContext: { name: activePet.name, species: activePet.species, breed: activePet.breed, age: activePet.age },
        }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (e) {
      Alert.alert("Error", "AI vision request failed.");
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.palette.background }}>
      <Stack.Screen options={{
        headerShown: true,
        title: isLab ? "Lab Decoder" : "AI Photo Analysis",
        headerLeft: () => <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}><ArrowLeft size={22} color={colors.text} /></TouchableOpacity>,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: "700", color: colors.text },
        headerTintColor: colors.text,
      }} />
      <GradientBackground>
        <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={[styles.heroIcon, { backgroundColor: colors.primary + "20" }]}>
              {isLab ? <FlaskConical size={28} color={colors.primary} /> : <Sparkles size={28} color={colors.primary} />}
            </View>
            <Text style={styles.heroTitle}>{isLab ? "Decode lab results" : "Photo health analysis"}</Text>
            <Text style={styles.heroSub}>{isLab ? "Upload a photo of bloodwork or any vet report. Claude reads it and explains in plain English." : "Upload a photo of your pet. AI detects breed, body condition, coat health, and visible concerns."}</Text>

            {/* Image preview */}
            {imageUri ? (
              <View style={styles.imageBox}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
              </View>
            ) : (
              <View style={[styles.imagePlaceholder, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <ImgIcon size={36} color={colors.textTertiary} />
                <Text style={{ color: colors.textTertiary, marginTop: 8 }}>No photo selected</Text>
              </View>
            )}

            <View style={styles.actionsRow}>
              <Button title="Camera" variant="outline" icon={<Camera size={16} color={colors.text} />} onPress={captureCamera} style={{ flex: 1 }} />
              <Button title="Gallery" variant="outline" icon={<ImgIcon size={16} color={colors.text} />} onPress={pickGallery} style={{ flex: 1 }} />
            </View>

            {imageUri && (
              <Button
                title={loading ? "Analyzing..." : `Analyze with AI`}
                onPress={analyze}
                disabled={loading}
                icon={loading ? <ActivityIndicator size="small" color="#fff" /> : <Sparkles size={16} color="#fff" />}
                style={{ marginTop: spacing.md }}
              />
            )}

            {/* Results */}
            {analysis && !isLab && "breed" in analysis && (
              <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
                <View style={styles.modePill}>
                  <View style={[styles.dot, { backgroundColor: analysis.mode_label === "live" ? colors.primary : "#F59E0B" }]} />
                  <Text style={[styles.modeText, analysis.mode_label === "live" && { color: colors.primary }]}>
                    {analysis.mode_label === "live" ? "Claude Vision" : "Demo mode"}
                  </Text>
                </View>

                <Card variant="elevated">
                  <Text style={[styles.summary, { color: colors.text }]}>{analysis.summary}</Text>
                </Card>

                <Card>
                  <View style={styles.row}>
                    <Activity size={18} color={colors.primary} />
                    <Text style={styles.rowLabel}>Breed</Text>
                    <Text style={styles.rowValue}>{analysis.breed.name}</Text>
                    <Badge label={`${analysis.breed.confidence}%`} variant="info" />
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.row}>
                    <Heart size={18} color="#EC4899" />
                    <Text style={styles.rowLabel}>Age</Text>
                    <Text style={styles.rowValue}>{analysis.age_estimate}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.row}>
                    <Activity size={18} color="#22C55E" />
                    <Text style={styles.rowLabel}>Body</Text>
                    <Text style={styles.rowValue}>{analysis.body_condition.score}/9 · {analysis.body_condition.label}</Text>
                  </View>
                  {analysis.body_condition.note && <Text style={styles.note}>{analysis.body_condition.note}</Text>}
                  <View style={styles.divider} />
                  <View style={styles.row}>
                    <Eye size={18} color="#0EA5E9" />
                    <Text style={styles.rowLabel}>Mood</Text>
                    <Text style={styles.rowValue}>{analysis.mood}</Text>
                  </View>
                </Card>

                <Card>
                  <Text style={styles.sectionLabel}>Coat condition</Text>
                  <Text style={styles.note}>{analysis.coat.condition} · {analysis.coat.note}</Text>
                </Card>

                {analysis.concerns.length > 0 && (
                  <Card style={{ borderColor: colors.warning, borderWidth: 1 }}>
                    <View style={styles.warningHeader}>
                      <AlertTriangle size={16} color={colors.warning} />
                      <Text style={[styles.sectionLabel, { color: colors.warning }]}>VISIBLE CONCERNS</Text>
                    </View>
                    {analysis.concerns.map((c, i) => <Text key={i} style={[styles.note, { color: colors.text }]}>• {c}</Text>)}
                  </Card>
                )}
              </View>
            )}

            {analysis && isLab && "panels" in analysis && (
              <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
                <View style={styles.modePill}>
                  <View style={[styles.dot, { backgroundColor: analysis.mode_label === "live" ? colors.primary : "#F59E0B" }]} />
                  <Text style={[styles.modeText, analysis.mode_label === "live" && { color: colors.primary }]}>
                    {analysis.mode_label === "live" ? "Claude Vision" : "Demo mode"}
                  </Text>
                </View>

                <Card variant="elevated">
                  <Text style={styles.testName}>{analysis.test_name}</Text>
                  <Badge label={analysis.overall_status.replace("_", " ")} variant={analysis.overall_status === "urgent" ? "danger" : analysis.overall_status === "needs_followup" ? "warning" : "success"} />
                  <Text style={[styles.summary, { color: colors.text, marginTop: spacing.md }]}>{analysis.summary}</Text>
                </Card>

                <Card>
                  <Text style={styles.sectionLabel}>VALUES</Text>
                  {analysis.panels.map((p, i) => (
                    <View key={i} style={styles.panelRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.panelName}>{p.name}</Text>
                        <Text style={styles.panelRef}>Ref: {p.ref_low}-{p.ref_high} {p.unit}</Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={[styles.panelValue, { color: p.status === "normal" ? colors.primary : p.status === "critical" ? colors.danger : colors.warning }]}>
                          {p.value} {p.unit}
                        </Text>
                        <Badge label={p.status} variant={p.status === "normal" ? "success" : p.status === "critical" ? "danger" : "warning"} />
                      </View>
                    </View>
                  ))}
                </Card>

                {analysis.recommendations.length > 0 && (
                  <Card>
                    <Text style={styles.sectionLabel}>RECOMMENDATIONS</Text>
                    {analysis.recommendations.map((r, i) => <Text key={i} style={styles.note}>{i + 1}. {r}</Text>)}
                  </Card>
                )}

                {analysis.vet_questions.length > 0 && (
                  <Card style={{ backgroundColor: colors.primary + "12" }}>
                    <Text style={[styles.sectionLabel, { color: colors.primary }]}>ASK YOUR VET</Text>
                    {analysis.vet_questions.map((q, i) => <Text key={i} style={styles.note}>• {q}</Text>)}
                  </Card>
                )}
              </View>
            )}

          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
    </View>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  heroIcon: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", marginBottom: spacing.md, marginTop: spacing.lg },
  heroTitle: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, letterSpacing: -0.02 * fontSize.xxl, marginBottom: spacing.sm },
  heroSub: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.lg },
  imageBox: { aspectRatio: 1, borderRadius: radius.xl, overflow: "hidden", marginBottom: spacing.md },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: { aspectRatio: 1, borderRadius: radius.xl, borderWidth: 2, borderStyle: "dashed", alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  actionsRow: { flexDirection: "row", gap: spacing.sm },
  modePill: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.full, backgroundColor: "#F59E0B20" },
  dot: { width: 6, height: 6, borderRadius: 3 },
  modeText: { fontSize: 10, fontWeight: "700", color: "#F59E0B", letterSpacing: 0.5 },
  summary: { fontSize: fontSize.md, lineHeight: 22 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: spacing.sm },
  rowLabel: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: "500", width: 60 },
  rowValue: { fontSize: fontSize.sm, color: colors.text, fontWeight: "700", flex: 1 },
  divider: { height: 1, backgroundColor: colors.borderLight },
  note: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20, marginTop: 4 },
  sectionLabel: { fontSize: 11, fontWeight: "800", color: colors.textTertiary, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: spacing.sm },
  warningHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  testName: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  panelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.borderLight },
  panelName: { fontSize: fontSize.sm, fontWeight: "700", color: colors.text },
  panelRef: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 2 },
  panelValue: { fontSize: fontSize.md, fontWeight: "800", marginBottom: 4 },
});
