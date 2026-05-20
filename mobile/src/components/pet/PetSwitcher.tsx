import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Check, ChevronDown } from "lucide-react-native";
import { usePet } from "../../contexts/PetContext";
import { useColors } from "../../contexts/ThemeContext";
import { spacing, radius, fontSize } from "../../theme/spacing";

interface PetSwitcherProps {
  compact?: boolean;
}

export function PetSwitcher({ compact }: PetSwitcherProps) {
  const { activePet, pets, switchPet } = usePet();
  const colors = useColors();
  const styles = useStyles(colors);
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} style={[styles.trigger, compact && styles.triggerCompact]}>
        <Text style={styles.emoji}>{activePet.emoji}</Text>
        {!compact && <Text style={[styles.name, { color: activePet.color }]}>{activePet.name}</Text>}
        <ChevronDown size={14} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity activeOpacity={1} onPress={() => setOpen(false)} style={styles.backdrop}>
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>Switch pet</Text>
            {pets.map((pet) => {
              const isActive = pet.id === activePet.id;
              return (
                <TouchableOpacity
                  key={pet.id}
                  onPress={() => {
                    switchPet(pet.id);
                    setOpen(false);
                  }}
                  style={[styles.item, isActive && { backgroundColor: pet.color + "12" }]}
                >
                  <View style={[styles.avatar, { backgroundColor: pet.color + "22" }]}>
                    <Text style={styles.itemEmoji}>{pet.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{pet.name}</Text>
                    <Text style={styles.itemBreed}>{pet.breed} · {pet.age}y</Text>
                  </View>
                  {isActive && <Check size={18} color={pet.color} strokeWidth={3} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  trigger: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.full, backgroundColor: colors.backgroundSecondary },
  triggerCompact: { paddingHorizontal: spacing.xs, paddingVertical: 4 },
  emoji: { fontSize: 18 },
  name: { fontSize: fontSize.sm, fontWeight: "700" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" },
  menu: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.md, minWidth: 280, gap: 4 },
  menuTitle: { fontSize: fontSize.xs, fontWeight: "700", color: colors.textTertiary, textTransform: "uppercase", letterSpacing: 0.5, paddingHorizontal: spacing.sm, paddingBottom: spacing.xs },
  item: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.sm, borderRadius: radius.md },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  itemEmoji: { fontSize: 22 },
  itemName: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  itemBreed: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 1 },
});
