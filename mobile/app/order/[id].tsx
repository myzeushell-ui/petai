import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Calendar, MapPin, Phone, MessageCircle, Check, X, Image as ImgIcon } from "lucide-react-native";
import { useColors, useTheme } from "../../src/contexts/ThemeContext";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Button } from "../../src/components/ui/Button";
import { GradientBackground } from "../../src/components/ui/GradientBackground";
import { useT } from "../../src/i18n";
import { mockOrders, mockChats } from "../../src/data/partnerData";
import { spacing, fontSize } from "../../src/theme/spacing";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { theme } = useTheme();
  const t = useT();
  const styles = useStyles(colors);
  const order = mockOrders.find((o) => o.id === id);

  if (!order) return <View style={{ flex: 1, backgroundColor: colors.background }}><Text style={{ color: colors.text, padding: 40 }}>Order not found</Text></View>;

  const chatForCustomer = mockChats.find((c) => c.customerName === order.customerName);

  return (
    <View style={{ flex: 1, backgroundColor: theme.palette.background }}>
      <Stack.Screen options={{
        headerShown: true, title: t("order_details"),
        headerLeft: () => <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}><ArrowLeft size={22} color={colors.text} /></TouchableOpacity>,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: "700", color: colors.text },
        headerTintColor: colors.text,
      }} />
      <GradientBackground>
        <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
          <ScrollView contentContainerStyle={styles.content}>
            <Card variant="elevated" style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.service}>{order.service}</Text>
                <Badge label={order.status.replace("_", " ")} variant={order.status === "new" ? "danger" : order.status === "in_progress" ? "warning" : "info"} />
              </View>
              <Text style={[styles.price, { color: colors.primary }]}>${order.price} {order.currency}</Text>
              {order.scheduledFor && (
                <View style={styles.metaRow}>
                  <Calendar size={14} color={colors.textSecondary} />
                  <Text style={styles.meta}>{new Date(order.scheduledFor).toLocaleString([], { dateStyle: "full", timeStyle: "short" })}</Text>
                </View>
              )}
              {order.duration && <Text style={styles.meta}>Duration: {order.duration} min</Text>}
              {order.address && (
                <View style={styles.metaRow}>
                  <MapPin size={14} color={colors.textSecondary} />
                  <Text style={styles.meta}>{order.address}</Text>
                </View>
              )}
            </Card>

            <Card style={styles.card}>
              <Text style={styles.sectionLabel}>{t("customer")}</Text>
              <View style={styles.customerRow}>
                <View style={[styles.avatar, { backgroundColor: colors.primary + "30" }]}>
                  <Text style={{ fontSize: 22, fontWeight: "800", color: colors.primary }}>{order.customerName[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.customerName}>{order.customerName}</Text>
                  <Text style={styles.customerPet}>{t("pet")}: {order.petName} · {order.petBreed}</Text>
                </View>
              </View>
              <View style={styles.actionsRow}>
                <Button title={t("chat")} variant="outline" size="sm" icon={<MessageCircle size={14} color={colors.text} />} onPress={() => chatForCustomer && router.push(`/chat/${chatForCustomer.id}`)} style={{ flex: 1 }} />
                <Button title={t("call")} variant="outline" size="sm" icon={<Phone size={14} color={colors.text} />} onPress={() => Linking.openURL("tel:+15555550100")} style={{ flex: 1 }} />
              </View>
            </Card>

            {order.notes && (
              <Card style={styles.card}>
                <Text style={styles.sectionLabel}>{t("notes")}</Text>
                <Text style={styles.bio}>{order.notes}</Text>
              </Card>
            )}

            {order.productItems && (
              <Card style={styles.card}>
                <Text style={styles.sectionLabel}>Products</Text>
                {order.productItems.map((p, i) => (
                  <View key={i} style={styles.productRow}>
                    <ImgIcon size={16} color={colors.textSecondary} />
                    <Text style={[styles.bio, { flex: 1 }]}>{p.qty}× {p.name}</Text>
                    <Text style={{ color: colors.text, fontWeight: "700" }}>${p.price * p.qty}</Text>
                  </View>
                ))}
              </Card>
            )}

            <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
              {order.status === "new" && (
                <>
                  <Button title={t("accept")} icon={<Check size={16} color="#fff" />} onPress={() => Alert.alert("Accepted", "Order accepted. Customer notified.")} />
                  <Button title={t("decline")} variant="outline" icon={<X size={16} color={colors.text} />} onPress={() => Alert.alert("Declined", "Order declined.")} />
                </>
              )}
              {order.status === "accepted" && <Button title="Start session" onPress={() => Alert.alert("Started", "Session started.")} />}
              {order.status === "in_progress" && <Button title={t("complete")} icon={<Check size={16} color="#fff" />} onPress={() => Alert.alert("Completed", "Order marked completed. Payment processed.")} />}
            </View>
          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
    </View>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: { marginBottom: spacing.md },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.sm, marginBottom: spacing.sm },
  service: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text, flex: 1 },
  price: { fontSize: fontSize.xxl, fontWeight: "800", letterSpacing: -0.02 * fontSize.xxl, marginBottom: spacing.md },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  meta: { fontSize: fontSize.sm, color: colors.textSecondary },
  sectionLabel: { fontSize: 11, fontWeight: "700", color: colors.textTertiary, letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: "uppercase" },
  customerRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.md },
  avatar: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  customerName: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  customerPet: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  actionsRow: { flexDirection: "row", gap: spacing.sm },
  bio: { fontSize: fontSize.sm, color: colors.text, lineHeight: 21 },
  productRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: 6 },
});
