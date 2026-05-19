import { useCallback, useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from "@expo-google-fonts/inter";
import { PetProvider } from "../src/contexts/PetContext";
import { colors } from "../src/theme/colors";

SplashScreen.preventAutoHideAsync().catch(() => {});

const ONBOARDING_KEY = "@petai:onboarded";

export default function RootLayout() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold,
  });

  useEffect(() => {
    (async () => {
      try {
        const done = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (!done) {
          await AsyncStorage.setItem(ONBOARDING_KEY, "1");
          router.replace("/onboarding");
        }
      } catch {}
      setChecking(false);
    })();
  }, []);

  const onLayoutReady = useCallback(async () => {
    if (fontsLoaded && !checking) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, checking]);

  if (checking || !fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary }}>
        <ActivityIndicator color="#FFF" size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutReady}>
      <PetProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ presentation: "fullScreenModal" }} />
          <Stack.Screen name="settings" options={{ presentation: "card" }} />
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
