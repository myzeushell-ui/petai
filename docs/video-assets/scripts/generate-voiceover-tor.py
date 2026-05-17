"""Generate 8 scene MP3s via ElevenLabs API through Tor SOCKS proxy.

User's voice cloned from live footage:
  voice_id = eF4qeXdOkcLFs58ZNlVd  (PetAI Dima)
"""
import sys, time
from pathlib import Path
import requests

API_KEY = "sk_bd28f19067ee75e70a14e62295b161a79db47854a6502816"
VOICE_ID = "eF4qeXdOkcLFs58ZNlVd"
PROXIES = {"http": "socks5h://u0:p0@127.0.0.1:9050", "https": "socks5h://u0:p0@127.0.0.1:9050"}
HEADERS = {"xi-api-key": API_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg"}

OUT = Path("C:/Users/PC/petai/docs/video-assets/audio")
OUT.mkdir(exist_ok=True)

# Same scene texts. For calmer/slower pacing, we rely on ElevenLabs voice_settings
# (high stability) plus added punctuation pauses ("...") between thought groups.
SCENES = {
    "01": "I wanted a dog... but which one? There are hundreds of breeds. Which one fits my apartment, my schedule, my family?",
    "02": "I downloaded PetAI. Took a quiz. The app picked the right breed for my lifestyle. Found a verified breeder right in the marketplace. Got my puppy.",
    "03": "Right away — a health card. Vaccines, blood tests, weight — all in one place. AI built a balanced diet plan — for the breed, age, weight and activity. What to feed, how much, when.",
    "04": "My dog had a behavior problem. I found a dog trainer in the app. Booked a session. Paid. Got a training plan. All inside PetAI.",
    "05": "Time passed. I decided to breed. Heat cycle tracker. Mating match by pedigree. Inbreeding calculator. Breeding contract — generated automatically.",
    "06": "Puppies were born. I listed them on PetAI marketplace. Pedigree, documents, photos. Buyers find them, message me, buy — all in one app.",
    "07": "And then — the smart collar. Temperature, movement, heart rate. And a microphone that listens to barks and understands how your dog feels — stress, joy, pain, anxiety. You know before you even notice.",
    "08": 'One app. From "which dog should I get" — to breeding and selling puppies. PetAI.',
}

URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

VOICE_SETTINGS = {
    "stability": 0.60,         # higher = more measured / calm
    "similarity_boost": 0.85,  # keep voice character
    "style": 0.25,             # subtle expressive
    "use_speaker_boost": True,
    "speed": 0.85,             # 15% slower (ElevenLabs param exists in newer models)
}

for key, text in SCENES.items():
    out_path = OUT / f"scene-{key}.mp3"
    print(f"-> scene-{key}: generating ({len(text)} chars)...", flush=True)
    body = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": VOICE_SETTINGS,
    }
    r = requests.post(URL, headers=HEADERS, json=body, proxies=PROXIES, timeout=120, stream=True)
    if r.status_code != 200:
        print(f"   FAIL {r.status_code}: {r.text[:200]}")
        sys.exit(1)
    with open(out_path, "wb") as f:
        for chunk in r.iter_content(chunk_size=8192):
            f.write(chunk)
    size_kb = out_path.stat().st_size / 1024
    print(f"   OK {out_path.name} ({size_kb:.0f} KB)")
    time.sleep(0.4)

print("\nAll 8 MP3s saved.")
