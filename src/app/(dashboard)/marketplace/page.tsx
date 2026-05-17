"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Star, MapPin, ShieldCheck, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { marketplaceListings, type MarketplaceFilter, type MarketplaceListing } from "@/data/marketplace";

const filterTabs: { value: MarketplaceFilter; label: string; emoji: string }[] = [
  { value: "all", label: "Все", emoji: "📋" },
  { value: "puppy", label: "Щенки", emoji: "🐕" },
  { value: "kitten", label: "Котята", emoji: "🐱" },
  { value: "service", label: "Услуги", emoji: "🩺" },
  { value: "product", label: "Товары", emoji: "📦" },
];

function ListingCard({ listing, index }: { listing: MarketplaceListing; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 text-2xl">
              {listing.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{listing.title}</h3>
                <p className="text-sm font-bold text-green-600 whitespace-nowrap flex-shrink-0">
                  {listing.price.toLocaleString()} {listing.currency}
                </p>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{listing.description}</p>

              <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {listing.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  {listing.sellerRating}
                </span>
                {listing.sellerVerified && (
                  <span className="flex items-center gap-1 text-green-600">
                    <ShieldCheck className="h-3 w-3" />
                    Проверен
                  </span>
                )}
              </div>

              {/* Tags row for pets */}
              {(listing.type === "puppy" || listing.type === "kitten") && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {listing.vaccinated && <Badge variant="success" className="text-[10px]">Привит</Badge>}
                  {listing.pedigree && <Badge variant="info" className="text-[10px]">Родословная</Badge>}
                  {listing.microchipped && <Badge variant="purple" className="text-[10px]">Чип</Badge>}
                  {listing.healthChecked && <Badge variant="success" className="text-[10px]">Здоров</Badge>}
                  {listing.age && <Badge variant="default" className="text-[10px]">{listing.age}</Badge>}
                </div>
              )}

              {listing.type === "service" && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {listing.tags.map((t) => (
                    <Badge key={t} variant="default" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
              )}

              {listing.type === "product" && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {listing.tags.map((t) => (
                    <Badge key={t} variant="info" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium">{listing.sellerName}</span>
            </div>
            <Button variant="default" size="sm" className="text-xs h-7 px-3">
              {listing.type === "service" ? "Записаться" : listing.type === "product" ? "Купить" : "Написать"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MarketplacePage() {
  const [filter, setFilter] = useState<MarketplaceFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = filter === "all" ? marketplaceListings : marketplaceListings.filter((l) => l.type === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.breed.toLowerCase().includes(q) ||
          l.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [filter, search]);

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🛒 Маркетплейс</h1>
        <p className="text-sm text-gray-500">
          {marketplaceListings.length} объявлений — щенки, котята, услуги, товары
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по объявлениям..."
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-10 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map(({ value, label, emoji }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
              filter === value
                ? "bg-green-500 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span>{emoji}</span> {label}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400">{filtered.length} объявлений</p>

      {/* Listings */}
      <div className="space-y-3">
        {filtered.map((listing, i) => (
          <ListingCard key={listing.id} listing={listing} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-400 text-sm">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
