import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, ChevronDown, ChevronUp } from "lucide-react-native";
import { allBreeds } from "../../src/data/breeds";
import { Breed } from "../../src/types";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { colors } from "../../src/theme/colors";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

const speciesFilters = [
  { id: "all", label: "All" },
  { id: "dog", label: "🐕 Dogs" },
  { id: "cat", label: "🐈 Cats" },
];

export default function BreedsScreen() {
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState<"all" | "dog" | "cat">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return allBreeds.filter((b) => {
      if (species !== "all" && b.species !== species) return false;
      if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, species]);

  const renderBreed = ({ item: breed }: { item: Breed }) => {
    const isExpanded = expandedId === breed.id;
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => setExpandedId(isExpanded ? null : breed.id)}>
        <Card style={styles.breedCard}>
          <View style={styles.breedHeader}>
            <Text style={styles.breedEmoji}>{breed.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.breedName}>{breed.name}</Text>
              <Text style={styles.breedGroup}>{breed.group} · {breed.origin}</Text>
            </View>
            {isExpanded ? <ChevronUp size={20} color={colors.textTertiary} /> : <ChevronDown size={20} color={colors.textTertiary} />}
          </View>
          <View style={styles.tagRow}>
            <Badge label={breed.size} variant="info" />
            <Badge label={breed.activity} variant="warning" />
            <Badge label={breed.grooming + " grooming"} variant="default" />
          </View>
          {isExpanded && (
            <View style={styles.expandedSection}>
              <Text style={styles.description}>{breed.description}</Text>
              <View style={styles.statsGrid}>
                <Stat label="Weight" value={breed.weight} />
                <Stat label="Lifespan" value={breed.lifespan} />
                <Stat label="Trainability" value={breed.trainability} />
                <Stat label="Shedding" value={breed.shedding} />
              </View>
              <View style={styles.traitsRow}>
                {breed.traits.map((t) => (
                  <Badge key={t} label={t} variant="purple" style={{ marginRight: 4, marginBottom: 4 }} />
                ))}
              </View>
              <Text style={styles.subheading}>Common Health Issues</Text>
              {breed.healthIssues.map((h) => (
                <Text key={h} style={styles.bullet}>• {h}</Text>
              ))}
              <View style={styles.compatGrid}>
                <Compat label="Good with kids" value={breed.goodWithKids} />
                <Compat label="Good with pets" value={breed.goodWithPets} />
                <Compat label="Apartment-friendly" value={breed.apartment} />
              </View>
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Breeds</Text>
        <Text style={styles.subtitle}>{filtered.length} breeds in database</Text>
      </View>

      <View style={styles.searchWrap}>
        <Search size={18} color={colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search breeds..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
        {speciesFilters.map((f) => (
          <TouchableOpacity
            key={f.id}
            onPress={() => setSpecies(f.id as any)}
            style={[styles.filterChip, species === f.id && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, species === f.id && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.id}
        renderItem={renderBreed}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function Compat({ label, value }: { label: string; value: boolean }) {
  return (
    <View style={styles.compatRow}>
      <Text style={{ fontSize: fontSize.lg }}>{value ? "✅" : "❌"}</Text>
      <Text style={styles.compatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  title: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  searchWrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginHorizontal: spacing.lg, marginVertical: spacing.md, paddingHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, paddingVertical: spacing.md, fontSize: fontSize.md, color: colors.text },
  filterScroll: { maxHeight: 50 },
  filterRow: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: fontSize.sm, fontWeight: "600", color: colors.text },
  filterTextActive: { color: "#FFF" },
  list: { padding: spacing.lg, paddingTop: spacing.sm },
  breedCard: { marginBottom: spacing.md },
  breedHeader: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.md },
  breedEmoji: { fontSize: 32 },
  breedName: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  breedGroup: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 1 },
  tagRow: { flexDirection: "row", gap: spacing.sm },
  expandedSection: { marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.borderLight },
  description: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.md },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  statBox: { flex: 1, minWidth: "45%", backgroundColor: colors.backgroundSecondary, padding: spacing.sm, borderRadius: radius.md },
  statLabel: { fontSize: fontSize.xs, color: colors.textTertiary, fontWeight: "600", textTransform: "uppercase" },
  statValue: { fontSize: fontSize.sm, color: colors.text, fontWeight: "600", marginTop: 2 },
  traitsRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.md },
  subheading: { fontSize: fontSize.sm, fontWeight: "700", color: colors.text, marginBottom: spacing.xs, marginTop: spacing.sm },
  bullet: { fontSize: fontSize.sm, color: colors.textSecondary, marginLeft: 4, marginBottom: 2 },
  compatGrid: { marginTop: spacing.md, gap: spacing.xs },
  compatRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  compatLabel: { fontSize: fontSize.sm, color: colors.text },
});
