import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Polyline, Circle, Line, Text as SvgText } from "react-native-svg";
import { useColors } from "../../contexts/ThemeContext";
import { fontSize } from "../../theme/spacing";

interface DataPoint {
  label: string;  // e.g. "Jan", "Mar"
  value: number;
}

interface Props {
  data: DataPoint[];
  width: number;
  height: number;
  color?: string;
  unit?: string;
  refLow?: number;
  refHigh?: number;
  showDots?: boolean;
}

export function TrendChart({ data, width, height, color, unit, refLow, refHigh, showDots = true }: Props) {
  const colors = useColors();
  const lineColor = color ?? colors.primary;

  if (data.length < 2) return null;

  const values = data.map((d) => d.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (refLow !== undefined) min = Math.min(min, refLow);
  if (refHigh !== undefined) max = Math.max(max, refHigh);
  const pad = (max - min) * 0.15 || 1;
  min -= pad;
  max += pad;

  const padding = { top: 12, right: 24, bottom: 24, left: 30 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const xStep = chartW / (data.length - 1);
  const yScale = (v: number) => padding.top + chartH - ((v - min) / (max - min)) * chartH;

  const points = data.map((d, i) => `${padding.left + i * xStep},${yScale(d.value)}`).join(" ");

  return (
    <View>
      <Svg width={width} height={height}>
        {/* Reference range band */}
        {refLow !== undefined && refHigh !== undefined && (
          <>
            <Line x1={padding.left} y1={yScale(refHigh)} x2={width - padding.right} y2={yScale(refHigh)} stroke={colors.warning + "60"} strokeDasharray="4 4" strokeWidth={1} />
            <Line x1={padding.left} y1={yScale(refLow)} x2={width - padding.right} y2={yScale(refLow)} stroke={colors.warning + "60"} strokeDasharray="4 4" strokeWidth={1} />
          </>
        )}

        {/* Line */}
        <Polyline points={points} fill="none" stroke={lineColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots + value labels */}
        {showDots && data.map((d, i) => {
          const cx = padding.left + i * xStep;
          const cy = yScale(d.value);
          return (
            <React.Fragment key={i}>
              <Circle cx={cx} cy={cy} r={4} fill={lineColor} stroke={colors.surface} strokeWidth={2} />
              {i === data.length - 1 && (
                <SvgText x={cx + 6} y={cy - 6} fontSize={11} fontWeight="700" fill={lineColor}>
                  {d.value}{unit ? "" : ""}
                </SvgText>
              )}
            </React.Fragment>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <SvgText
            key={`l-${i}`}
            x={padding.left + i * xStep}
            y={height - 6}
            fontSize={9}
            fill={colors.textTertiary}
            textAnchor="middle"
          >
            {d.label}
          </SvgText>
        ))}

        {/* Y-axis ticks */}
        <SvgText x={padding.left - 4} y={padding.top + 4} fontSize={9} fill={colors.textTertiary} textAnchor="end">{Math.round(max)}</SvgText>
        <SvgText x={padding.left - 4} y={padding.top + chartH} fontSize={9} fill={colors.textTertiary} textAnchor="end">{Math.round(min)}</SvgText>
      </Svg>
    </View>
  );
}
