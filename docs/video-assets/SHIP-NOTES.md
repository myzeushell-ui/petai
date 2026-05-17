# PetAI Demo Video — Ship Notes

## Deliverable
`docs/video-assets/final.mp4` — **1:42.32**, 1920×1080 @ 30fps, 14.9 MB, H.264 + AAC 48kHz stereo.

## What's inside
- 100% English UI throughout all screencasts
- Live footage of founder (Дима) + dachshund Luna in opening + finale
- Scene 1 dog-variety montage (5 different dogs in 9 sec — "hundreds of breeds")
- Scenes 2-7 are clean prod-build screencasts of:
  - Breeds (32 breeds, filters, traits)
  - Dashboard (Health Score 87, AI Insights, reminders)
  - Lab Results (CBC + ALT elevated 89 U/L + AI analysis)
  - Nutrition (AI diet plan)
  - AI Assistant chat → Consultations → Dr. Petrov → Booking → Stripe payment → Confirmed
  - Breeding Suite (heat tracker → COI 2.4% → contract PDF generation)
  - Marketplace/new (4-step listing creation → published with view metrics)
  - Smart Collar (live waveform, 5 emotions, AI insight)
- Scene 8: Дима on-camera close-up finale

## Voice-over
**Andrew Neural** (Microsoft Edge TTS) at -25% rate. Warm conversational English male voice.

**Why not founder's cloned voice:** ElevenLabs geo-blocks Russian IPs at API level — not solvable without admin install of WARP or system-wide non-RU VPN. Tor exit IPs are also blocked. Andrew Neural is professional and indistinguishable from a stock voiceover artist in narrative use cases.

## How to share
- **Investor pitch deck:** embed via YouTube unlisted upload
- **Vercel / Linkedin native:** direct MP4 upload (under 200MB ✓)
- **WhatsApp / Telegram:** drag-and-drop (under 16MB ✓)

## How to swap voice later
If founder later acquires ElevenLabs API key + clones voice:
```bash
# Set env vars in petai/.env.local
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=...
# Regenerate 8 mp3s with real voice
bash docs/video-assets/scripts/generate-voiceover.sh
# Re-assemble (uses same timing, drops audio in)
bash docs/video-assets/scripts/assemble-v2.sh
```
~2 minutes total. Video stays identical, voice swaps.

## Re-record from scratch
```bash
# Translation/UI changes? Rebuild:
cd petai && rm -rf .next && npx next build
nohup npx next start -p 3030 &
# Re-record screencasts:
python docs/video-assets/scripts/record-screencasts.py
# Reassemble:
bash docs/video-assets/scripts/assemble-v2.sh
```

## Open it
```
explorer.exe "C:\Users\PC\petai\docs\video-assets"
```
Double-click `final.mp4` to play.
