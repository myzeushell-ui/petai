import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { radius, spacing } from "../../theme/spacing";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "elevated" | "outlined" | "glass";
}

export function Card({ children, style, variant = "default" }: CardProps) {
  const { colors, theme } = useTheme();
  const isGlass = theme.style === "glass";

  // For glass themes, default + elevated both use the glass look
  const useGlassStyle = isGlass && variant !== "outlined";

  const bg = useGlassStyle ? colors.glassBg : variant === "elevated" ? colors.surfaceElevated : colors.surface;
  const borderColor = useGlassStyle ? colors.glassBorder : colors.border;
  const borderWidth = variant === "elevated" && !useGlassStyle ? 0 : 1;

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderRadius: radius.xl,
          padding: spacing.lg,
          borderWidth,
          borderColor,
        },
        variant === "elevated" && !useGlassStyle && styles.elevated,
        useGlassStyle && styles.glassShadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  glassShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
});
