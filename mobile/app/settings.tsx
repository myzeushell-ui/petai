import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Bell, Palette, Globe, HelpCircle, Shield, Star, LogOut, ChevronRight, Heart, Trash2, Database } from "lucide-react-native";
import { usePet } from "../src/contexts/PetContext";
import { useTheme, useColors } from "../src/contexts/ThemeContext";
import { Card } from "../src/components/ui/Card";
import { ThemePicker } from "../src/components/settings/ThemePicker";
import { sendTestNotification } from "../src/services/notifications";
import { spacing, radius, fontSize } from "../src/theme/spacing";

interface RowProps {
  icon: React.ComponentType<any>;
  iconColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  danger?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { activePet, pets } = usePet();
  const { theme } = useTheme();
  const colors = useColors();
  const styles = useStyles(colors);
  const [notifications, setNotifications] = React.useState(true);
  const [insights, setInsights] = React.useState(true);

  const Row = ({ icon: Icon, iconColor = colors.text, label, value, onPress, toggle, toggleValue, onToggle, danger }: RowProps) => {
    const Content = (
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: iconColor + "15" }]}>
          <Icon size={18} color={iconColor} />
        </View>
        <Text style={[styles.rowLabel, danger && { color: colors.danger }]}>{label}</Text>
        {toggle ? (
          <Switch value={toggleValue} onValueChange={onToggle} trackColor={{ true: colors.primary, false: colors.border }} thumbColor="#FFF" />
        ) : (
          <>
            {value && <Text style={styles.rowValue}>{value}</Text>}
            <ChevronRight size={16} color={colors.textTertiary} />
          </>
        )}
      </View>
    );
    return onPress ? (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6}>{Content}</TouchableOpacity>
    ) : (
      Content
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Settings",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
              <ArrowLeft size={22} color={colors.text} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { fontWeight: "700", color: colors.text },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarBig}>
              <Text style={styles.avatarText}>AJ</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>Alex Johnson</Text>
              <Text style={styles.profileEmail}>alex@example.com</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>FREE PLAN</Text>
              </View>
            </View>
          </View>
        </Card>

        <TouchableOpacity activeOpacity={0.85}>
          <Card variant="elevated" style={styles.upgradeCard}>
            <Heart size={20} color="#FFF" fill="#FFF" />
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
              <Text style={styles.upgradeSub}>Unlimited AI · Voice analysis · Lab parsing</Text>
            </View>
            <Text style={styles.upgradePrice}>$4.99/mo</Text>
          </Card>
        </TouchableOpacity>

        {/* Theme picker */}
        <View style={styles.themeSection}>
          <View style={styles.themeHeader}>
            <Palette size={18} color={colors.primary} />
            <Text style={[styles.sectionLabel, { marginTop: 0, marginLeft: 0, marginBottom: 0 }]}>APPEARANCE · {theme.name}</Text>
          </View>
          <ThemePicker />
        </View>

        {/* Pets */}
        <Text style={styles.sectionLabel}>YOUR PETS</Text>
        <Card style={styles.sectionCard}>
          {pets.map((pet, i) => (
            <View key={pet.id}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.row}>
                <View style={[styles.petAvatar, { backgroundColor: pet.color + "20" }]}>
                  <Text style={{ fontSize: 24 }}>{pet.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>{pet.name}</Text>
                  <Text style={styles.rowSub}>{pet.breed} · {pet.age}y</Text>
                </View>
                {pet.id === activePet.id && (
                  <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>Active</Text></View>
                )}
              </View>
            </View>
          ))}
          <View style={styles.divider} />
          <TouchableOpacity style={[styles.row, { paddingVertical: spacing.md }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.primary + "15" }]}>
              <Text style={{ fontSize: 18, color: colors.primary, fontWeight: "700" }}>+</Text>
            </View>
            <Text style={[styles.rowLabel, { color: colors.primary, fontWeight: "600" }]}>Add a pet</Text>
          </TouchableOpacity>
        </Card>

        {/* Preferences */}
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <Card style={styles.sectionCard}>
          <Row icon={Bell} iconColor="#EF4444" label="Notifications" toggle toggleValue={notifications} onToggle={setNotifications} />
          <View style={styles.divider} />
          <Row icon={Bell} iconColor="#22c55e" label="Send test notification" onPress={async () => {
            const ok = await sendTestNotification();
            Alert.alert(
              ok ? "Test scheduled" : "Permission denied",
              ok ? "You'll get a test notification in 2 seconds." : "Enable notifications in your phone settings."
            );
          }} />
          <View style={styles.divider} />
          <Row icon={Heart} iconColor="#EC4899" label="AI insights" toggle toggleValue={insights} onToggle={setInsights} />
          <View style={styles.divider} />
          <Row icon={Globe} iconColor="#0EA5E9" label="Language" value="English" onPress={() => Alert.alert("Language", "More languages coming soon")} />
        </Card>

        {/* Data & Privacy */}
        <Text style={styles.sectionLabel}>DATA & PRIVACY</Text>
        <Card style={styles.sectionCard}>
          <Row icon={Database} iconColor="#22c55e" label="Export pet data" onPress={() => Alert.alert("Export", "Your data will be sent to alex@example.com")} />
          <View style={styles.divider} />
          <Row icon={Shield} iconColor="#3B82F6" label="Privacy policy" onPress={() => {}} />
        </Card>

        {/* Support */}
        <Text style={styles.sectionLabel}>SUPPORT</Text>
        <Card style={styles.sectionCard}>
          <Row icon={HelpCircle} iconColor="#A855F7" label="Help center" onPress={() => {}} />
          <View style={styles.divider} />
          <Row icon={Star} iconColor="#F59E0B" label="Rate PetAI" onPress={() => {}} />
        </Card>

        {/* Account */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <Card style={styles.sectionCard}>
          <Row icon={LogOut} iconColor={colors.textSecondary} label="Sign out" onPress={() => Alert.alert("Sign out?", "You can sign back in anytime", [{ text: "Cancel" }, { text: "Sign out", style: "destructive" }])} />
          <View style={styles.divider} />
          <Row icon={Trash2} iconColor={colors.danger} label="Delete account" danger onPress={() => Alert.alert("Delete account?", "This cannot be undone.", [{ text: "Cancel" }, { text: "Delete", style: "destructive" }])} />
        </Card>

        <Text style={styles.version}>PetAI v1.0.0 · Made with care for your pets</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
  content: { padding: spacing.lg },
  profileCard: { marginBottom: spacing.md },
  profileRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  avatarBig: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#FFF", fontSize: fontSize.xl, fontWeight: "800" },
  profileName: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  profileEmail: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 1 },
  proBadge: { backgroundColor: colors.textTertiary + "20", paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full, alignSelf: "flex-start", marginTop: 6 },
  proBadgeText: { fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 0.5 },
  upgradeCard: { backgroundColor: colors.primary, borderColor: colors.primary, flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.xl },
  upgradeTitle: { fontSize: fontSize.md, fontWeight: "700", color: "#FFF" },
  upgradeSub: { fontSize: fontSize.xs, color: "#FFF", opacity: 0.85, marginTop: 1 },
  upgradePrice: { fontSize: fontSize.md, fontWeight: "800", color: "#FFF" },
  sectionLabel: { fontSize: 11, fontWeight: "700", color: colors.textTertiary, marginTop: spacing.lg, marginBottom: spacing.sm, marginLeft: spacing.sm, letterSpacing: 0.5 },
  themeSection: { marginTop: spacing.xl, marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.borderLight },
  themeHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md, paddingHorizontal: spacing.sm },
  sectionCard: { padding: 0, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md },
  iconBox: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  petAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  rowLabel: { fontSize: fontSize.md, color: colors.text, fontWeight: "500", flex: 1 },
  rowSub: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 1 },
  rowValue: { fontSize: fontSize.sm, color: colors.textSecondary, marginRight: 4 },
  divider: { height: 1, backgroundColor: colors.borderLight, marginLeft: spacing.md + 34 + spacing.md },
  activeBadge: { backgroundColor: colors.primary + "20", paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.full },
  activeBadgeText: { fontSize: fontSize.xs, color: colors.primary, fontWeight: "700" },
  version: { fontSize: fontSize.xs, color: colors.textTertiary, textAlign: "center", marginTop: spacing.xl, marginBottom: spacing.lg },
});
