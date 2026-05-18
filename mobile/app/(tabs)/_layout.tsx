import { Tabs } from "expo-router";
import { Home, Bot, PawPrint, ShoppingCart, Stethoscope } from "lucide-react-native";
import { colors } from "../../src/theme/colors";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          paddingTop: 8,
          height: Platform.OS === "ios" ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: "AI",
          tabBarIcon: ({ color, size }) => <Bot size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="breeds"
        options={{
          title: "Breeds",
          tabBarIcon: ({ color, size }) => <PawPrint size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: "Market",
          tabBarIcon: ({ color, size }) => <ShoppingCart size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="consultations"
        options={{
          title: "Vets",
          tabBarIcon: ({ color, size }) => <Stethoscope size={size} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
