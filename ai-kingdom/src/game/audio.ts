/**
 * AudioManager — a tiny self-contained WebAudio synth (no asset files).
 *
 * Buses: master / music / ambience / battle / voice / ui. Nothing plays before
 * the first user gesture (autoplay policy) — call `unlock()` from a listener.
 * SFX are synthesized (oscillators + noise) so the game stays asset-free and
 * CSP-safe. Gracefully no-ops where WebAudio is unavailable.
 */

export type AudioBus = "master" | "music" | "ambience" | "battle" | "voice" | "ui";

class AudioManager {
  private ctx: AudioContext | null = null;
  private buses: Partial<Record<AudioBus, GainNode>> = {};
  private ambienceNode: AudioBufferSourceNode | null = null;
  private enabled = true;
  private unlocked = false;
  private volumes: Record<AudioBus, number> = {
    master: 0.8,
    music: 0.5,
    ambience: 0.4,
    battle: 0.7,
    voice: 0.9,
    ui: 0.6,
  };

  setEnabled(on: boolean) {
    this.enabled = on;
    if (this.buses.master) this.buses.master.gain.value = on ? this.volumes.master : 0;
    if (!on) this.stopAmbience();
  }
  isEnabled() {
    return this.enabled;
  }

  setVolume(bus: AudioBus, v: number) {
    this.volumes[bus] = Math.max(0, Math.min(1, v));
    const node = this.buses[bus];
    if (node) node.gain.value = this.volumes[bus] * (bus === "master" && !this.enabled ? 0 : 1);
  }

  /** Must be called from within a user-gesture handler at least once. */
  unlock() {
    if (this.unlocked) return;
    try {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
      const master = this.ctx.createGain();
      master.gain.value = this.enabled ? this.volumes.master : 0;
      master.connect(this.ctx.destination);
      this.buses.master = master;
      for (const bus of ["music", "ambience", "battle", "voice", "ui"] as AudioBus[]) {
        const g = this.ctx.createGain();
        g.gain.value = this.volumes[bus];
        g.connect(master);
        this.buses[bus] = g;
      }
      this.unlocked = true;
      void this.ctx.resume();
    } catch {
      /* no audio available */
    }
  }

  private ready(): boolean {
    if (!this.enabled || !this.ctx) return false;
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return true;
  }

  private tone(bus: AudioBus, freq: number, dur: number, type: OscillatorType = "sine", when = 0, gain = 0.2) {
    if (!this.ready() || !this.ctx) return;
    const t0 = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.buses[bus] ?? this.buses.master!);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  private noise(bus: AudioBus, dur: number, when = 0, gain = 0.15, hp = 800) {
    if (!this.ready() || !this.ctx) return;
    const t0 = this.ctx.currentTime + when;
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = hp;
    const g = this.ctx.createGain();
    g.gain.value = gain;
    src.connect(filter);
    filter.connect(g);
    g.connect(this.buses[bus] ?? this.buses.master!);
    src.start(t0);
  }

  /* ---- named cues ---- */
  ui() {
    this.tone("ui", 520, 0.06, "triangle", 0, 0.12);
  }
  orderAccepted() {
    this.tone("ui", 440, 0.09, "sine", 0, 0.15);
    this.tone("ui", 660, 0.12, "sine", 0.07, 0.13);
  }
  horn() {
    this.tone("music", 180, 0.5, "sawtooth", 0, 0.16);
    this.tone("music", 240, 0.6, "sawtooth", 0.08, 0.13);
  }
  clash() {
    this.noise("battle", 0.25, 0, 0.22, 1500);
    this.tone("battle", 160, 0.12, "square", 0, 0.1);
  }
  arrows() {
    this.noise("battle", 0.18, 0, 0.12, 2500);
  }
  crisis() {
    this.tone("battle", 300, 0.4, "sawtooth", 0, 0.18);
    this.tone("battle", 150, 0.5, "sawtooth", 0.05, 0.14);
  }
  victory() {
    [392, 494, 587, 784].forEach((f, i) => this.tone("music", f, 0.5, "triangle", i * 0.14, 0.18));
  }
  defeat() {
    [330, 262, 196].forEach((f, i) => this.tone("music", f, 0.6, "sine", i * 0.2, 0.18));
  }

  /** Soft looping wind ambience. */
  startAmbience() {
    if (!this.ready() || !this.ctx || this.ambienceNode) return;
    const dur = 3;
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    const g = this.ctx.createGain();
    g.gain.value = 0.12;
    src.connect(filter);
    filter.connect(g);
    g.connect(this.buses.ambience ?? this.buses.master!);
    src.start();
    this.ambienceNode = src;
  }
  stopAmbience() {
    try {
      this.ambienceNode?.stop();
    } catch {
      /* already stopped */
    }
    this.ambienceNode = null;
  }
}

export const audio = new AudioManager();

/** Install a one-time gesture listener that unlocks audio. */
export function installAudioUnlock() {
  if (typeof window === "undefined") return;
  const handler = () => {
    audio.unlock();
    window.removeEventListener("pointerdown", handler);
    window.removeEventListener("keydown", handler);
  };
  window.addEventListener("pointerdown", handler);
  window.addEventListener("keydown", handler);
}
