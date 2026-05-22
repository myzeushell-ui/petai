import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Calendar, Clock, Lock } from "lucide-react-native";
import { useColors, useTheme } from "../../src/contexts/ThemeContext";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { GradientBackground } from "../../src/components/ui/GradientBackground";
import { mockOrders } from "../../src/data/partnerData";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 → 18
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PartnerSchedule() {
  const router = useRouter();
  const colors = useColors();
  const { theme } = useTheme();
  const styles = useStyles(colors);
  const [blocked, setBlocked] = useState<Set<string>>(new Set());

  // Map orders to day×hour cells
  const bookedSlots = useMemo(() => {
    const m = new Map<string, typeof mockOrders[0]>();
    mockOrders.forEach((o) => {
      if (!o.scheduledFor) return;
      const d = new Date(o.scheduledFor);
      const day = (d.getDay() + 6) % 7; // Mon=0
      const hour = d.getHours();
      m.set(`${day}-${hour}`, o);
    });
    return m;
  }, []);

  const toggleBlock = (key: string) => {
    setBlocked((s) => {
      const n = new Set(s);
      if (n.has(key)) n.delete(key); else n.add(key);
      return n;
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.palette.background }}>
      <GradientBackground>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <View style={styles.header}>
            <Text style={styles.title}>This week</Text>
            <Text style={styles.sub}>Tap a slot to block / unblock</Text>
          </View>

          <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
            <Card variant="elevated">
              <View style={styles.headerRow}>
                <View style={[styles.cell, styles.headerCell]} />
                {DAYS.map((d, i) => (
                  <View key={d} style={[styles.cell, styles.headerCell, i >= 5 && { backgroundColor: colors.primary + "10" }]}>
                    <Text style={[styles.headerText, { color: colors.text }]}>{d}</Text>
                  </View>
                ))}
              </View>
              {HOURS.map((hour) => (
                <View key={hour} style={styles.row}>
                  <View style={[styles.cell, styles.hourCell]}>
                    <Text style={styles.hourText}>{hour}:00</Text>
                  </View>
                  {DAYS.map((_, dayIdx) => {
                    const key = `${dayIdx}-${hour}`;
                    const booked = bookedSlots.get(key);
                    const isBlocked = blocked.has(key);
                    return (
                      <TouchableOpacity
                        key={key}
                        onPress={() => booked ? router.push(`/order/${booked.id}`) : toggleBlock(key)}
                        style={[
                          styles.cell, styles.dataCell,
                          booked && { backgroundColor: colors.primary + "30", borderColor: colors.primary },
                          isBlocked && { backgroundColor: colors.textTertiary + "30" },
                        ]}
                      >
                        {booked && (
                          <Text style={[styles.bookedText, { color: colors.primary }]} numberOfLines={1}>
                            {booked.petName}
                          </Text>
                        )}
                        {isBlocked && <Lock size={10} color={colors.textTertiary} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </Card>

            <Card style={{ marginTop: spacing.md }}>
              <Text style={styles.legendTitle}>Legend</Text>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary + "30", borderColor: colors.primary }]} />
                <Text style={styles.legendText}>Booked appointment (tap to view)</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: colors.textTertiary + "30" }]} />
                <Text style={styles.legendText}>Blocked (you're unavailable)</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: colors.surface, borderColor: colors.border }]} />
                <Text style={styles.legendText}>Free — bookable</Text>
              </View>
            </Card>
          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
    </View>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  title: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, letterSpacing: -0.02 * fontSize.xxl },
  sub: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  headerRow: { flexDirection: "row" },
  row: { flexDirection: "row" },
  cell: { flex: 1, height: 32, borderWidth: 0.5, borderColor: colors.borderLight, alignItems: "center", justifyContent: "center" },
  headerCell: { backgroundColor: colors.backgroundSecondary, height: 32 },
  headerText: { fontSize: 11, fontWeight: "700" },
  hourCell: { backgroundColor: colors.backgroundSecondary },
  hourText: { fontSize: 10, color: colors.textSecondary, fontWeight: "600" },
  dataCell: { backgroundColor: colors.surface },
  bookedText: { fontSize: 9, fontWeight: "700" },
  legendTitle: { fontSize: 11, fontWeight: "800", color: colors.textTertiary, letterSpacing: 0.5, marginBottom: spacing.sm },
  legendRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  legendDot: { width: 18, height: 18, borderRadius: 4, borderWidth: 1 },
  legendText: { fontSize: fontSize.sm, color: colors.text },
});
