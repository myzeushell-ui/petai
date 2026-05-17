"""Generate 8 scene voice-overs using Microsoft Edge TTS (free neural voices).

This is a placeholder that produces high-quality narration. Once user provides
ElevenLabs API key + voice sample, swap to ElevenLabs by running
generate-voiceover.sh. The audio file structure stays the same.
"""
import asyncio
from pathlib import Path

import edge_tts

OUT = Path(__file__).resolve().parent.parent / "audio"
OUT.mkdir(exist_ok=True)

# en-US-AndrewNeural: warm conversational male, mid-20s, perfect for personal story
VOICE = "en-US-AndrewNeural"
RATE = "-25%"  # slower, more measured pace
PITCH = "+0Hz"

SCENES = {
    "01": 'I wanted a dog. But which one? There are hundreds of breeds. Which one fits my apartment, my schedule, my family?',
    "02": 'I downloaded PetAI. Took a quiz. The app picked the right breed for my lifestyle. Found a verified breeder right in the marketplace. Got my puppy.',
    "03": 'Right away — a health card. Vaccines, blood tests, weight — all in one place. AI built a balanced diet plan — for the breed, age, weight and activity. What to feed, how much, when.',
    "04": 'My dog had a behavior problem. I found a dog trainer in the app. Booked a session. Paid. Got a training plan. All inside PetAI.',
    "05": 'Time passed. I decided to breed. Heat cycle tracker. Mating match by pedigree. Inbreeding calculator. Breeding contract — generated automatically.',
    "06": 'Puppies were born. I listed them on PetAI marketplace. Pedigree, documents, photos. Buyers find them, message me, buy — all in one app.',
    "07": 'And then — the smart collar. Temperature, movement, heart rate. And a microphone that listens to barks and understands how your dog feels — stress, joy, pain, anxiety. You know before you even notice.',
    "08": 'One app. From "which dog should I get" — to breeding and selling puppies. PetAI.',
}


async def generate(key: str, text: str) -> None:
    out_path = OUT / f"scene-{key}.mp3"
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
    await communicate.save(str(out_path))
    size_kb = out_path.stat().st_size / 1024
    print(f"  ✓ scene-{key}.mp3 ({size_kb:.0f} KB)")


async def main() -> None:
    print(f"→ Voice: {VOICE}")
    print(f"→ Output: {OUT}\n")
    for key, text in SCENES.items():
        print(f"  generating scene-{key}...")
        await generate(key, text)
    print(f"\nAll 8 MP3s saved.")


if __name__ == "__main__":
    asyncio.run(main())
