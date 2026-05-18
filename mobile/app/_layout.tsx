import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PetProvider } from "../src/contexts/PetContext";

export default function RootLayout() {
  return (
    <PetProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PetProvider>
  );
}
