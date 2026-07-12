# AI Kingdom — AI Provider Setup

> **Status: PLANNED (V2).** The provider gateway described here does **not exist
> yet**. Today AI Kingdom runs **entirely on the local, deterministic**
> command interpreter (`localInterpreter`) and dialogue provider
> (`localDialogue`). There is **no server, no network call, and no LLM** anywhere
> in the current build. This document specifies the intended V2 gateway so it can
> be implemented against the existing adapter interfaces without changing game
> rules.

---

## 1. Why a gateway (and why server-side)

V1 already isolates "AI" behind swappable interfaces in `src/game/types.ts`:

- `CommandInterpreter.parse(text, ctx): ParsedCommand` — natural language → a
  structured order.
- `DialogueProvider` — in-character officer lines from a structured situation.

The V1 implementations of both are **local and deterministic**. The V2 gateway is
simply **another implementation** of these same interfaces that can call an
external model — swapped in without touching the simulation.

It must be **server-side** for one reason above all: **API keys must never reach
the browser.** The game client is static and untrusted; any provider key it could
read, an end user could exfiltrate. So all provider calls originate from a small
server the client talks to over its own endpoint.

```
browser (client)  ──event──▶  gateway (server)  ──▶  provider (Anthropic/OpenAI/Ollama)
   keeps NO keys                 holds the key,          returns model output
                                 validates + falls back
```

---

## 2. Environment variables — [Planned]

All configuration lives in **server-side** environment variables. None of these
are exposed to or read by the browser bundle.

| Variable | Values / example | Meaning |
|---|---|---|
| `AI_PROVIDER` | `local` \| `anthropic` \| `openai` \| `ollama` | Which backend to use. **`local` is the current default** and needs no keys. |
| `AI_MODEL` | e.g. a provider model id | Model to request when the provider is remote. |
| `ANTHROPIC_API_KEY` | secret | Required only when `AI_PROVIDER=anthropic`. Server-side only. |
| `OPENAI_API_KEY` | secret | Required only when `AI_PROVIDER=openai`. Server-side only. |
| `OLLAMA_BASE_URL` | e.g. `http://localhost:11434` | Base URL for a local/self-hosted Ollama when `AI_PROVIDER=ollama`. |

Rules:

- **`local` requires nothing.** With `AI_PROVIDER=local` the gateway is bypassed
  entirely and the game is 100% playable offline on the deterministic engine —
  which is exactly how it runs today.
- Keys are read by the **server only**. They are never sent to, embedded in, or
  logged by the client.
- Missing/invalid keys for a selected remote provider must **degrade to local**,
  not crash.

---

## 3. Call discipline — [Planned]

- **Event-driven only, never per tick.** The simulation ticks at ~10 Hz; calling
  a model on every tick would be ruinous and non-deterministic. Provider calls
  fire only on discrete player/world events — an order submitted, a crisis beat,
  a council exchange, a report request.
- **Bounded and cancellable.** Each call has a timeout and can be superseded if
  the game state moves on.
- **Deterministic core preserved.** The strategic simulation and battle math stay
  fully deterministic and local; the model only shapes interpretation and
  dialogue, behind the existing interfaces.

---

## 4. Validation & fallback — [Planned]

Model output is **never trusted blindly**:

1. **Schema validation.** A provider's parse response must validate against the
   existing `ParsedCommand` contract (action, officer, target, unit type/count,
   conditions, risk, confidence, missing fields). Dialogue responses must be
   plain strings within length bounds.
2. **Fallback on any failure.** On timeout, network error, malformed JSON,
   schema-mismatch, or low confidence, the gateway **falls back to the local
   deterministic implementation** for that call. The player experiences a
   coherent game either way.
3. **No silent rule changes.** The model can only produce data that flows through
   the same validated contracts the local path uses; it cannot inject new game
   effects.

This mirrors how V1 already behaves when voice recognition fails: the recognised
text is always shown and text input is always available — the system never
dead-ends.

---

## 5. Implementation sketch — [Planned]

- **Server:** a thin service exposing, e.g., `POST /interpret` and
  `POST /dialogue`. It reads the env vars above, calls the selected provider,
  validates the response against the shared schema, and returns either the parsed
  result or a `fallback: true` marker.
- **Client adapters:** `RemoteCommandInterpreter` and `RemoteDialogueProvider`
  that implement the `CommandInterpreter` / `DialogueProvider` interfaces by
  calling the server, and transparently defer to `localInterpreter` /
  `localDialogue` on any non-success. These are wired in place of the local
  instances in `engine.submitCommand` / `GameContext` — the game math is
  unchanged because the contracts (`ParsedCommand`, dialogue strings) are the
  same.
- **Voice (orthogonal):** `SpeechInputProvider` / `SpeechOutputProvider` can
  likewise be swapped (e.g. Whisper / a TTS service) behind the same server, with
  the browser Web Speech implementation as the offline fallback. This is
  independent of the text/LLM gateway.

---

## 6. Summary

- **Today:** `AI_PROVIDER=local` (implicit) — deterministic, offline, no keys, no
  server. Fully playable. **This is the shipped reality.**
- **V2 plan:** an optional server gateway that keeps keys server-side, calls
  providers only on events, validates every response against the existing
  contracts, and always falls back to local — so turning AI "up" never
  compromises safety, offline play, or determinism.
