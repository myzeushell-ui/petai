import { Tabs } from "expo-router";
import { LayoutDashboard, ClipboardList, MessageCircle, User } from "lucide-react-native";
import { useColors, useTheme } from "../../src/contexts/ThemeContext";
import { useT } from "../../src/i18n";
import { Platform } from "react-native";

export default function PartnerTabsLayout() {
  const colors = useColors();
  const { theme } = useTheme();
  const t = useT();
  const tabBg = theme.style === "glass" ? theme.gradient?.base ?? "#0A0717" : "#FFFFFF";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: tabBg,
          borderTopWidth: 1,
          borderTopColor: theme.isDark ? "rgba(255,255,255,0.08)" : colors.borderLight,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          paddingTop: 8,
          height: Platform.OS === "ios" ? 88 : 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: t("partner_dashboard"), tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} strokeWidth={2} /> }} />
      <Tabs.Screen name="orders" options={{ title: t("partner_orders"), tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} strokeWidth={2} /> }} />
      <Tabs.Screen name="chats" options={{ title: t("partner_chats"), tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} strokeWidth={2} /> }} />
      <Tabs.Screen name="profile" options={{ title: t("partner_profile"), tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={2} /> }} />
    </Tabs>
  );
}
