import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from "react-native";
import { colors } from "../../theme/colors";
import { radius, spacing, fontSize } from "../../theme/spacing";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Button({ title, onPress, variant = "primary", size = "md", disabled, loading, style, icon }: ButtonProps) {
  const sizeStyle = sizeStyles[size];
  const variantStyle = getVariantStyle(variant, disabled);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[styles.base, sizeStyle.container, variantStyle.container, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.textColor} />
      ) : (
        <>
          {icon}
          <Text style={[sizeStyle.text, { color: variantStyle.textColor, fontWeight: "600" }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function getVariantStyle(variant: ButtonVariant, disabled?: boolean) {
  const opacity = disabled ? 0.5 : 1;
  switch (variant) {
    case "primary":
      return { container: { backgroundColor: colors.primary, opacity } as ViewStyle, textColor: "#FFF" };
    case "secondary":
      return { container: { backgroundColor: "#F3F4F6", opacity } as ViewStyle, textColor: colors.text };
    case "outline":
      return { container: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.border, opacity } as ViewStyle, textColor: colors.text };
    case "ghost":
      return { container: { backgroundColor: "transparent", opacity } as ViewStyle, textColor: colors.primary };
    case "danger":
      return { container: { backgroundColor: colors.danger, opacity } as ViewStyle, textColor: "#FFF" };
  }
}

const sizeStyles = {
  sm: { container: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm } as ViewStyle, text: { fontSize: fontSize.sm } },
  md: { container: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md } as ViewStyle, text: { fontSize: fontSize.md } },
  lg: { container: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg } as ViewStyle, text: { fontSize: fontSize.lg } },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
});
