"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { primaryPet } from "@/data/demoPets";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const mockResponses: Record<string, string> = {
  default: `Based on ${primaryPet.name}'s health profile, I can see she's doing well overall with a health score of ${primaryPet.healthScore}/100. Is there something specific you'd like to know about her health?`,
  alt: `Luna's ALT (liver enzyme) was 89 U/L in her November bloodwork, which is above the normal range of 10-55 U/L. This 62% elevation is mild and likely related to her new Omega-3 supplement. I recommend a recheck bloodwork in February as Dr. Mitchell suggested, and pausing the supplement 2 weeks before the test for a cleaner baseline. This is not an emergency, but worth monitoring closely.`,
  dental: `Dr. Mitchell noted early tartar buildup (Grade 1) at Luna's November wellness visit. Golden Retrievers are prone to periodontal disease, which can affect heart and kidney health if untreated. At age 4, this is the ideal window for a professional dental cleaning. I recommend booking an appointment within 2-3 months and adding daily dental chews as preventive care. Would you like help finding clinics near you?`,
  vaccine: `Luna is fully up to date on all core vaccines! ✅ Her DHPP booster was administered on November 20, 2025. The Rabies 3-year vaccine was given in November 2024. Next due: Bordetella (Kennel Cough) in November 2026 and DHPP booster in November 2026. You're in great shape — no urgent vaccines needed.`,
  weight: `Luna weighs 28.5 kg, which is within the healthy range for a female Golden Retriever (typically 25-32 kg). Her weight has been stable since her last visit. To maintain this: continue her current diet, ensure 45-60 minutes of daily exercise, and avoid high-calorie treats. I'd recommend weighing her every 2-3 months at home or at the vet.`,
  joint: `Luna had a limping episode in September 2025 that resolved with rest. Golden Retrievers have a genetic predisposition to hip dysplasia and joint issues, typically emerging between ages 3-6. Her current Omega-3 supplementation is a good start for joint health. I recommend: (1) Adding a glucosamine/chondroitin supplement, (2) Requesting a hip x-ray at her next annual exam, (3) Avoiding high-impact activities on hard surfaces, (4) Keeping her weight in the healthy range. This is manageable with early intervention.`,
};

function getMockResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("alt") || q.includes("liver") || q.includes("blood")) return mockResponses.alt;
  if (q.includes("dental") || q.includes("teeth") || q.includes("tarter") || q.includes("tartar"))
    return mockResponses.dental;
  if (q.includes("vaccine") || q.includes("vaccination") || q.includes("booster"))
    return mockResponses.vaccine;
  if (q.includes("weight") || q.includes("diet") || q.includes("food")) return mockResponses.weight;
  if (q.includes("joint") || q.includes("limp") || q.includes("hip")) return mockResponses.joint;
  return mockResponses.default;
}

const suggestedQuestions = [
  "What does Luna's elevated ALT mean?",
  "When is her next vaccine due?",
  "Should I be worried about her dental health?",
  "Is her weight healthy for her breed?",
  "What about her joint issue from September?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I'm Luna's AI health assistant. I have access to all of her health records, lab results, and vet reports. What would you like to know about her health today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getMockResponse(text),
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
          <Bot className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI Health Assistant</h1>
          <p className="text-sm text-gray-500">Powered by {primaryPet.name}&apos;s health data</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Demo AI Active
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm ${
                  msg.role === "assistant" ? "bg-indigo-100" : "bg-green-500"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot className="h-4 w-4 text-indigo-600" />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-gray-50 text-gray-800"
                    : "bg-green-500 text-white"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                  <Bot className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-gray-50 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-gray-400"
                      animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {messages.length === 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-all hover:border-green-300 hover:text-green-700"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${primaryPet.name}'s health...`}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
        />
        <Button type="submit" disabled={!input.trim() || isTyping} size="md">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
