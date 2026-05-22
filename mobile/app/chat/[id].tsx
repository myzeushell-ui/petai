import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Phone, Send, Video } from "lucide-react-native";
import { useColors, useTheme } from "../../src/contexts/ThemeContext";
import { GradientBackground } from "../../src/components/ui/GradientBackground";
import { useT } from "../../src/i18n";
import { mockChats, ChatMessage } from "../../src/data/partnerData";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { theme } = useTheme();
  const t = useT();
  const styles = useStyles(colors);
  const thread = mockChats.find((c) => c.id === id);
  const [messages, setMessages] = useState<ChatMessage[]>(thread?.messages ?? []);
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => { setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100); }, [messages]);

  if (!thread) return <View style={{ flex: 1, backgroundColor: colors.background }}><Text style={{ color: colors.text, padding: 40 }}>Chat not found</Text></View>;

  const send = () => {
    if (!input.trim()) return;
    const msg: ChatMessage = { id: Date.now().toString(), from: "partner", text: input, at: new Date().toISOString() };
    setMessages((m) => [...m, msg]);
    setInput("");
    // Mock auto-reply after 2s
    setTimeout(() => {
      const reply: ChatMessage = { id: (Date.now() + 1).toString(), from: "customer", text: "Thanks, got it 👍", at: new Date().toISOString() };
      setMessages((m) => [...m, reply]);
    }, 2500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.palette.background }}>
      <Stack.Screen options={{
        headerShown: true,
        title: `${thread.customerName} · ${thread.petName}`,
        headerLeft: () => <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}><ArrowLeft size={22} color={colors.text} /></TouchableOpacity>,
        headerRight: () => (
          <View style={{ flexDirection: "row", gap: 4, marginRight: 4 }}>
            <TouchableOpacity onPress={() => Linking.openURL("tel:+15555550100")} style={styles.iconBtn}><Phone size={18} color={colors.text} /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}><Video size={18} color={colors.text} /></TouchableOpacity>
          </View>
        ),
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: "700", color: colors.text, fontSize: fontSize.md },
        headerTintColor: colors.text,
      }} />
      <GradientBackground>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={80}>
          <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
            {messages.map((m) => {
              const isMe = m.from === "partner";
              return (
                <View key={m.id} style={[styles.row, isMe && styles.rowMe]}>
                  <View style={[styles.bubble, isMe ? { backgroundColor: colors.primary } : { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}>
                    <Text style={[styles.text, isMe && { color: "#fff" }]}>{m.text}</Text>
                    <Text style={[styles.time, { color: isMe ? "rgba(255,255,255,0.6)" : colors.textTertiary }]}>
                      {new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  </View>
                </View>
              );
            })}
            {messages.length === 0 && (
              <Text style={[styles.empty, { color: colors.textTertiary }]}>{t("no_messages")}</Text>
            )}
          </ScrollView>
          <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text }]}
              value={input} onChangeText={setInput}
              placeholder={t("send_message")} placeholderTextColor={colors.textTertiary}
              onSubmitEditing={send} returnKeyType="send"
            />
            <TouchableOpacity onPress={send} disabled={!input.trim()} style={[styles.sendBtn, { backgroundColor: colors.primary, opacity: input.trim() ? 1 : 0.5 }]}>
              <Send size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </GradientBackground>
    </View>
  );
}

const useStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.sm },
  row: { alignItems: "flex-start" },
  rowMe: { alignItems: "flex-end" },
  bubble: { maxWidth: "82%", padding: spacing.md, borderRadius: radius.xl },
  text: { fontSize: fontSize.md, color: colors.text, lineHeight: 21 },
  time: { fontSize: 10, marginTop: 4 },
  empty: { fontSize: fontSize.sm, textAlign: "center", marginTop: 40 },
  inputBar: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, borderTopWidth: 1 },
  input: { flex: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.full, fontSize: fontSize.md },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
