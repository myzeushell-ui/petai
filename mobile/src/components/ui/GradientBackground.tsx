import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const { width: SW, height: SH } = Dimensions.get("window");

/**
 * Animated radial-gradient background for Glass themes.
 * Renders multiple soft blurred blobs over a base color.
 * For Premium themes, just renders children with theme background.
 *
 * IMPORTANT: pointerEvents="none" is applied ONLY to the absolute-positioned
 * gradient layer — the children layer must receive touches normally.
 */
export function GradientBackground({ children }: { children?: React.ReactNode }) {
  const { theme } = useTheme();

  if (theme.style !== "glass" || !theme.gradient) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.palette.background }}>
        {children}
      </View>
    );
  }

  const { base, blobs } = theme.gradient;

  return (
    <View style={{ flex: 1, backgroundColor: base }}>
      {/* Decorative blobs layer — pointerEvents none so taps pass through */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
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
              }}
            />
          );
        })}
      </View>
      {/* Children layer — must receive touches */}
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </View>
  );
}
