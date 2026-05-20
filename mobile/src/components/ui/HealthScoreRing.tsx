import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { getHealthColor } from "../../theme/colors";
import { useColors } from "../../contexts/ThemeContext";
import { fontSize } from "../../theme/spacing";

interface HealthScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function HealthScoreRing({ score, size = 120, strokeWidth = 10 }: HealthScoreRingProps) {
  const colors = useColors();
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = (score / 100) * circumference;
  const color = getHealthColor(score, colors);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={colors.borderLight} strokeWidth={strokeWidth} fill="none"
        />
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          rotation={-90} origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.label}>
        <Text style={[styles.score, { color }]}>{score}</Text>
        <Text style={[styles.subtitle, { color: colors.textTertiary }]}>Health</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  label: { position: "absolute", alignItems: "center" },
  score: { fontSize: fontSize.xxxl, fontWeight: "800" },
  subtitle: { fontSize: fontSize.xs, fontWeight: "600", marginTop: -2 },
});
