import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Camera, Star, Globe, Clock, MapPin, DollarSign, Edit2, Save, Settings as SettingsIcon, LogOut, User } from "lucide-react-native";
import { useColors, useTheme } from "../../src/contexts/ThemeContext";
import { useRole } from "../../src/contexts/RoleContext";
import { useT } from "../../src/i18n";
import { Card } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { Badge } from "../../src/components/ui/Badge";
import { GradientBackground } from "../../src/components/ui/GradientBackground";
import { DEFAULT_PROFILES, PARTNER_TYPE_LABELS } from "../../src/data/partnerData";
import { pickPhotoWithChoice, loadUserAvatar, saveUserAvatar } from "../../src/services/photos";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

export default function PartnerProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const { theme } = useTheme();
  const { partnerType, setRole } = useRole();
  const t = useT();
  const styles = useStyles(colors);
  const profile = DEFAULT_PROFILES[partnerType ?? "veterinarian"];
  const typeLabel = PARTNER_TYPE_LABELS[partnerType ?? "veterinarian"];

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [price, setPrice] = useState(String(profile.pricePerSession));
  const [avatar, setAvatar] = useState<string | null>(null);

  React.useEffect(() => { loadUserAvatar().then(setAvatar); }, []);

  const changeAvatar = async () => {
    const r = await pickPhotoWithChoice({ aspect: [1, 1] });
    if (r?.uri) { setAvatar(r.uri); await saveUserAvatar(r.uri); }
  };

  const switchToOwner = () => {
    Alert.alert("Switch to Owner mode?", "Manage your pet's health instead.", [
      { text: "Cancel", style: "cancel" },
      { text: "Switch", onPress: () => { setRole("owner"); router.replace("/(tabs)"); } },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.palette.background }}>
      <GradientBackground>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <ScrollView contentContainerStyle={styles.content}>
            {/* Avatar header */}
            <View style={styles.avatarBlock}>
              <TouchableOpacity onPress={changeAvatar} activeOpacity={0.85} style={[styles.avatarOuter, { borderColor: colors.primary }]}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={StyleSheet.absoluteFillObject} />
                ) : (
                  <>
                    <LinearGradient colors={theme.accentGradient ?? [colors.primary, colors.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
                    <User size={42} color="#fff" />
                  </>
                )}
                <View style={[styles.camBadge, { backgroundColor: colors.primary }]}>
                  <Camera size={14} color="#fff" />
                </View>
              </TouchableOpacity>
              {editing ? (
                <TextInput style={[styles.nameInput, { color: colors.text, borderColor: colors.border }]} value={name} onChangeText={setName} placeholderTextColor={colors.textTertiary} />
              ) : (
                <Text style={styles.name}>{name}</Text>
              )}
              <Text style={styles.title}>{profile.title}</Text>
              <View style={styles.typeRow}>
                <Text style={{ fontSize: 18 }}>{typeLabel.emoji}</Text>
                <Badge label={typeLabel.label} variant="purple" />
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <Card style={styles.stat}>
                <Star size={18} color="#F59E0B" />
                <Text style={styles.statNum}>{profile.rating}</Text>
                <Text style={styles.statLbl}>{profile.reviewCount} reviews</Text>
              </Card>
              <Card style={styles.stat}>
                <Clock size={18} color={colors.primary} />
                <Text style={styles.statNum}>{profile.experience}y</Text>
                <Text style={styles.statLbl}>experience</Text>
              </Card>
              <Card style={styles.stat}>
                <DollarSign size={18} color="#22C55E" />
                {editing ? (
                  <TextInput style={[styles.priceInput, { color: colors.text }]} value={price} onChangeText={setPrice} keyboardType="number-pad" />
                ) : (
                  <Text style={styles.statNum}>${price}</Text>
                )}
                <Text style={styles.statLbl}>per session</Text>
              </Card>
            </View>

            {/* Bio */}
            <Card style={styles.section}>
              <Text style={styles.sectionLabel}>{t("profile_bio")}</Text>
              {editing ? (
                <TextInput style={[styles.bioInput, { color: colors.text, borderColor: colors.border }]} value={bio} onChangeText={setBio} multiline numberOfLines={4} placeholderTextColor={colors.textTertiary} />
              ) : (
                <Text style={styles.bio}>{bio}</Text>
              )}
            </Card>

            {/* Details */}
            <Card style={styles.section}>
              <View style={styles.detailRow}>
                <Globe size={16} color={colors.textSecondary} />
                <Text style={styles.detailLabel}>{t("profile_languages")}</Text>
                <Text style={styles.detailValue}>{profile.languages.join(", ")}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Clock size={16} color={colors.textSecondary} />
                <Text style={styles.detailLabel}>{t("profile_availability")}</Text>
                <Text style={styles.detailValue}>{profile.availability} · {profile.responseTime}</Text>
              </View>
              {profile.location && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.detailRow}>
                    <MapPin size={16} color={colors.textSecondary} />
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue}>{profile.location}</Text>
                  </View>
                </>
              )}
            </Card>

            <Button
              title={editing ? "Save changes" : t("edit_profile")}
              onPress={() => setEditing(!editing)}
              icon={editing ? <Save size={16} color="#fff" /> : <Edit2 size={16} color="#fff" />}
              style={{ marginTop: spacing.md }}
            />

            <Button
              title={t("settings")}
              variant="outline"
              onPress={() => router.push("/settings")}
              icon={<SettingsIcon size={16} color={colors.text} />}
              style={{ marginTop: spacing.sm }}
            />

            <Button
              title={`${t("switch_role")} → ${t("owner_mode")}`}
              variant="ghost"
              onPress={switchToOwner}
              icon={<LogOut size={16} color={colors.primary} />}
              style={{ marginTop: spacing.sm }}
            />
          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
    </View>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  avatarBlock: { alignItems: "center", marginBottom: spacing.xl, marginTop: spacing.md },
  avatarOuter: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, overflow: "hidden", alignItems: "center", justifyContent: "center", position: "relative" },
  camBadge: { position: "absolute", bottom: 2, right: 2, width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: colors.background },
  name: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, marginTop: spacing.md, letterSpacing: -0.02 * fontSize.xxl },
  nameInput: { fontSize: fontSize.xxl, fontWeight: "800", marginTop: spacing.md, padding: spacing.sm, borderWidth: 1, borderRadius: radius.md, minWidth: 200, textAlign: "center" },
  title: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2, textAlign: "center" },
  typeRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.sm },
  statsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  stat: { flex: 1, alignItems: "center", padding: spacing.md, gap: 4 },
  statNum: { fontSize: fontSize.lg, fontWeight: "800", color: colors.text },
  statLbl: { fontSize: 10, color: colors.textTertiary, textAlign: "center" },
  priceInput: { fontSize: fontSize.lg, fontWeight: "800", textAlign: "center", minWidth: 50 },
  section: { marginBottom: spacing.md },
  sectionLabel: { fontSize: 11, fontWeight: "700", color: colors.textTertiary, letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: "uppercase" },
  bio: { fontSize: fontSize.sm, color: colors.text, lineHeight: 21 },
  bioInput: { fontSize: fontSize.sm, color: colors.text, padding: spacing.sm, borderWidth: 1, borderRadius: radius.md, minHeight: 100, textAlignVertical: "top" },
  detailRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: spacing.sm },
  detailLabel: { fontSize: fontSize.sm, color: colors.textSecondary, flex: 1 },
  detailValue: { fontSize: fontSize.sm, color: colors.text, fontWeight: "600" },
  divider: { height: 1, backgroundColor: colors.borderLight },
});
