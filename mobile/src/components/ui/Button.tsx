import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator, StyleProp } from "react-native";
import { useColors } from "../../contexts/ThemeContext";
import { radius, spacing, fontSize } from "../../theme/spacing";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export function Button({ title, onPress, variant = "primary", size = "md", disabled, loading, style, icon }: ButtonProps) {
  const colors = useColors();
  const sizeStyle = sizeStyles[size];
  const opacity = disabled ? 0.5 : 1;

  let containerStyle: ViewStyle;
  let textColor: string;
  switch (variant) {
    case "primary": containerStyle = { backgroundColor: colors.primary, opacity }; textColor = "#FFF"; break;
    case "secondary": containerStyle = { backgroundColor: colors.backgroundSecondary, opacity }; textColor = colors.text; break;
    case "outline": containerStyle = { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.border, opacity }; textColor = colors.text; break;
    case "ghost": containerStyle = { backgroundColor: "transparent", opacity }; textColor = colors.primary; break;
    case "danger": containerStyle = { backgroundColor: colors.danger, opacity }; textColor = "#FFF"; break;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[styles.base, sizeStyle.container, containerStyle, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon}
          <Text style={[sizeStyle.text, { color: textColor, fontWeight: "600" }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
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
