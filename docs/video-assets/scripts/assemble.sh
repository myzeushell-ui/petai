#!/usr/bin/env bash
# Assemble final MP4: 8 scenes, 1920x1080 30fps, with VO + simple bg duck.
set -euo pipefail

FFMPEG="/c/Users/PC/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe"
ROOT="/c/Users/PC/petai/docs/video-assets"
LF="$ROOT/live-footage"
SC="$ROOT/screencasts"
AU="$ROOT/audio"
TMP="$ROOT/_tmp"
OUT="$ROOT/final.mp4"
mkdir -p "$TMP"

# Helper: encode one scene clip with VO audio, 1920x1080 30fps.
# args: idx, video_input, video_start_offset, audio_input
build_scene () {
  local IDX="$1" VIN="$2" VSTART="$3" AIN="$4"
  local DUR
  DUR=$("$FFMPEG" -hide_banner -i "$AIN" 2>&1 | grep Duration | awk '{print $2}' | tr -d ',')
  # +0.3s tail pad
  echo "→ scene $IDX: $DUR + pad"
  "$FFMPEG" -hide_banner -y \
    -ss "$VSTART" -i "$VIN" \
    -i "$AIN" \
    -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,setsar=1,fps=30,setpts=PTS-STARTPTS[v0]; \
[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=20:5,setsar=1,fps=30[bg]; \
[bg][v0]overlay=(W-w)/2:(H-h)/2,trim=duration=$DUR,setpts=PTS-STARTPTS[vout]" \
    -map "[vout]" -map "1:a" \
    -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p \
    -c:a aac -b:a 192k -ar 48000 -ac 2 \
    -shortest \
    "$TMP/scene-$IDX.mp4" 2>&1 | tail -2
}

# SCENE 1 — live walk wide shot (0-7s of 32s clip)
build_scene 01 "$LF/01-walk-park-leash.mp4" 0     "$AU/scene-01.mp3"

# SCENE 2-7 — screencasts (start a bit in to skip warmup)
build_scene 02 "$SC/scene-02.webm"        2     "$AU/scene-02.mp3"
build_scene 03 "$SC/scene-03.webm"        2     "$AU/scene-03.mp3"
build_scene 04 "$SC/scene-04.webm"        4     "$AU/scene-04.mp3"
build_scene 05 "$SC/scene-05.webm"        3     "$AU/scene-05.mp3"
build_scene 06 "$SC/scene-06.webm"        3     "$AU/scene-06.mp3"
build_scene 07 "$SC/scene-07.webm"        2     "$AU/scene-07.mp3"

# SCENE 8 — selfie finale (0-6s of 27s clip)
build_scene 08 "$LF/02-selfie-finale-face.mp4" 0 "$AU/scene-08.mp3"

# Concat
cd "$TMP"
{
  for i in 01 02 03 04 05 06 07 08; do
    echo "file 'scene-$i.mp4'"
  done
} > concat.txt

"$FFMPEG" -hide_banner -y -f concat -safe 0 -i concat.txt -c copy "$OUT" 2>&1 | tail -2

DUR=$("$FFMPEG" -hide_banner -i "$OUT" 2>&1 | grep Duration | awk '{print $2}' | tr -d ',')
SIZE=$(du -h "$OUT" | cut -f1)
echo ""
echo "✓ Final: $OUT"
echo "  Duration: $DUR"
echo "  Size: $SIZE"
