"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePet } from "@/contexts/PetContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function getMockResponses(name: string, score: number, weight: number, breed: string) {
  return {
    default: `Based on ${name}'s health profile, I can see overall health score is ${score}/100. Is there something specific you'd like to know about ${name}'s health?`,
    alt: `${name}'s ALT (liver enzyme) was 89 U/L in the latest bloodwork, which is above the normal range of 10-55 U/L. This 62% elevation is mild and likely related to the Omega-3 supplement. I recommend a recheck bloodwork in 3 months and pausing the supplement 2 weeks before the test for a cleaner baseline. This is not an emergency, but worth monitoring closely.`,
    dental: `Dr. Mitchell noted early tartar buildup (Grade 1) at ${name}'s last wellness visit. ${breed}s are prone to periodontal disease, which can affect heart and kidney health if untreated. I recommend booking a dental cleaning within 2-3 months and adding daily dental chews as preventive care.`,
    vaccine: `${name} is fully up to date on all core vaccines! ✅ Next due: Bordetella in November 2026. You're in great shape — no urgent vaccines needed.`,
    weight: `${name} weighs ${weight} kg, which is within the healthy range for a ${breed}. Weight has been stable since the last visit. Continue current diet, ensure 45-60 minutes of daily exercise, and avoid high-calorie treats.`,
    joint: `${breed}s have a genetic predisposition to hip dysplasia and joint issues. Current Omega-3 supplementation is a good start for joint health. I recommend: (1) glucosamine/chondroitin supplement, (2) hip x-ray at next annual exam, (3) avoid high-impact activities on hard surfaces, (4) maintain healthy weight.`,
  };
}

function getMockResponse(query: string, name: string, score: number, weight: number, breed: string): string {
  const responses = getMockResponses(name, score, weight, breed);
  const q = query.toLowerCase();
  if (q.includes("alt") || q.includes("liver") || q.includes("blood")) return responses.alt;
  if (q.includes("dental") || q.includes("teeth") || q.includes("tarter") || q.includes("tartar"))
    return responses.dental;
  if (q.includes("vaccine") || q.includes("vaccination") || q.includes("booster"))
    return responses.vaccine;
  if (q.includes("weight") || q.includes("diet") || q.includes("food")) return responses.weight;
  if (q.includes("joint") || q.includes("limp") || q.includes("hip")) return responses.joint;
  return responses.default;
}

export default function AssistantPage() {
  const { activePet } = usePet();

  const suggestedQuestions = [
    `What does ${activePet.name}'s elevated ALT mean?`,
    "When is the next vaccine due?",
    "Should I worry about dental health?",
    `Is ${activePet.weight} kg healthy for ${activePet.breed}?`,
    "What about joint health?",
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I'm ${activePet.name}'s AI health assistant. I have access to all health records, lab results, and vet reports. What would you like to know today?`,
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
      content: getMockResponse(text, activePet.name, activePet.healthScore, activePet.weight, activePet.breed),
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
          <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Health Assistant</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Powered by {activePet.name}&apos;s health data</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 rounded-full border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/40 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Demo AI Active
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
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
                    ? "bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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
              className="rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 transition-all hover:border-green-300 hover:text-green-700"
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
          placeholder={`Ask about ${activePet.name}'s health...`}
          className="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30"
        />
        <Button type="submit" disabled={!input.trim() || isTyping} size="md">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
