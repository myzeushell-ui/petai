import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bell, Settings, ClipboardList, DollarSign, Star, MessageCircle, Calendar, TrendingUp } from "lucide-react-native";
import { useColors, useTheme } from "../../src/contexts/ThemeContext";
import { useRole } from "../../src/contexts/RoleContext";
import { useT } from "../../src/i18n";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { GradientBackground } from "../../src/components/ui/GradientBackground";
import { mockOrders, mockChats, DEFAULT_PROFILES } from "../../src/data/partnerData";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

export default function PartnerDashboard() {
  const router = useRouter();
  const colors = useColors();
  const { theme } = useTheme();
  const { partnerType } = useRole();
  const t = useT();
  const styles = useStyles(colors);
  const profile = DEFAULT_PROFILES[partnerType ?? "veterinarian"];

  const newOrders = mockOrders.filter((o) => o.status === "new");
  const activeOrders = mockOrders.filter((o) => o.status === "accepted" || o.status === "in_progress");
  const completedThisWeek = mockOrders.filter((o) => o.status === "completed");
  const weeklyEarnings = completedThisWeek.reduce((s, o) => s + o.price, 0);
  const totalUnread = mockChats.reduce((s, c) => s + c.unread, 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t("good_morning") : hour < 18 ? t("good_afternoon") : t("good_evening");

  return (
    <View style={{ flex: 1, backgroundColor: theme.palette.background }}>
      <GradientBackground>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>{greeting},</Text>
                <Text style={styles.name}>{profile.name}</Text>
                <Text style={styles.subtitle}>{profile.title}</Text>
              </View>
              <TouchableOpacity style={styles.bellBtn} onPress={() => router.push("/settings")}>
                <Settings size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Metrics grid */}
            <View style={styles.metricsGrid}>
              <Card variant="elevated" style={styles.metric}>
                <View style={[styles.metricIcon, { backgroundColor: "#EF444420" }]}>
                  <ClipboardList size={20} color="#EF4444" />
                </View>
                <Text style={styles.metricValue}>{newOrders.length}</Text>
                <Text style={styles.metricLabel}>{t("new_orders")}</Text>
              </Card>
              <Card variant="elevated" style={styles.metric}>
                <View style={[styles.metricIcon, { backgroundColor: colors.primary + "20" }]}>
                  <DollarSign size={20} color={colors.primary} />
                </View>
                <Text style={styles.metricValue}>${weeklyEarnings}</Text>
                <Text style={styles.metricLabel}>{t("this_week")}</Text>
              </Card>
              <Card variant="elevated" style={styles.metric}>
                <View style={[styles.metricIcon, { backgroundColor: "#F59E0B20" }]}>
                  <Star size={20} color="#F59E0B" />
                </View>
                <Text style={styles.metricValue}>{profile.rating}</Text>
                <Text style={styles.metricLabel}>{t("rating")} ({profile.reviewCount})</Text>
              </Card>
              <Card variant="elevated" style={styles.metric}>
                <View style={[styles.metricIcon, { backgroundColor: "#0EA5E920" }]}>
                  <MessageCircle size={20} color="#0EA5E9" />
                </View>
                <Text style={styles.metricValue}>{totalUnread}</Text>
                <Text style={styles.metricLabel}>Unread</Text>
              </Card>
            </View>

            {/* Upcoming */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t("upcoming_appts")}</Text>
                <TouchableOpacity onPress={() => router.push("/(partner)/orders")}><Text style={styles.viewAll}>{t("view_all")}</Text></TouchableOpacity>
              </View>
              {activeOrders.slice(0, 3).map((o) => (
                <TouchableOpacity key={o.id} onPress={() => router.push(`/order/${o.id}`)}>
                  <Card style={styles.orderCard}>
                    <View style={styles.orderRow}>
                      <View>
                        <Text style={styles.orderService}>{o.service}</Text>
                        <Text style={styles.orderCustomer}>{o.customerName} · {o.petName} ({o.petBreed})</Text>
                        {o.scheduledFor && (
                          <View style={styles.timeRow}>
                            <Calendar size={12} color={colors.textSecondary} />
                            <Text style={styles.orderTime}>{new Date(o.scheduledFor).toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })}</Text>
                          </View>
                        )}
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={[styles.orderPrice, { color: colors.primary }]}>${o.price}</Text>
                        <Badge label={o.status} variant={o.status === "in_progress" ? "warning" : "info"} />
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>

            {/* Recent chats */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t("recent_chats")}</Text>
                <TouchableOpacity onPress={() => router.push("/(partner)/chats")}><Text style={styles.viewAll}>{t("view_all")}</Text></TouchableOpacity>
              </View>
              {mockChats.slice(0, 3).map((c) => (
                <TouchableOpacity key={c.id} onPress={() => router.push(`/chat/${c.id}`)}>
                  <Card style={styles.chatCard}>
                    <View style={styles.chatRow}>
                      <View style={[styles.chatAvatar, { backgroundColor: colors.primary + "30" }]}>
                        <Text style={{ fontSize: 18, fontWeight: "800", color: colors.primary }}>{c.customerName[0]}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.chatName}>{c.customerName} · {c.petName}</Text>
                        <Text style={styles.chatLast} numberOfLines={1}>{c.lastMessage}</Text>
                      </View>
                      {c.unread > 0 && <View style={[styles.unread, { backgroundColor: colors.primary }]}><Text style={styles.unreadText}>{c.unread}</Text></View>}
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 32 }} />
          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
    </View>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.lg },
  greeting: { fontSize: fontSize.sm, color: colors.textSecondary },
  name: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, letterSpacing: -0.02 * fontSize.xxl },
  subtitle: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  bellBtn: { padding: spacing.sm },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.lg },
  metric: { width: "47%", padding: spacing.md },
  metricIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  metricValue: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, letterSpacing: -0.02 * fontSize.xxl },
  metricLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  section: { marginTop: spacing.lg },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  viewAll: { fontSize: fontSize.sm, color: colors.primary, fontWeight: "600" },
  orderCard: { marginBottom: spacing.sm, padding: spacing.md },
  orderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.md },
  orderService: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  orderCustomer: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  orderTime: { fontSize: fontSize.xs, color: colors.textSecondary },
  orderPrice: { fontSize: fontSize.md, fontWeight: "800", marginBottom: 4 },
  chatCard: { marginBottom: spacing.sm, padding: spacing.md },
  chatRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  chatAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  chatName: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  chatLast: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  unread: { minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 6, alignItems: "center", justifyContent: "center" },
  unreadText: { color: "#fff", fontSize: 11, fontWeight: "800" },
});
