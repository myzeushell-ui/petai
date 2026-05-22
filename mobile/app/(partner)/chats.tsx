import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColors, useTheme } from "../../src/contexts/ThemeContext";
import { Card } from "../../src/components/ui/Card";
import { GradientBackground } from "../../src/components/ui/GradientBackground";
import { useT } from "../../src/i18n";
import { mockChats } from "../../src/data/partnerData";
import { spacing, fontSize } from "../../src/theme/spacing";

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 60000;
  if (diff < 60) return `${Math.round(diff)}m`;
  if (diff < 1440) return `${Math.round(diff / 60)}h`;
  return `${Math.round(diff / 1440)}d`;
}

export default function PartnerChatsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { theme } = useTheme();
  const t = useT();
  const styles = useStyles(colors);
  const sorted = [...mockChats].sort((a, b) => b.lastAt.localeCompare(a.lastAt));

  return (
    <View style={{ flex: 1, backgroundColor: theme.palette.background }}>
      <GradientBackground>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("partner_chats")}</Text>
          </View>
          <FlatList
            data={sorted}
            keyExtractor={(c) => c.id}
            contentContainerStyle={styles.list}
            renderItem={({ item: c }) => (
              <TouchableOpacity activeOpacity={0.85} onPress={() => router.push(`/chat/${c.id}`)}>
                <Card style={styles.card}>
                  <View style={styles.row}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary + "30" }]}>
                      <Text style={{ fontSize: 18, fontWeight: "800", color: colors.primary }}>{c.customerName[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.topLine}>
                        <Text style={styles.name}>{c.customerName}</Text>
                        <Text style={styles.time}>{timeAgo(c.lastAt)}</Text>
                      </View>
                      <Text style={styles.pet}>{c.petName}</Text>
                      <Text style={[styles.last, c.unread > 0 && { color: colors.text, fontWeight: "600" }]} numberOfLines={1}>{c.lastMessage}</Text>
                    </View>
                    {c.unread > 0 && (
                      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.badgeText}>{c.unread}</Text>
                      </View>
                    )}
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
  list: { padding: spacing.lg },
  card: { marginBottom: spacing.sm, padding: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  topLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  time: { fontSize: fontSize.xs, color: colors.textTertiary },
  pet: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 1 },
  last: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  badge: { minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 6, alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
});
