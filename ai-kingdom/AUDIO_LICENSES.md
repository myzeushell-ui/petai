# AI Kingdom — Audio Licenses

## Summary: no third-party audio files.

All sound in AI Kingdom is **synthesized at runtime** by `src/game/audio.ts`
using the Web Audio API (oscillators + filtered noise). There are **no sampled
audio assets, no music files, and no external audio dependencies** — nothing is
downloaded, streamed, or bundled.

Consequences:
- Nothing to license, attribute, or clear. The synth code is part of this
  repository under the project's own terms.
- The game stays fully self-contained and CSP-safe (the shareable single-file
  artifact needs no external audio host).
- Autoplay policy is respected: the `AudioContext` is created only after the
  first user gesture (`installAudioUnlock`), so no sound plays unprompted.

### Cues (all synthesized)
ambience (wind loop) · horn (council/among the phases) · order-accepted ·
clash · arrows · crisis · victory · defeat · UI blip.

### If sampled audio is added later
Record each file here with: file path, source, author, license (e.g. CC0 /
CC-BY), and a link. Prefer CC0 or CC-BY sources (e.g. freesound.org) and keep
attributions in this file. Bundle only files whose license permits
redistribution in this repo and in the built artifact.
