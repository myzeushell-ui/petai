import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, MoreHorizontal, Settings } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { usePet } from "../../contexts/PetContext";
import { spacing, fontSize } from "../../theme/spacing";

// Default placeholder photos until user uploads their own
const DEFAULT_PET_PHOTOS: Record<string, string> = {
  luna: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80",   // Golden Retriever
  mochi: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&q=80",  // British Shorthair cat
};

interface PetCoverHeaderProps {
  height?: number;
  showBack?: boolean;
  onBack?: () => void;
  onSettings?: () => void;
  userInitials?: string;
}

export function PetCoverHeader({ height = 240, showBack, onBack, onSettings, userInitials = "AJ" }: PetCoverHeaderProps) {
  const { theme, colors } = useTheme();
  const { activePet } = usePet();
  const photoUri = DEFAULT_PET_PHOTOS[activePet.id] ?? DEFAULT_PET_PHOTOS.luna;

  // Gradient overlay color matches theme background for seamless blend
  const overlayColor = theme.isDark ? theme.palette.background : "#000000";

  return (
    <View style={[styles.container, { height }]}>
      <ImageBackground source={{ uri: photoUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover">
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.1)", overlayColor + "F0", overlayColor]}
          locations={[0, 0.35, 0.85, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </ImageBackground>

      {/* Status row */}
      <View style={styles.statusRow}>
        {showBack && onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
            <ArrowLeft size={18} color="#fff" />
          </TouchableOpacity>
        ) : <View style={styles.iconBtn} />}
        <View style={{ flex: 1 }} />
        {onSettings && (
          <TouchableOpacity onPress={onSettings} style={styles.iconBtn}>
            <Settings size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* User avatar overlay (Facebook-style top right) */}
      <View style={[styles.userAvatar, { borderColor: theme.isDark ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.8)" }]}>
        <LinearGradient
          colors={theme.accentGradient ?? [colors.primary, colors.primaryDark]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />
        <Text style={styles.userInitials}>{userInitials}</Text>
      </View>

      {/* Pet name + meta at bottom */}
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{activePet.name}</Text>
        <Text style={styles.petMeta}>{activePet.breed} · {activePet.age}y · {activePet.weight}{activePet.weightUnit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "relative", overflow: "hidden", justifyContent: "flex-end" },
  statusRow: { position: "absolute", top: 50, left: 0, right: 0, paddingHorizontal: spacing.lg, flexDirection: "row", alignItems: "center", zIndex: 2 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center" },
  userAvatar: { position: "absolute", top: 10, right: 56, zIndex: 3, width: 38, height: 38, borderRadius: 19, borderWidth: 2, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  userInitials: { fontSize: 12, fontWeight: "800", color: "#fff", letterSpacing: 0.3, zIndex: 1 },
  petInfo: { position: "relative", zIndex: 2, padding: spacing.lg, paddingBottom: spacing.lg },
  petName: { fontSize: 32, fontWeight: "800", letterSpacing: -0.02 * 32, color: "#fff", lineHeight: 34, textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  petMeta: { fontSize: fontSize.sm, color: "rgba(255,255,255,0.92)", marginTop: 4, textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
});
