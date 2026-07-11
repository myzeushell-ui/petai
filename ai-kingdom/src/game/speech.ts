/**
 * Voice adapters over the browser Web Speech API.
 *
 * Both input (recognition) and output (synthesis) are optional: if the browser
 * lacks support, `isSupported()` returns false and the UI falls back to text.
 * These are the only implementations of SpeechInputProvider/OutputProvider in
 * v1; a future adapter (e.g. ElevenLabs) can implement the same interfaces.
 */

import type {
  SpeechInputProvider,
  SpeechInputHandlers,
  SpeechOutputProvider,
} from "./types";

/* --- Minimal typings for the non-standard SpeechRecognition API --- */
interface SpeechRecognitionResultLike {
  0: { transcript: string };
  isFinal: boolean;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: { length: number; [i: number]: SpeechRecognitionResultLike };
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export class WebSpeechInput implements SpeechInputProvider {
  private recognition: SpeechRecognitionLike | null = null;
  private lang: string;

  constructor(lang = "ru-RU") {
    this.lang = lang;
  }

  setLang(lang: string): void {
    this.lang = lang;
  }

  isSupported(): boolean {
    return getRecognitionCtor() !== null;
  }

  start(handlers: SpeechInputHandlers): void {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      handlers.onError("unsupported");
      return;
    }
    this.stop();
    const rec = new Ctor();
    rec.lang = this.lang;
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      if (interim) handlers.onInterim(interim);
      if (final) handlers.onFinal(final.trim());
    };
    rec.onerror = (e) => handlers.onError(e.error || "error");
    rec.onend = () => handlers.onEnd();

    this.recognition = rec;
    try {
      rec.start();
    } catch {
      handlers.onError("start_failed");
    }
  }

  stop(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
  }
}

export class WebSpeechOutput implements SpeechOutputProvider {
  isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  private pickVoice(lang: string): SpeechSynthesisVoice | null {
    try {
      const voices = window.speechSynthesis.getVoices();
      const exact = voices.find((v) => v.lang === lang);
      if (exact) return exact;
      const prefix = lang.split("-")[0];
      const partial = voices.find((v) => v.lang.startsWith(prefix));
      return partial ?? null;
    } catch {
      return null;
    }
  }

  speak(text: string, lang: string): void {
    if (!this.isSupported()) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;
      const voice = this.pickVoice(lang);
      if (voice) utter.voice = voice;
      utter.rate = 0.98;
      utter.pitch = 1;
      window.speechSynthesis.speak(utter);
    } catch {
      // Synthesis failures are non-fatal; text is always shown anyway.
    }
  }

  cancel(): void {
    if (!this.isSupported()) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export const speechInput = new WebSpeechInput();
export const speechOutput = new WebSpeechOutput();
