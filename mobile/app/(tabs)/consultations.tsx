import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Star, Clock, Video, MapPin } from "lucide-react-native";
import { consultants } from "../../src/data/consultants";
import { Consultant } from "../../src/types";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Button } from "../../src/components/ui/Button";
import { colors } from "../../src/theme/colors";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

const specialties = [
  { id: "all", label: "All" },
  { id: "veterinarian", label: "Vets" },
  { id: "cardiologist", label: "Cardiology" },
  { id: "dermatologist", label: "Dermatology" },
  { id: "trainer", label: "Trainers" },
  { id: "nutritionist", label: "Nutrition" },
  { id: "groomer", label: "Grooming" },
];

export default function ConsultationsScreen() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? consultants : consultants.filter((c) => c.specialty === filter);

  const renderItem = ({ item }: { item: Consultant }) => (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}><Text style={styles.emoji}>{item.emoji}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.metaRow}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviews}>({item.reviewCount} reviews)</Text>
          </View>
        </View>
        <View style={styles.priceCol}>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.duration}>{item.duration} min</Text>
        </View>
      </View>

      <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>

      <View style={styles.infoRow}>
        {(item.availability === "online" || item.availability === "both") && (
          <View style={styles.infoChip}><Video size={12} color={colors.info} /><Text style={styles.infoText}>Online</Text></View>
        )}
        {(item.availability === "offline" || item.availability === "both") && item.location && (
          <View style={styles.infoChip}><MapPin size={12} color={colors.textSecondary} /><Text style={styles.infoText}>{item.location}</Text></View>
        )}
        <View style={styles.infoChip}><Clock size={12} color={colors.primary} /><Text style={[styles.infoText, { color: colors.primary, fontWeight: "700" }]}>{item.nextAvailable}</Text></View>
      </View>

      <View style={styles.tagRow}>
        {item.tags.map((t) => <Badge key={t} label={t} variant="default" />)}
      </View>

      <Button title="Book Consultation" size="sm" style={{ marginTop: spacing.md }} />
    </Card>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Consultations</Text>
        <Text style={styles.headerSub}>Talk to certified pet professionals</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
        {specialties.map((f) => (
          <TouchableOpacity key={f.id} onPress={() => setFilter(f.id)} style={[styles.filterChip, filter === f.id && styles.filterChipActive]}>
            <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md },
  headerTitle: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text },
  headerSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  filterScroll: { maxHeight: 52 },
  filterRow: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: fontSize.sm, fontWeight: "600", color: colors.text },
  filterTextActive: { color: "#FFF" },
  list: { padding: spacing.lg, paddingTop: spacing.sm },
  card: { marginBottom: spacing.md },
  cardHeader: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.md },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.backgroundSecondary, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 28 },
  name: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  title: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  rating: { fontSize: fontSize.sm, fontWeight: "700", color: colors.text },
  reviews: { fontSize: fontSize.xs, color: colors.textTertiary },
  priceCol: { alignItems: "flex-end" },
  price: { fontSize: fontSize.lg, fontWeight: "800", color: colors.text },
  duration: { fontSize: fontSize.xs, color: colors.textTertiary },
  bio: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.md },
  infoRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  infoChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.full, backgroundColor: colors.backgroundSecondary },
  infoText: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: "500" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
});
