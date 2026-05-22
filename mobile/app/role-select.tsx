import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Stack } from "expo-router";
import { Check, User, Briefcase } from "lucide-react-native";
import { useColors, useTheme } from "../src/contexts/ThemeContext";
import { useRole, PartnerType } from "../src/contexts/RoleContext";
import { useT } from "../src/i18n";
import { Card } from "../src/components/ui/Card";
import { Button } from "../src/components/ui/Button";
import { GradientBackground } from "../src/components/ui/GradientBackground";
import { PARTNER_TYPE_LABELS } from "../src/data/partnerData";
import { spacing, radius, fontSize } from "../src/theme/spacing";

export default function RoleSelectScreen() {
  const router = useRouter();
  const colors = useColors();
  const { theme } = useTheme();
  const { setRole } = useRole();
  const t = useT();
  const styles = useStyles(colors);
  const [step, setStep] = useState<"role" | "partner-type">("role");
  const [selectedType, setSelectedType] = useState<PartnerType>("veterinarian");

  const chooseOwner = () => { setRole("owner"); router.replace("/(tabs)"); };
  const chooseAndFinish = () => { setRole("partner", selectedType); router.replace("/(partner)/dashboard"); };

  return (
    <View style={{ flex: 1, backgroundColor: theme.palette.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <GradientBackground>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.content}>
            {step === "role" ? (
              <>
                <Text style={styles.title}>How will you use PetAI?</Text>
                <Text style={styles.subtitle}>You can switch roles anytime in Settings</Text>

                <TouchableOpacity onPress={chooseOwner} activeOpacity={0.85}>
                  <Card variant="elevated" style={styles.roleCard}>
                    <View style={[styles.roleIcon, { backgroundColor: colors.primary + "20" }]}>
                      <User size={32} color={colors.primary} />
                    </View>
                    <Text style={styles.roleTitle}>{t("role_owner")}</Text>
                    <Text style={styles.roleDesc}>Manage your pet's health, get AI advice, book consultations, take the breed quiz.</Text>
                  </Card>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStep("partner-type")} activeOpacity={0.85}>
                  <Card variant="elevated" style={[styles.roleCard, { borderColor: colors.primary, borderWidth: 2 }]}>
                    <View style={[styles.roleIcon, { backgroundColor: "#F59E0B20" }]}>
                      <Briefcase size={32} color="#F59E0B" />
                    </View>
                    <Text style={styles.roleTitle}>{t("role_partner")}</Text>
                    <Text style={styles.roleDesc}>Get orders from pet owners, chat with customers, manage your schedule and earnings.</Text>
                    <Text style={[styles.roleBadge, { color: colors.primary }]}>👉 SELECT YOUR SPECIALTY NEXT</Text>
                  </Card>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.title}>What's your specialty?</Text>
                <Text style={styles.subtitle}>This determines your dashboard and order types</Text>

                <View style={{ gap: spacing.sm }}>
                  {(Object.keys(PARTNER_TYPE_LABELS) as PartnerType[]).map((t) => {
                    const info = PARTNER_TYPE_LABELS[t];
                    const isSel = selectedType === t;
                    return (
                      <TouchableOpacity key={t} onPress={() => setSelectedType(t)} activeOpacity={0.85}>
                        <Card style={[styles.typeCard, isSel && { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.primary + "12" }]}>
                          <Text style={{ fontSize: 28 }}>{info.emoji}</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.typeTitle, isSel && { color: colors.primary }]}>{info.label}</Text>
                            <Text style={styles.typeDesc}>{info.description}</Text>
                          </View>
                          {isSel && <Check size={20} color={colors.primary} strokeWidth={3} />}
                        </Card>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
                  <Button title={`Continue as ${PARTNER_TYPE_LABELS[selectedType].label}`} onPress={chooseAndFinish} />
                  <Button title="Back" variant="outline" onPress={() => setStep("role")} />
                </View>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
    </View>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  content: { padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, letterSpacing: -0.02 * 28, marginBottom: spacing.sm, textAlign: "center" },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xl, textAlign: "center" },
  roleCard: { marginBottom: spacing.md, padding: spacing.xl, alignItems: "center", gap: spacing.sm },
  roleIcon: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  roleTitle: { fontSize: fontSize.lg, fontWeight: "800", color: colors.text, textAlign: "center" },
  roleDesc: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", lineHeight: 20 },
  roleBadge: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5, marginTop: spacing.sm },
  typeCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md },
  typeTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  typeDesc: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
});
