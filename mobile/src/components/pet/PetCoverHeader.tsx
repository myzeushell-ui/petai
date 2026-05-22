import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Camera, Settings, User } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { usePet } from "../../contexts/PetContext";
import { loadPetPhoto, loadUserAvatar, pickPhotoWithChoice, savePetPhoto, saveUserAvatar } from "../../services/photos";
import { spacing, fontSize } from "../../theme/spacing";

// Default placeholder photos until user uploads their own
const DEFAULT_PET_PHOTOS: Record<string, string> = {
  luna: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80",
  mochi: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&q=80",
};

interface Props {
  height?: number;
  showBack?: boolean;
  onBack?: () => void;
  onSettings?: () => void;
}

export function PetCoverHeader({ height = 240, showBack, onBack, onSettings }: Props) {
  const { theme, colors } = useTheme();
  const { activePet } = usePet();
  const insets = useSafeAreaInsets();
  const [petPhoto, setPetPhoto] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    loadPetPhoto(activePet.id).then(setPetPhoto);
    loadUserAvatar().then(setUserAvatar);
  }, [activePet.id]);

  const photoUri = petPhoto ?? DEFAULT_PET_PHOTOS[activePet.id] ?? DEFAULT_PET_PHOTOS.luna;
  const overlayColor = theme.isDark ? theme.palette.background : "#000000";

  const changePetPhoto = async () => {
    const result = await pickPhotoWithChoice({ aspect: [16, 9] });
    if (result?.uri) {
      setPetPhoto(result.uri);
      await savePetPhoto(activePet.id, result.uri);
    }
  };

  const changeUserAvatar = async () => {
    const result = await pickPhotoWithChoice({ aspect: [1, 1] });
    if (result?.uri) {
      setUserAvatar(result.uri);
      await saveUserAvatar(result.uri);
    }
  };

  // Safe-area top inset for status bar / camera notch
  const topPad = insets.top + 8;
  const totalHeight = height + topPad;

  return (
    <View style={[styles.container, { height: totalHeight }]}>
      <TouchableOpacity activeOpacity={0.85} onPress={changePetPhoto} style={StyleSheet.absoluteFillObject}>
        <ImageBackground source={{ uri: photoUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover">
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.1)", overlayColor + "F0", overlayColor]}
            locations={[0, 0.35, 0.85, 1]}
            style={StyleSheet.absoluteFillObject}
          />
        </ImageBackground>
      </TouchableOpacity>

      {/* Status row — pushed BELOW status bar by safe-area inset */}
      <View style={[styles.statusRow, { top: topPad }]} pointerEvents="box-none">
        {showBack && onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
            <ArrowLeft size={18} color="#fff" />
          </TouchableOpacity>
        ) : <View style={styles.iconBtn} />}

        <View style={{ flex: 1 }} pointerEvents="none" />

        <TouchableOpacity onPress={changePetPhoto} style={[styles.iconBtn, { marginRight: 8 }]}>
          <Camera size={16} color="#fff" />
        </TouchableOpacity>
        {onSettings && (
          <TouchableOpacity onPress={onSettings} style={styles.iconBtn}>
            <Settings size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* User avatar — positioned relative to safe-area-adjusted status row */}
      <TouchableOpacity
        onPress={changeUserAvatar}
        style={[styles.userAvatar, { top: topPad + 56, borderColor: theme.isDark ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.85)" }]}
        activeOpacity={0.75}
      >
        {userAvatar ? (
          <Image source={{ uri: userAvatar }} style={StyleSheet.absoluteFillObject} />
        ) : (
          <>
            <LinearGradient
              colors={theme.accentGradient ?? [colors.primary, colors.primaryDark]}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            />
            <User size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>

      {/* Pet name + meta at bottom */}
      <View style={styles.petInfo} pointerEvents="none">
        <Text style={styles.petName}>{activePet.name}</Text>
        <Text style={styles.petMeta}>{activePet.breed} · {activePet.age}y · {activePet.weight}{activePet.weightUnit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "relative", overflow: "hidden", justifyContent: "flex-end" },
  statusRow: { position: "absolute", left: 0, right: 0, paddingHorizontal: spacing.lg, flexDirection: "row", alignItems: "center", zIndex: 4 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" },
  userAvatar: { position: "absolute", right: 16, zIndex: 5, width: 56, height: 56, borderRadius: 28, borderWidth: 3, overflow: "hidden", alignItems: "center", justifyContent: "center", elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  petInfo: { position: "relative", zIndex: 2, padding: spacing.lg, paddingBottom: spacing.lg },
  petName: { fontSize: 32, fontWeight: "800", letterSpacing: -0.02 * 32, color: "#fff", lineHeight: 34, textShadowColor: "rgba(0,0,0,0.4)", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  petMeta: { fontSize: fontSize.sm, color: "rgba(255,255,255,0.95)", marginTop: 4, textShadowColor: "rgba(0,0,0,0.4)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
});
