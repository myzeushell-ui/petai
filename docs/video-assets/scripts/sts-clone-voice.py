"""Speech-to-Speech: convert Andrew Neural audio → user's cloned voice.

Result: user's voice with Andrew's clean enunciation, no breaths/pauses.
"""
import sys, time
from pathlib import Path
import requests

API_KEY = "sk_bd28f19067ee75e70a14e62295b161a79db47854a6502816"
VOICE_ID = "ufz2uXToGwTvsotholZL"  # PetAI Dima v2

SRC = Path("C:/Users/PC/petai/docs/video-assets/audio/_andrew_src")
OUT = Path("C:/Users/PC/petai/docs/video-assets/audio")

VOICE_SETTINGS = '{"stability":0.5,"similarity_boost":0.9,"style":0.0,"use_speaker_boost":true}'

def make_proxies(cid):
    return {
        "http":  f"socks5h://s{cid}:p{cid}@127.0.0.1:9050",
        "https": f"socks5h://s{cid}:p{cid}@127.0.0.1:9050",
    }

def find_circuit():
    """Find a working Tor exit (not blocked by ElevenLabs)."""
    h = {"xi-api-key": API_KEY}
    for i in range(40):
        cid = int(time.time() * 1000) + i
        try:
            r = requests.get("https://api.elevenlabs.io/v1/user", headers=h, proxies=make_proxies(cid), timeout=18, allow_redirects=False)
            if r.status_code == 200:
                print(f"  circuit {cid}: OK", flush=True)
                return cid
            print(f"  [{i:02d}] code={r.status_code}", flush=True)
        except Exception as e:
            print(f"  [{i:02d}] {type(e).__name__}", flush=True)
    return None

def sts_one(key, cid, retry=4):
    src_file = SRC / f"scene-{key}.mp3"
    out_file = OUT / f"scene-{key}.mp3"
    url = f"https://api.elevenlabs.io/v1/speech-to-speech/{VOICE_ID}/stream"
    headers = {"xi-api-key": API_KEY, "Accept": "audio/mpeg"}
    data = {
        "model_id": "eleven_multilingual_sts_v2",
        "voice_settings": VOICE_SETTINGS,
        "remove_background_noise": "true",
    }
    last_err = None
    for attempt in range(retry):
        try_cid = cid + attempt * 1000
        prx = make_proxies(try_cid)
        try:
            with open(src_file, "rb") as f:
                files = {"audio": (src_file.name, f, "audio/mpeg")}
                r = requests.post(url, headers=headers, data=data, files=files, proxies=prx, timeout=240, stream=True)
            if r.status_code == 200:
                with open(out_file, "wb") as out:
                    for chunk in r.iter_content(8192):
                        out.write(chunk)
                return out_file
            last_err = f"HTTP {r.status_code}: {r.text[:200]}"
        except Exception as e:
            last_err = f"{type(e).__name__}: {e}"
        print(f"  retry {attempt}: {last_err}", flush=True)
        time.sleep(2)
    raise RuntimeError(f"scene-{key}: {last_err}")

def main():
    print("Find Tor exit...")
    cid = find_circuit()
    if cid is None:
        sys.exit("No working exit")
    print(f"Using circuit {cid}\n")
    print("STS converting Andrew → user's clone (8 scenes)...")
    for key in "01 02 03 04 05 06 07 08".split():
        print(f"-> scene-{key}", flush=True)
        out = sts_one(key, cid)
        size_kb = out.stat().st_size / 1024
        print(f"   OK ({size_kb:.0f} KB)", flush=True)
        time.sleep(0.5)
    print("\nDONE")

if __name__ == "__main__":
    main()
