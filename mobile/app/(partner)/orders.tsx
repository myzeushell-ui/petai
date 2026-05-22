import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Calendar, ChevronRight } from "lucide-react-native";
import { useColors, useTheme } from "../../src/contexts/ThemeContext";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { GradientBackground } from "../../src/components/ui/GradientBackground";
import { useT } from "../../src/i18n";
import { mockOrders, Order } from "../../src/data/partnerData";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

const STATUS_FILTERS: { id: Order["status"] | "all"; label: string }[] = [
  { id: "new", label: "New" },
  { id: "accepted", label: "Accepted" },
  { id: "in_progress", label: "In progress" },
  { id: "completed", label: "Completed" },
  { id: "all", label: "All" },
];

const STATUS_COLORS: Record<Order["status"], "default" | "warning" | "info" | "success" | "danger"> = {
  new: "danger", accepted: "info", in_progress: "warning", completed: "success", cancelled: "default",
};

export default function PartnerOrdersScreen() {
  const router = useRouter();
  const colors = useColors();
  const { theme } = useTheme();
  const t = useT();
  const styles = useStyles(colors);
  const [filter, setFilter] = useState<Order["status"] | "all">("new");

  const filtered = filter === "all" ? mockOrders : mockOrders.filter((o) => o.status === filter);

  return (
    <View style={{ flex: 1, backgroundColor: theme.palette.background }}>
      <GradientBackground>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("partner_orders")}</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
            {STATUS_FILTERS.map((f) => (
              <TouchableOpacity key={f.id} onPress={() => setFilter(f.id)} style={[styles.filterChip, filter === f.id && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                <Text style={[styles.filterText, filter === f.id && { color: "#fff" }]}>{f.label} {f.id !== "all" && `(${mockOrders.filter((o) => o.status === f.id).length})`}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FlatList
            data={filtered}
            keyExtractor={(o) => o.id}
            contentContainerStyle={styles.list}
            renderItem={({ item: o }) => (
              <TouchableOpacity activeOpacity={0.85} onPress={() => router.push(`/order/${o.id}`)}>
                <Card variant="elevated" style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.service}>{o.service}</Text>
                      <Text style={styles.customer}>{o.customerName}</Text>
                      <Text style={styles.pet}>{o.petName} · {o.petBreed}</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={[styles.price, { color: colors.primary }]}>${o.price}</Text>
                      <Badge label={o.status.replace("_", " ")} variant={STATUS_COLORS[o.status]} />
                    </View>
                  </View>
                  {o.scheduledFor && (
                    <View style={styles.timeRow}>
                      <Calendar size={12} color={colors.textSecondary} />
                      <Text style={styles.time}>{new Date(o.scheduledFor).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</Text>
                    </View>
                  )}
                  {o.notes && <Text style={styles.notes} numberOfLines={2}>{o.notes}</Text>}
                  <View style={styles.cardFooter}>
                    <Text style={[styles.detailsLink, { color: colors.primary }]}>{t("order_details")}</Text>
                    <ChevronRight size={14} color={colors.primary} />
                  </View>
                </Card>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </GradientBackground>
    </View>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  title: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, letterSpacing: -0.02 * fontSize.xxl },
  filterScroll: { maxHeight: 50, marginBottom: spacing.sm },
  filterRow: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filterText: { fontSize: fontSize.sm, fontWeight: "600", color: colors.text },
  list: { padding: spacing.lg, paddingTop: 0 },
  card: { marginBottom: spacing.md, gap: spacing.sm },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.md },
  service: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  customer: { fontSize: fontSize.sm, color: colors.text, marginTop: 4, fontWeight: "600" },
  pet: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  price: { fontSize: fontSize.lg, fontWeight: "800", marginBottom: 4 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  time: { fontSize: fontSize.xs, color: colors.textSecondary },
  notes: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 18 },
  cardFooter: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  detailsLink: { fontSize: fontSize.xs, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
});
