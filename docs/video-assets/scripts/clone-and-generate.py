"""End-to-end: rotate Tor circuit until ElevenLabs reachable, clone voice, generate 8 MP3s.

All requests go through SOCKS5 127.0.0.1:9050 with rotating circuit identity (SOCKS auth).
"""
import sys, time
from pathlib import Path
import requests

API_KEY = "sk_bd28f19067ee75e70a14e62295b161a79db47854a6502816"
SAMPLE = Path("C:/Users/PC/petai/docs/video-assets/audio/voice-sample-real.mp3")
OUT_DIR = Path("C:/Users/PC/petai/docs/video-assets/audio")

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

VOICE_SETTINGS = {
    "stability": 0.65,
    "similarity_boost": 0.90,
    "style": 0.20,
    "use_speaker_boost": True,
    "speed": 0.90,
}

def make_proxies(circuit_id):
    """Each unique user:pass = new Tor circuit (IsolateSOCKSAuth default in expert bundle)."""
    return {
        "http":  f"socks5h://c{circuit_id}:x{circuit_id}@127.0.0.1:9050",
        "https": f"socks5h://c{circuit_id}:x{circuit_id}@127.0.0.1:9050",
    }

def find_working_circuit(max_tries=40):
    """Rotate Tor circuit until ElevenLabs API responds 200."""
    headers = {"xi-api-key": API_KEY, "Accept": "application/json"}
    for i in range(max_tries):
        cid = int(time.time() * 1000) + i
        prx = make_proxies(cid)
        try:
            r = requests.get("https://api.elevenlabs.io/v1/user", headers=headers, proxies=prx, timeout=20, allow_redirects=False)
            try:
                ip = requests.get("https://api.ipify.org", proxies=prx, timeout=10).text.strip()
            except Exception:
                ip = "?"
            print(f"  [{i:02d}] cid={cid} ip={ip} code={r.status_code}", flush=True)
            if r.status_code == 200:
                return cid
        except Exception as e:
            print(f"  [{i:02d}] cid={cid} ERR: {type(e).__name__}", flush=True)
    return None

def clone_voice(cid):
    """Upload sample, return new voice_id."""
    headers = {"xi-api-key": API_KEY}
    files = {"files": (SAMPLE.name, open(SAMPLE, "rb"), "audio/mpeg")}
    data = {
        "name": "PetAI Dima v2",
        "description": "Founder voice — recorded English narration of PetAI script",
        "labels": '{"language":"en","accent":"slavic","gender":"male","age":"young","use_case":"narrative"}',
    }
    prx = make_proxies(cid)
    print(f"Cloning voice via circuit {cid}...", flush=True)
    r = requests.post("https://api.elevenlabs.io/v1/voices/add", headers=headers, data=data, files=files, proxies=prx, timeout=300)
    print(f"  HTTP {r.status_code}: {r.text[:300]}", flush=True)
    r.raise_for_status()
    return r.json()["voice_id"]

def generate_one(voice_id, key, text, cid):
    headers = {"xi-api-key": API_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg"}
    body = {"text": text, "model_id": "eleven_multilingual_v2", "voice_settings": VOICE_SETTINGS}
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    out = OUT_DIR / f"scene-{key}.mp3"
    last_err = None
    for attempt in range(5):
        try_cid = cid + attempt * 1000
        prx = make_proxies(try_cid)
        try:
            r = requests.post(url, headers=headers, json=body, proxies=prx, timeout=180, stream=True)
            if r.status_code == 200:
                with open(out, "wb") as f:
                    for chunk in r.iter_content(8192):
                        f.write(chunk)
                return out
            last_err = f"HTTP {r.status_code}: {r.text[:200]}"
        except Exception as e:
            last_err = f"{type(e).__name__}: {e}"
        print(f"  retry {attempt}: {last_err}", flush=True)
        time.sleep(2)
    raise RuntimeError(f"scene-{key} failed: {last_err}")

def main():
    print("Step 1: find working Tor circuit...")
    cid = find_working_circuit()
    if cid is None:
        sys.exit("No working circuit found")
    print(f"Found cid={cid}\n")
    print("Step 2: clone voice...")
    voice_id = clone_voice(cid)
    print(f"voice_id = {voice_id}\n")
    print("Step 3: generate 8 scenes...")
    for key, text in SCENES.items():
        print(f"-> scene-{key} ({len(text)} chars)...", flush=True)
        out = generate_one(voice_id, key, text, cid)
        size_kb = out.stat().st_size / 1024
        print(f"   OK ({size_kb:.0f} KB)", flush=True)
        time.sleep(0.5)
    print("\nALL DONE")
    print(f"voice_id = {voice_id}")

if __name__ == "__main__":
    main()
