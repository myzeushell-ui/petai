import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Star, MapPin, ShieldCheck } from "lucide-react-native";
import { marketplaceListings } from "../../src/data/marketplace";
import { MarketplaceListing } from "../../src/types";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Button } from "../../src/components/ui/Button";
import { colors } from "../../src/theme/colors";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

const filters = [
  { id: "all", label: "All" },
  { id: "puppy", label: "Puppies" },
  { id: "kitten", label: "Kittens" },
  { id: "service", label: "Services" },
  { id: "product", label: "Products" },
];

export default function MarketplaceScreen() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? marketplaceListings : marketplaceListings.filter((l) => l.type === filter);

  const renderItem = ({ item }: { item: MarketplaceListing }) => (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.emojiBox}><Text style={styles.emoji}>{item.emoji}</Text></View>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            {item.sellerVerified && <ShieldCheck size={16} color={colors.primary} />}
          </View>
          <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
        </View>
      </View>

      <View style={styles.tagRow}>
        {item.vaccinated && <Badge label="Vaccinated" variant="success" />}
        {item.pedigree && <Badge label="Pedigree" variant="purple" />}
        {item.microchipped && <Badge label="Chipped" variant="info" />}
        {item.tags.slice(0, 2).map((t) => <Badge key={t} label={t} variant="default" />)}
      </View>

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.price}>${item.price.toLocaleString()}</Text>
          <View style={styles.locationRow}>
            <MapPin size={11} color={colors.textTertiary} />
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </View>
        <View style={styles.sellerInfo}>
          <View style={styles.ratingRow}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.rating}>{item.sellerRating}</Text>
          </View>
          <Text style={styles.seller} numberOfLines={1}>{item.sellerName}</Text>
        </View>
      </View>

      <Button title={item.type === "service" ? "Book" : item.type === "product" ? "Buy" : "Message"} size="sm" style={{ marginTop: spacing.md }} />
    </Card>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <Text style={styles.headerSub}>Verified breeders, services, and products</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
        {filters.map((f) => (
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
  emojiBox: { width: 56, height: 56, borderRadius: radius.lg, backgroundColor: colors.backgroundSecondary, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 32 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: 2 },
  title: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 },
  desc: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 18 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: spacing.md },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  price: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  location: { fontSize: fontSize.xs, color: colors.textTertiary },
  sellerInfo: { alignItems: "flex-end" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 2 },
  rating: { fontSize: fontSize.sm, fontWeight: "700", color: colors.text },
  seller: { fontSize: fontSize.xs, color: colors.textTertiary, maxWidth: 140 },
});
