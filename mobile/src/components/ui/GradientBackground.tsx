import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const { width: SW, height: SH } = Dimensions.get("window");

/**
 * Animated radial-gradient background for Glass themes.
 * Renders multiple soft blurred blobs over a base color.
 * For Premium themes, renders nothing (transparent).
 */
export function GradientBackground({ children }: { children?: React.ReactNode }) {
  const { theme } = useTheme();

  if (theme.style !== "glass" || !theme.gradient) {
    return <>{children}</>;
  }

  const { base, blobs } = theme.gradient;

  return (
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: base }]} pointerEvents="none">
      {blobs.map((b, i) => {
        const size = (b.size / 100) * Math.max(SW, SH) * 0.7;
        return (
          <View
            key={i}
            style={{
              position: "absolute",
              left: (b.x / 100) * SW - size / 2,
              top: (b.y / 100) * SH - size / 2,
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: b.color,
              opacity: b.opacity,
              transform: [{ scale: 1 }],
            }}
          />
        );
      })}
      {/* Heavy blur layer to soften blobs */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "transparent" }]}>
        {children}
      </View>
    </View>
  );
}
