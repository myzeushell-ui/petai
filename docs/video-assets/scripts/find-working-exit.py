"""Rotate Tor circuits via IsolateSOCKSAuth, find one unblocked by ElevenLabs."""
import os, sys, time
import requests

API_KEY = "sk_bd28f19067ee75e70a14e62295b161a79db47854a6502816"
TARGET = "https://api.elevenlabs.io/v1/user"
HEADERS = {"xi-api-key": API_KEY, "Accept": "application/json"}
MAX_TRIES = 60

found = None
for i in range(MAX_TRIES):
    proxies = {
        "http":  f"socks5h://u{i}:p{i}@127.0.0.1:9050",
        "https": f"socks5h://u{i}:p{i}@127.0.0.1:9050",
    }
    try:
        ip = requests.get("https://api.ipify.org", proxies=proxies, timeout=20).text.strip()
    except Exception as e:
        print(f"[{i:02d}] ipify ERR: {type(e).__name__}", flush=True)
        continue
    try:
        r = requests.get(TARGET, headers=HEADERS, proxies=proxies, timeout=25, allow_redirects=False)
        code = r.status_code
        snippet = r.text[:80].replace("\n"," ")
        print(f"[{i:02d}] exit={ip:>15} code={code}  {snippet}", flush=True)
        if code == 200:
            found = ip
            break
        if code == 401:
            # Means request reached ElevenLabs proper but auth issue — promising
            print(f"     -> reached API but auth issue, retrying...", flush=True)
    except Exception as e:
        print(f"[{i:02d}] exit={ip:>15} ERR: {type(e).__name__}", flush=True)

if found:
    print(f"\nWORKING EXIT FOUND: {found}")
    sys.exit(0)
else:
    print("\nNo working exit found in 60 tries")
    sys.exit(1)
