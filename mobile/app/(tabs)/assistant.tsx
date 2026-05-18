import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Send, Bot, Sparkles } from "lucide-react-native";
import { usePet } from "../../src/contexts/PetContext";
import { colors } from "../../src/theme/colors";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const suggestions = [
  "Why are ALT levels elevated?",
  "When should I do dental cleaning?",
  "Is my pet's weight healthy?",
  "What vaccines are due?",
  "Best food for joint health?",
];

function generateResponse(query: string, petName: string): string {
  const q = query.toLowerCase();
  if (q.includes("alt") || q.includes("liver")) {
    return `${petName}'s ALT level (128 U/L) is slightly elevated. This usually means mild liver stress and can come from fatty foods, certain medications, or early liver conditions. I'd recommend: (1) switch to low-fat treats, (2) recheck in 4-6 weeks, (3) ask your vet about a bile acids test if levels stay elevated.`;
  }
  if (q.includes("dental") || q.includes("teeth")) {
    return `Based on ${petName}'s age and breed, a professional dental cleaning is recommended within 2 months. Tartar buildup after age 3 is common in Golden Retrievers. Daily tooth brushing with pet-safe toothpaste can extend the time between cleanings.`;
  }
  if (q.includes("weight")) {
    return `${petName}'s current weight is ideal for a female Golden Retriever (25-32 kg range). Maintain with 2 cups of high-quality kibble twice daily and 30 min daily exercise.`;
  }
  if (q.includes("vaccine") || q.includes("vaccin")) {
    return `${petName} is current on core vaccines (DHPP, Rabies). Next due: Rabies booster in March 2027 (3-year). Bordetella (kennel cough) due in November.`;
  }
  if (q.includes("joint") || q.includes("food")) {
    return `For joint health, look for foods with: glucosamine (500-1500mg/day), chondroitin, omega-3 (EPA/DHA from fish oil), and green-lipped mussel. Top picks: Hill's Science Diet Healthy Mobility, Royal Canin Mobility Support, Purina Pro Plan JM.`;
  }
  return `I can help with ${petName}'s health, nutrition, breeding, vaccinations, and more. Try asking about lab results, weight management, vaccines, or training!`;
}

export default function AssistantScreen() {
  const { activePet } = usePet();
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", text: `Hi! I'm your AI vet assistant. Ask me anything about ${activePet.name}'s health, behavior, or care.` },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply: Message = { id: (Date.now() + 1).toString(), role: "assistant", text: generateResponse(text, activePet.name) };
      setMessages((m) => [...m, reply]);
      setTyping(false);
    }, 900);
  };

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, typing]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerIcon}><Bot size={20} color={colors.primary} /></View>
        <View>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <Text style={styles.headerSub}>Powered by veterinary AI</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
        <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.msgRow, msg.role === "user" && styles.msgRowUser]}>
              <View style={[styles.bubble, msg.role === "user" ? styles.bubbleUser : styles.bubbleBot]}>
                <Text style={[styles.bubbleText, msg.role === "user" && { color: "#FFF" }]}>{msg.text}</Text>
              </View>
            </View>
          ))}
          {typing && (
            <View style={styles.msgRow}>
              <View style={[styles.bubble, styles.bubbleBot, styles.typingBubble]}>
                <View style={styles.typingDot} /><View style={styles.typingDot} /><View style={styles.typingDot} />
              </View>
            </View>
          )}

          {messages.length === 1 && (
            <View style={styles.suggestionsWrap}>
              <View style={styles.sparkleRow}>
                <Sparkles size={14} color={colors.textTertiary} />
                <Text style={styles.suggestionsLabel}>Suggested questions</Text>
              </View>
              {suggestions.map((s) => (
                <TouchableOpacity key={s} style={styles.suggestion} onPress={() => send(s)}>
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={`Ask about ${activePet.name}...`}
            placeholderTextColor={colors.textTertiary}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => send(input)}>
            <Send size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primaryLight + "80", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  headerSub: { fontSize: fontSize.xs, color: colors.textSecondary },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  msgRow: { marginBottom: spacing.md, alignItems: "flex-start" },
  msgRowUser: { alignItems: "flex-end" },
  bubble: { maxWidth: "85%", paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderRadius: radius.xl },
  bubbleUser: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleBot: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: fontSize.md, color: colors.text, lineHeight: 21 },
  typingBubble: { flexDirection: "row", gap: 4, paddingVertical: spacing.md },
  typingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.textTertiary },
  suggestionsWrap: { marginTop: spacing.lg, gap: spacing.sm },
  sparkleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs },
  suggestionsLabel: { fontSize: fontSize.xs, color: colors.textTertiary, fontWeight: "600", textTransform: "uppercase" },
  suggestion: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md },
  suggestionText: { fontSize: fontSize.sm, color: colors.text },
  inputRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, backgroundColor: colors.backgroundSecondary, borderRadius: radius.xl, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontSize: fontSize.md, color: colors.text },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
});
