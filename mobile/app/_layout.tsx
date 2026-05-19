import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PetProvider } from "../src/contexts/PetContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PetProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="reminders" options={{ presentation: "card" }} />
          <Stack.Screen name="timeline" options={{ presentation: "card" }} />
          <Stack.Screen name="labs" options={{ presentation: "card" }} />
          <Stack.Screen name="vet-report" options={{ presentation: "card" }} />
          <Stack.Screen name="nutrition" options={{ presentation: "card" }} />
          <Stack.Screen name="breeding" options={{ presentation: "card" }} />
          <Stack.Screen name="collar" options={{ presentation: "card" }} />
        </Stack>
      </PetProvider>
    </GestureHandlerRootView>
  );
}
