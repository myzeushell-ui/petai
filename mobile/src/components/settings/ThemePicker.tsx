import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { THEME_LIST, ThemeId, Theme } from "../../theme/themes";
import { spacing, radius, fontSize } from "../../theme/spacing";

export function ThemePicker() {
  const { themeId, setTheme, colors } = useTheme();

  const groups = ["Premium Wellness", "Glass iOS"] as const;

  return (
    <View>
      {groups.map((group) => (
        <View key={group} style={{ marginBottom: spacing.lg }}>
          <Text style={[styles.groupTitle, { color: colors.textTertiary }]}>{group.toUpperCase()}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {THEME_LIST.filter((t) => t.group === group).map((t) => (
              <ThemeCard
                key={t.id}
                theme={t}
                active={t.id === themeId}
                onPress={() => setTheme(t.id)}
                outline={colors.border}
              />
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}

function ThemeCard({ theme, active, onPress, outline }: { theme: Theme; active: boolean; onPress: () => void; outline: string }) {
  const { colors: currentPaletteColors } = useTheme();
  const isGlass = theme.style === "glass";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.card, { borderColor: active ? theme.palette.primary : outline, borderWidth: active ? 3 : 1.5 }]}>
      {/* Preview */}
      <View style={[styles.preview, { backgroundColor: isGlass ? theme.gradient?.base ?? theme.palette.background : theme.palette.background }]}>
        {isGlass && theme.gradient && (
          <>
            {theme.gradient.blobs.slice(0, 3).map((b, i) => (
              <View key={i} style={{
                position: "absolute",
                left: `${b.x - 30}%`,
                top: `${b.y - 30}%`,
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: b.color,
                opacity: b.opacity * 0.9,
              }} />
            ))}
          </>
        )}
        {/* Sample tiles */}
        <View style={styles.previewContent}>
          <View style={[styles.previewTile, isGlass ? styles.glassTile : { backgroundColor: theme.palette.surface }]}>
            <View style={[styles.dot, { backgroundColor: theme.palette.primary }]} />
            <View style={[styles.bar, { backgroundColor: isGlass ? "rgba(255,255,255,0.2)" : theme.palette.borderLight }]} />
            <View style={[styles.bar, { backgroundColor: isGlass ? "rgba(255,255,255,0.12)" : theme.palette.borderLight, width: "60%" }]} />
          </View>
          {theme.accentGradient && (
            <LinearGradient
              colors={theme.accentGradient as any}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[styles.previewTile, { padding: 6 }]}
            >
              <View style={[styles.bar, { backgroundColor: "rgba(255,255,255,0.55)", width: "70%" }]} />
              <View style={[styles.bar, { backgroundColor: "rgba(255,255,255,0.3)", width: "40%" }]} />
            </LinearGradient>
          )}
        </View>

        {/* Active checkmark */}
        {active && (
          <View style={[styles.checkBadge, { backgroundColor: theme.palette.primary }]}>
            <Check size={12} color="#fff" strokeWidth={3} />
          </View>
        )}
      </View>

      {/* Label */}
      <View style={{ paddingHorizontal: 8, paddingTop: 8, paddingBottom: 6 }}>
        <Text style={[styles.cardTitle, { color: currentPaletteColors.text }]}>{theme.id} · {theme.name}</Text>
        <Text style={[styles.cardDesc, { color: currentPaletteColors.textSecondary }]} numberOfLines={1}>{theme.description}</Text>
      </View>

      {/* Swatches */}
      <View style={styles.swatchRow}>
        {theme.swatches.map((c, i) => (
          <View key={i} style={[styles.swatch, { backgroundColor: c }]} />
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  groupTitle: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: spacing.sm, marginLeft: spacing.sm },
  row: { paddingHorizontal: spacing.sm, paddingBottom: 4, gap: spacing.md },
  card: { width: 160, borderRadius: radius.xl, overflow: "hidden", marginRight: spacing.md },
  preview: { aspectRatio: 9 / 12, position: "relative", overflow: "hidden" },
  previewContent: { padding: 10, gap: 8, position: "absolute", inset: 0 } as any,
  previewTile: { borderRadius: 10, padding: 8, gap: 4 },
  glassTile: { backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" },
  dot: { width: 16, height: 16, borderRadius: 8, marginBottom: 4 },
  bar: { height: 4, borderRadius: 2, width: "80%" },
  checkBadge: { position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "rgba(255,255,255,0.95)" },
  cardTitle: { fontSize: fontSize.sm, fontWeight: "700" },
  cardDesc: { fontSize: 10, marginTop: 2 },
  swatchRow: { flexDirection: "row", padding: 8, paddingTop: 0, gap: 4 },
  swatch: { flex: 1, height: 6, borderRadius: 3 },
});
