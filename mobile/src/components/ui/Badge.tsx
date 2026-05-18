import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { radius, spacing, fontSize } from "../../theme/spacing";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "purple" | "outline";

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: "#F3F4F6", text: "#374151" },
  success: { bg: "#DCFCE7", text: "#166534" },
  warning: { bg: "#FEF3C7", text: "#92400E" },
  danger: { bg: "#FEE2E2", text: "#991B1B" },
  info: { bg: "#DBEAFE", text: "#1E40AF" },
  purple: { bg: "#F3E8FF", text: "#7C3AED" },
  outline: { bg: "transparent", text: "#6B7280" },
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = "default", style }: BadgeProps) {
  const v = variantStyles[variant];
  return (
    <View style={[styles.badge, { backgroundColor: v.bg }, variant === "outline" && styles.outline, style]}>
      <Text style={[styles.text, { color: v.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
});
