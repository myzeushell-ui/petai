/**
 * PetAI Android entry — v1.1.0
 *
 * Hosts the live PetAI web app inside a native WebView shell so
 * the Android APK always reflects the latest deployed features
 * (bilingual upbringing system, AI assistant, lab analysis, etc.)
 * without needing to ship a new APK every time the web updates.
 *
 * The native screens (onboarding, tabs, partner) are still in the
 * codebase but unreachable through default navigation in this build.
 */

import { useRef, useState, useCallback } from "react";
import { View, ActivityIndicator, StyleSheet, BackHandler, RefreshControl, ScrollView, Platform, StatusBar as RNStatusBar } from "react-native";
import { WebView } from "react-native-webview";
import { useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const WEB_URL = "https://petai-ochre.vercel.app/dashboard";
const BRAND_GREEN = "#22c55e";

export default function WebShell() {
  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  // Hardware back button → navigate web history before exiting app
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        if (canGoBack && webRef.current) {
          webRef.current.goBack();
          return true;
        }
        return false;
      });
      return () => sub.remove();
    }, [canGoBack])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    webRef.current?.reload();
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={BRAND_GREEN}
            colors={[BRAND_GREEN]}
          />
        }
      >
        <WebView
          ref={webRef}
          source={{ uri: WEB_URL }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={(nav) => setCanGoBack(nav.canGoBack)}
          startInLoadingState={false}
          javaScriptEnabled
          domStorageEnabled
          allowsBackForwardNavigationGestures
          pullToRefreshEnabled
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback
          setSupportMultipleWindows={false}
          style={styles.web}
        />
        {loading && (
          <View style={styles.loaderOverlay} pointerEvents="none">
            <ActivityIndicator size="large" color={BRAND_GREEN} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight ?? 0 : 0,
  },
  web: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
  },
});
