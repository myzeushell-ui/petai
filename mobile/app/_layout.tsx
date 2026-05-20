import { useCallback, useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from "@expo-google-fonts/inter";
import { PetProvider } from "../src/contexts/PetContext";
import { ThemeProvider, useTheme } from "../src/contexts/ThemeContext";

SplashScreen.preventAutoHideAsync().catch(() => {});

const ONBOARDING_KEY = "@petai:onboarded";

function AppStack() {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ presentation: "fullScreenModal" }} />
        <Stack.Screen name="settings" />
        <Stack.Screen name="breeds" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="reminders" />
        <Stack.Screen name="timeline" />
        <Stack.Screen name="labs" />
        <Stack.Screen name="vet-report" />
        <Stack.Screen name="nutrition" />
        <Stack.Screen name="breeding" />
        <Stack.Screen name="collar" />
      </Stack>
    </>
  );
}

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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#22c55e" }}>
        <ActivityIndicator color="#FFF" size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutReady}>
      <ThemeProvider>
        <PetProvider>
          <AppStack />
        </PetProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
