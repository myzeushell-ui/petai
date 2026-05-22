import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RefreshCw, Sparkles } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { usePet } from "../../contexts/PetContext";
import { API_ENDPOINTS } from "../../config/api";
import { spacing, radius, fontSize } from "../../theme/spacing";

interface Insight { title: string; body: string; category: string; emoji: string; mode_label?: string; }

export function DailyInsight() {
  const { theme, colors } = useTheme();
  const { activePet } = usePet();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.insight, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petContext: { name: activePet.name, species: activePet.species, breed: activePet.breed, age: activePet.age, healthScore: activePet.healthScore } }),
      });
      const data = await res.json();
      setInsight(data);
    } catch { /* fallback below */ }
    setLoading(false);
  };

  useEffect(() => { fetchInsight(); }, [activePet.id]);

  if (!insight && !loading) return null;

  return (
    <LinearGradient
      colors={theme.accentGradient ?? [colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={{ borderRadius: radius.xl, padding: 1, marginBottom: spacing.md }}
    >
      <View style={[styles.inner, { backgroundColor: theme.isDark ? "rgba(20,15,40,0.85)" : "rgba(255,255,255,0.92)" }]}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Sparkles size={14} color={colors.primary} />
            <Text style={[styles.label, { color: colors.primary }]}>TODAY'S TIP</Text>
          </View>
          <TouchableOpacity onPress={fetchInsight} disabled={loading} style={{ padding: 4 }}>
            {loading ? <ActivityIndicator size="small" color={colors.primary} /> : <RefreshCw size={14} color={colors.textSecondary} />}
          </TouchableOpacity>
        </View>
        {insight && (
          <>
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
              <Text style={styles.emoji}>{insight.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.text }]}>{insight.title}</Text>
                <Text style={[styles.body, { color: colors.textSecondary }]}>{insight.body}</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  inner: { borderRadius: radius.xl - 1, padding: spacing.lg, gap: spacing.sm },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 11, fontWeight: "800", letterSpacing: 0.8 },
  emoji: { fontSize: 32 },
  title: { fontSize: fontSize.md, fontWeight: "800", marginBottom: 2 },
  body: { fontSize: fontSize.sm, lineHeight: 19 },
});
