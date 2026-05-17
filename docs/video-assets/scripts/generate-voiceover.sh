#!/usr/bin/env bash
# Generate 8 scene voice-overs via ElevenLabs API.
# Run from petai root: bash docs/video-assets/scripts/generate-voiceover.sh

set -euo pipefail

# Load env
if [ -f .env.local ]; then
  set -a; . ./.env.local; set +a
elif [ -f docs/video-assets/.env ]; then
  set -a; . ./docs/video-assets/.env; set +a
fi

: "${ELEVENLABS_API_KEY:?Set ELEVENLABS_API_KEY in .env.local}"
: "${ELEVENLABS_VOICE_ID:?Set ELEVENLABS_VOICE_ID in .env.local}"

OUT_DIR="docs/video-assets/audio"
mkdir -p "$OUT_DIR"

# Scene texts (English) — keep in sync with voice-over.md
declare -A SCENES=(
  [01]='I wanted a dog. But which one? There are hundreds of breeds. Which one fits my apartment, my schedule, my family?'
  [02]='I downloaded PetAI. Took a quiz. The app picked the right breed for my lifestyle. Found a verified breeder right in the marketplace. Got my puppy.'
  [03]='Right away — a health card. Vaccines, blood tests, weight — all in one place. AI built a balanced diet plan — for the breed, age, weight and activity. What to feed, how much, when.'
  [04]='My dog had a behavior problem. I found a dog trainer in the app. Booked a session. Paid. Got a training plan. All inside PetAI.'
  [05]='Time passed. I decided to breed. Heat cycle tracker. Mating match by pedigree. Inbreeding calculator. Breeding contract — generated automatically.'
  [06]='Puppies were born. I listed them on PetAI marketplace. Pedigree, documents, photos. Buyers find them, message me, buy — all in one app.'
  [07]='And then — the smart collar. Temperature, movement, heart rate. And a microphone that listens to barks and understands how your dog feels — stress, joy, pain, anxiety. You know before you even notice.'
  [08]='One app. From "which dog should I get" — to breeding and selling puppies. PetAI.'
)

for KEY in 01 02 03 04 05 06 07 08; do
  TEXT="${SCENES[$KEY]}"
  OUT="$OUT_DIR/scene-${KEY}.mp3"
  echo "→ Generating scene-${KEY}.mp3 ..."

  # Build JSON body via jq for safe escaping
  BODY=$(jq -n \
    --arg text "$TEXT" \
    '{
      text: $text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.85,
        style: 0.30,
        use_speaker_boost: true
      }
    }')

  curl -fsS -X POST \
    -H "xi-api-key: $ELEVENLABS_API_KEY" \
    -H "Content-Type: application/json" \
    -H "Accept: audio/mpeg" \
    -d "$BODY" \
    "https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}" \
    -o "$OUT"

  echo "  ✓ $OUT ($(du -h "$OUT" | cut -f1))"
  sleep 0.5
done

echo ""
echo "All 8 scene MP3s saved to $OUT_DIR/"
echo "Total size: $(du -sh "$OUT_DIR" | cut -f1)"
