import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { useColors } from "../../contexts/ThemeContext";
import { radius, spacing } from "../../theme/spacing";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "elevated" | "outlined";
}

export function Card({ children, style, variant = "default" }: CardProps) {
  const colors = useColors();
  return (
    <View
      style={[
        {
          backgroundColor: variant === "elevated" ? colors.surfaceElevated : colors.surface,
          borderRadius: radius.xl,
          padding: spacing.lg,
          borderWidth: variant === "elevated" ? 0 : 1,
          borderColor: colors.border,
        },
        variant === "elevated" && styles.elevated,
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
});
