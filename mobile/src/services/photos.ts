import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const PET_PHOTO_KEY = (petId: string) => `@petai:pet-photo:${petId}`;
const USER_AVATAR_KEY = "@petai:user-avatar";

export interface PhotoResult {
  uri: string;
  base64?: string;
}

async function ensurePermission(kind: "camera" | "library"): Promise<boolean> {
  if (kind === "camera") {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Camera access denied", "Please enable camera in your phone settings.");
      return false;
    }
  } else {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Photos access denied", "Please enable photo library in your phone settings.");
      return false;
    }
  }
  return true;
}

export async function pickFromGallery(opts?: { base64?: boolean; aspect?: [number, number] }): Promise<PhotoResult | null> {
  const ok = await ensurePermission("library");
  if (!ok) return null;
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    base64: opts?.base64 ?? false,
    allowsEditing: true,
    aspect: opts?.aspect ?? [16, 9],
  });
  if (res.canceled || !res.assets?.[0]) return null;
  const asset = res.assets[0];
  return { uri: asset.uri, base64: asset.base64 ?? undefined };
}

export async function takePhoto(opts?: { base64?: boolean; aspect?: [number, number] }): Promise<PhotoResult | null> {
  const ok = await ensurePermission("camera");
  if (!ok) return null;
  const res = await ImagePicker.launchCameraAsync({
    quality: 0.8,
    base64: opts?.base64 ?? false,
    allowsEditing: true,
    aspect: opts?.aspect ?? [16, 9],
  });
  if (res.canceled || !res.assets?.[0]) return null;
  const asset = res.assets[0];
  return { uri: asset.uri, base64: asset.base64 ?? undefined };
}

export async function pickPhotoWithChoice(opts?: { base64?: boolean; aspect?: [number, number] }): Promise<PhotoResult | null> {
  return new Promise((resolve) => {
    Alert.alert("Add photo", "Choose source", [
      { text: "Camera", onPress: async () => resolve(await takePhoto(opts)) },
      { text: "Gallery", onPress: async () => resolve(await pickFromGallery(opts)) },
      { text: "Cancel", style: "cancel", onPress: () => resolve(null) },
    ]);
  });
}

// Persistence
export async function savePetPhoto(petId: string, uri: string): Promise<void> {
  await AsyncStorage.setItem(PET_PHOTO_KEY(petId), uri);
}

export async function loadPetPhoto(petId: string): Promise<string | null> {
  return await AsyncStorage.getItem(PET_PHOTO_KEY(petId));
}

export async function saveUserAvatar(uri: string): Promise<void> {
  await AsyncStorage.setItem(USER_AVATAR_KEY, uri);
}

export async function loadUserAvatar(): Promise<string | null> {
  return await AsyncStorage.getItem(USER_AVATAR_KEY);
}
