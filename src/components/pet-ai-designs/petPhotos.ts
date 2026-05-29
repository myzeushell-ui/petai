/**
 * Real pet photos (high-quality Unsplash) used across all 20
 * theme layouts. Replaces emoji avatars with photorealistic
 * pet imagery for the hero cards.
 *
 * Cached by Unsplash CDN — fast load globally.
 */

export const DEFAULT_PET_PHOTOS: Record<string, string> = {
  // Luna — Golden Retriever (active pet by default)
  "pet-001": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&q=80",
  // Mochi — British Shorthair cat
  "pet-002": "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=1200&q=80",
};

/** Square-cropped variants for round avatars. */
export const PET_AVATAR_PHOTOS: Record<string, string> = {
  "pet-001": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=240&h=240&q=80&fit=crop",
  "pet-002": "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=240&h=240&q=80&fit=crop",
};

/** Wide hero variants for cover layouts. */
export const PET_HERO_PHOTOS: Record<string, string> = {
  "pet-001": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=1600&h=900&q=85&fit=crop",
  "pet-002": "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=1600&h=900&q=85&fit=crop",
};

/** Resolve pet photo with sensible fallback. */
export function getPetPhoto(
  petId: string,
  variant: "default" | "avatar" | "hero" = "default",
): string {
  const map =
    variant === "avatar" ? PET_AVATAR_PHOTOS :
    variant === "hero"   ? PET_HERO_PHOTOS :
    DEFAULT_PET_PHOTOS;
  return map[petId] ?? map["pet-001"];
}
