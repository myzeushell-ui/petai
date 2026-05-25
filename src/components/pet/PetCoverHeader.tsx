"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Settings, User } from "lucide-react";
import { usePet } from "@/contexts/PetContext";
import { useVariant } from "@/contexts/VariantContext";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";

/**
 * Facebook-cover-style header for the active pet.
 * Big photo, name overlay, user avatar, settings shortcut.
 * Mirrors the design from public/design-previews.html v2 and
 * the mobile app's PetCoverHeader component (commit f36ee9b).
 */

const DEFAULT_PET_PHOTOS: Record<string, string> = {
  "pet-001": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&q=80", // Luna — golden retriever
  "pet-002": "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=1200&q=80", // Mochi — british shorthair
};

const STORAGE_PET_PHOTO = (petId: string) => `petai:photo:pet:${petId}`;
const STORAGE_USER_AVATAR = "petai:photo:user";

const UI = {
  changePhoto: { en: "Change cover photo", ru: "Сменить фото" },
  settings:    { en: "Settings",           ru: "Настройки" },
  avatar:      { en: "User avatar",        ru: "Аватар пользователя" },
};

interface PetCoverHeaderProps {
  height?: number;       // default 280
  showSettings?: boolean;
}

export function PetCoverHeader({ height = 280, showSettings = true }: PetCoverHeaderProps) {
  const { activePet } = usePet();
  const { colors } = useVariant();
  const { locale } = useLocale();

  const [petPhoto, setPetPhoto] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const petFileRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);

  // Restore photos from localStorage on mount + when active pet changes
  useEffect(() => {
    try {
      const storedPet = window.localStorage.getItem(STORAGE_PET_PHOTO(activePet.id));
      setPetPhoto(storedPet);
      const storedAvatar = window.localStorage.getItem(STORAGE_USER_AVATAR);
      setUserAvatar(storedAvatar);
    } catch {
      /* SSR */
    }
  }, [activePet.id]);

  const photoUrl = petPhoto ?? DEFAULT_PET_PHOTOS[activePet.id] ?? DEFAULT_PET_PHOTOS["pet-001"];

  const onPetPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setPetPhoto(url);
      try {
        window.localStorage.setItem(STORAGE_PET_PHOTO(activePet.id), url);
      } catch {
        /* quota */
      }
    };
    reader.readAsDataURL(file);
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setUserAvatar(url);
      try {
        window.localStorage.setItem(STORAGE_USER_AVATAR, url);
      } catch {
        /* quota */
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl -mt-2"
      style={{ height }}
    >
      {/* Cover photo */}
      <button
        onClick={() => petFileRef.current?.click()}
        className="absolute inset-0 group cursor-pointer"
        aria-label={UI.changePhoto[locale]}
      >
        {/* Using <img> rather than next/image for instant local-blob support */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt={activePet.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/80" />
      </button>

      {/* Hidden file inputs */}
      <input
        ref={petFileRef}
        type="file"
        accept="image/*"
        onChange={onPetPhotoChange}
        className="hidden"
      />
      <input
        ref={avatarFileRef}
        type="file"
        accept="image/*"
        onChange={onAvatarChange}
        className="hidden"
      />

      {/* Top action row */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div /> {/* placeholder for symmetry */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Camera */}
          <button
            onClick={() => petFileRef.current?.click()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/55 transition-colors"
            aria-label={UI.changePhoto[locale]}
          >
            <Camera className="h-4 w-4" />
          </button>
          {showSettings && (
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/55 transition-colors"
              aria-label={UI.settings[locale]}
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* User avatar (top-right, slightly below action row) */}
      <button
        onClick={() => avatarFileRef.current?.click()}
        className="absolute top-16 right-4 z-10 h-14 w-14 rounded-full overflow-hidden border-2 border-white/60 shadow-xl hover:border-white/90 transition-all"
        aria-label={UI.avatar[locale]}
      >
        {userAvatar ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={userAvatar} alt={UI.avatar[locale]} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className={cn("absolute inset-0 flex items-center justify-center bg-gradient-to-br text-white", colors.avatarGradient)}>
            <User className="h-6 w-6" />
          </div>
        )}
      </button>

      {/* Pet name + meta at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5 pointer-events-none">
        <h1 className="text-3xl font-extrabold text-white leading-none tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
          {activePet.name}
        </h1>
        <p className="mt-1.5 text-sm font-medium text-white/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
          {activePet.breed} · {activePet.age}{locale === "ru" ? " г" : "y"} · {activePet.weight}{activePet.weightUnit}
        </p>
      </div>
    </motion.div>
  );
}
