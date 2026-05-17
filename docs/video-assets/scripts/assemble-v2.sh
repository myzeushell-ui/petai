#!/usr/bin/env bash
# v2: Assemble final.mp4 with English UI + -25% slower VO + dog-variety Scene 1.
set -euo pipefail

FFMPEG="/c/Users/PC/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe"
ROOT="/c/Users/PC/petai/docs/video-assets"
LF="$ROOT/live-footage"
SC="$ROOT/screencasts"
AU="$ROOT/audio"
TMP="$ROOT/_tmp"
OUT="$ROOT/final.mp4"
mkdir -p "$TMP"
rm -f "$TMP"/scene-*.mp4 "$TMP"/concat.txt

# Helper for one scene clip with VO. args: idx, video_in, vstart, audio_in, dur(sec)
build_simple () {
  local IDX="$1" VIN="$2" VSTART="$3" AIN="$4" DUR="$5"
  echo "[scene $IDX] ${DUR}s"
  "$FFMPEG" -hide_banner -loglevel error -y \
    -ss "$VSTART" -i "$VIN" \
    -i "$AIN" \
    -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,setsar=1,fps=30,setpts=PTS-STARTPTS[v0];[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=20:5,setsar=1,fps=30[bg];[bg][v0]overlay=(W-w)/2:(H-h)/2,trim=duration=${DUR},setpts=PTS-STARTPTS[vout]" \
    -map "[vout]" -map "1:a" \
    -c:v libx264 -preset veryfast -crf 22 -pix_fmt yuv420p \
    -c:a aac -b:a 192k -ar 48000 -ac 2 -shortest \
    "$TMP/scene-$IDX.mp4" 2>&1 | tail -1
}

# Scene 1 (9.17s VO) — DOG VARIETY MONTAGE
# Layout: 5 clips cut to length, blurred-background full-frame each, then concat with audio overlay
echo "[scene 01] dog-variety montage..."

# Prepare 5 cuts (silent, normalized 1920x1080)
make_clip () {
  local OUT_NAME="$1" VIN="$2" VSTART="$3" DUR="$4"
  "$FFMPEG" -hide_banner -loglevel error -y \
    -ss "$VSTART" -i "$VIN" -t "$DUR" \
    -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,setsar=1,fps=30,setpts=PTS-STARTPTS[v0];[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=20:5,setsar=1,fps=30[bg];[bg][v0]overlay=(W-w)/2:(H-h)/2[vout]" \
    -map "[vout]" -an \
    -c:v libx264 -preset veryfast -crf 22 -pix_fmt yuv420p \
    "$TMP/${OUT_NAME}.mp4" 2>&1 | tail -1
}

# Cut beats: total 9.20s (matches v6 scene-01 duration)
make_clip s01_a "$LF/01-walk-park-leash.mp4" 0    2.6   # wide est. shot — rusty dachshund + Дима
make_clip s01_b "$LF/dual2-action.mp4"        1    1.5   # rough collie + pomeranian playing
make_clip s01_c "$LF/dual4-action.mp4"        2    1.5   # white pomeranian on green leash
make_clip s01_d "$LF/dual7-action.mp4"        1    1.5   # two dogs playing on path
make_clip s01_e "$LF/dual6-action.mp4"        3    2.1   # dachshund running on pink track

# Concat silent video parts
cd "$TMP"
{
  for n in s01_a s01_b s01_c s01_d s01_e; do echo "file '$n.mp4'"; done
} > scene01-concat.txt
"$FFMPEG" -hide_banner -loglevel error -y -f concat -safe 0 -i scene01-concat.txt -c copy scene01-video.mp4 2>&1 | tail -1

# Mux with VO
"$FFMPEG" -hide_banner -loglevel error -y -i scene01-video.mp4 -i "$AU/scene-01.mp3" \
  -c:v copy -c:a aac -b:a 192k -ar 48000 -ac 2 -shortest "$TMP/scene-01.mp4" 2>&1 | tail -1
echo "  -> $(stat -c %s scene-01.mp4) bytes"

# Scenes 2-7 — screencasts (durations match v4 cloned-voice VO)
build_simple 02 "$SC/scene-02.webm" 2 "$AU/scene-02.mp3" 12.43
build_simple 03 "$SC/scene-03.webm" 0 "$AU/scene-03.mp3" 18.57
build_simple 04 "$SC/scene-04.webm" 4 "$AU/scene-04.mp3" 11.28
build_simple 05 "$SC/scene-05.webm" 3 "$AU/scene-05.mp3" 13.40
build_simple 06 "$SC/scene-06.webm" 3 "$AU/scene-06.mp3" 13.14
build_simple 07 "$SC/scene-07.webm" 2 "$AU/scene-07.mp3" 18.65

# Scene 8 — selfie finale
build_simple 08 "$LF/02-selfie-finale-face.mp4" 0 "$AU/scene-08.mp3" 7.42

# Concat all
cd "$TMP"
{
  for i in 01 02 03 04 05 06 07 08; do echo "file 'scene-$i.mp4'"; done
} > concat.txt

"$FFMPEG" -hide_banner -loglevel error -y -f concat -safe 0 -i concat.txt -c copy "$OUT" 2>&1 | tail -1

DUR=$("$FFMPEG" -hide_banner -i "$OUT" 2>&1 | grep Duration | awk '{print $2}' | tr -d ',')
SIZE=$(du -h "$OUT" | cut -f1)
echo ""
echo "==> $OUT"
echo "    Duration: $DUR · Size: $SIZE"
