import { useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "../state/GameContext";
import { getAsset, getImage, preloadAssets, type GameAsset } from "../assets/registry";
import { LOCATION_TYPE_LABELS, UNIT_LABELS } from "../game/constants";
import { getScenario } from "../game/scenario";
import type { GameState, Location, UnitGroup, UnitType } from "../game/types";

/* World view is expressed in the same 0..100 percent space the scenario uses
 * for location coordinates, with margin so large landmarks stay on-screen. */
const VIEW_W = 116;
const VIEW_H = 84;
const CAM_X0 = 53;
const CAM_Y0 = 51;
/** World units per unit of manifest recommendedScale (tuned by screenshot). */
const ART_K = 78;

const LOC_ASSET: Record<string, string> = {
  castle: "castle_dawns_edge",
  bridge: "stone_bridge_river",
  forest: "forest_cluster_dense",
  hills: "rocky_hill_east",
  village: "village_cottage_blue",
  enemy_camp: "enemy_camp_morvein",
};

const PLAYER_UNIT: Record<UnitType, string> = {
  spearmen: "valedorn_spearmen_squad",
  archers: "valedorn_archers_squad",
  cavalry: "valedorn_cavalry_squad",
};
const ENEMY_UNIT: Record<UnitType, string> = {
  spearmen: "morvein_heavy_infantry_squad",
  archers: "morvein_archers_squad",
  cavalry: "morvein_cavalry_squad",
};

function unitAssetId(u: UnitGroup): string {
  return (u.side === "player" ? PLAYER_UNIT : ENEMY_UNIT)[u.type];
}

const PHASE_LABELS: Record<string, string> = {
  war_council: "Военный совет",
  preparation: "Подготовка",
  enemy_probe: "Разведка боем",
  main_assault: "Штурм",
  crisis: "Кризис!",
  aftermath: "После битвы",
};

interface Cam {
  x: number;
  y: number;
  zoom: number;
}

export default function LivingMap() {
  const g = useGame();
  const s = g.state!;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<GameState>(s);
  stateRef.current = s;

  const camRef = useRef<Cam>({ x: CAM_X0, y: CAM_Y0, zoom: 1 });
  const sizeRef = useRef({ w: 800, h: 600 });
  const [, force] = useState(0);
  const [hover, setHover] = useState<{ id: string; sx: number; sy: number } | null>(null);
  const [ready, setReady] = useState(false);

  const locById = useMemo(() => new Map(s.locations.map((l) => [l.id, l])), [s.locations]);
  const durationMinutes = getScenario(s.scenarioId).durationMinutes;

  // Preload the art once.
  useEffect(() => {
    let live = true;
    preloadAssets().then(() => live && setReady(true));
    return () => {
      live = false;
    };
  }, []);

  // Resize handling.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      const r = wrap.getBoundingClientRect();
      sizeRef.current = { w: Math.max(320, r.width), h: Math.max(240, r.height) };
    });
    ro.observe(wrap);
    const r = wrap.getBoundingClientRect();
    sizeRef.current = { w: Math.max(320, r.width), h: Math.max(240, r.height) };
    return () => ro.disconnect();
  }, []);

  // Render loop.
  useEffect(() => {
    let raf = 0;
    let t0 = 0;
    const draw = (ts: number) => {
      if (!t0) t0 = ts;
      const time = (ts - t0) / 1000;
      render(canvasRef.current, sizeRef.current, camRef.current, stateRef.current, locById, durationMinutes, time, hoverRef.current);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [locById, durationMinutes]);

  // keep a ref for hover so the loop reads it without restarting
  const hoverRef = useRef(hover);
  hoverRef.current = hover;

  /* ---- interaction ---- */
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  function ppu() {
    const { w, h } = sizeRef.current;
    return Math.min(w / VIEW_W, h / VIEW_H) * camRef.current.zoom;
  }
  function worldToScreen(wx: number, wy: number) {
    const { w, h } = sizeRef.current;
    const p = ppu();
    return { sx: w / 2 + (wx - camRef.current.x) * p, sy: h / 2 + (wy - camRef.current.y) * p };
  }
  function pick(cssX: number, cssY: number): string | null {
    let best: string | null = null;
    let bestD = 46 * 46;
    for (const l of stateRef.current.locations) {
      const { sx, sy } = worldToScreen(l.x, l.y);
      const d = (sx - cssX) ** 2 + (sy - cssY) ** 2;
      if (d < bestD) {
        bestD = d;
        best = l.id;
      }
    }
    return best;
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
  }
  function onPointerMove(e: React.PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    if (drag.current) {
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.current.moved = true;
      const p = ppu();
      camRef.current.x -= dx / p;
      camRef.current.y -= dy / p;
      clampCam();
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
      return;
    }
    const id = pick(cx, cy);
    if (id) {
      const l = locById.get(id)!;
      const { sx, sy } = worldToScreen(l.x, l.y);
      setHover({ id, sx, sy });
    } else if (hover) setHover(null);
  }
  function onPointerUp(e: React.PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const wasDrag = drag.current?.moved;
    drag.current = null;
    if (!wasDrag) {
      const id = pick(cx, cy);
      g.selectLocation(s.selectedLocationId === id ? null : id);
    }
  }
  function onWheel(e: React.WheelEvent) {
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    zoomAt(e.clientX, e.clientY, factor);
  }
  function zoomAt(clientX: number, clientY: number, factor: number) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;
    const before = screenToWorld(cx, cy);
    camRef.current.zoom = Math.min(2.6, Math.max(0.62, camRef.current.zoom * factor));
    const after = screenToWorld(cx, cy);
    camRef.current.x += before.wx - after.wx;
    camRef.current.y += before.wy - after.wy;
    clampCam();
    force((n) => n + 1);
  }
  function screenToWorld(cssX: number, cssY: number) {
    const { w, h } = sizeRef.current;
    const p = ppu();
    return { wx: camRef.current.x + (cssX - w / 2) / p, wy: camRef.current.y + (cssY - h / 2) / p };
  }
  function clampCam() {
    camRef.current.x = Math.min(96, Math.max(8, camRef.current.x));
    camRef.current.y = Math.min(94, Math.max(6, camRef.current.y));
  }
  function resetView() {
    camRef.current = { x: CAM_X0, y: CAM_Y0, zoom: 1 };
    force((n) => n + 1);
  }

  const firstBattle = s.battles.find((b) => b.status === "active");
  const hoverLoc = hover ? locById.get(hover.id) : null;
  const movingUnits = s.units.some((u) => u.side === "player" && u.state === "moving");

  return (
    <div className="livingmap-wrap" ref={wrapRef}>
      <div className={`lm-phase phase-${s.scenarioPhase}`}>{PHASE_LABELS[s.scenarioPhase]}</div>
      <canvas
        ref={canvasRef}
        className="livingmap-canvas"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
      />

      {!ready && <div className="lm-loading">Загрузка королевства…</div>}

      {firstBattle && !s.viewBattleId && (
        <div className="watch-battle">
          <button className="btn btn-sm" onClick={() => g.viewBattle(firstBattle.id)}>
            ⚔ Смотреть бой у {locById.get(firstBattle.locationId)?.name}
          </button>
        </div>
      )}

      {s.phase === "playing" && s.speed === 0 && !firstBattle && movingUnits && (
        <button className="paused-hint" onClick={() => g.setSpeed(1)}>
          ⏸ Пауза — войска ждут. Нажмите, чтобы пустить время ▶
        </button>
      )}

      <div className="lm-controls">
        <button onClick={() => zoomAtCenter(1.16)} title="Приблизить">＋</button>
        <button onClick={() => zoomAtCenter(1 / 1.16)} title="Отдалить">－</button>
        <button onClick={resetView} title="Показать всё">⊡</button>
      </div>

      {hoverLoc && (
        <MapTip loc={hoverLoc} units={s.units} x={hover!.sx} y={hover!.sy} />
      )}

      <div className="map-legend lm-legend">
        <span className="lg"><span className="sw" style={{ background: "#6fb0ff" }} />Валедорн</span>
        <span className="lg"><span className="sw" style={{ background: "#d65c46" }} />Морвейн</span>
        <span className="lg"><span className="sw" style={{ background: "var(--gold)" }} />цель</span>
        {s.selectedLocationId && (
          <span className="lg" style={{ color: "var(--gold-bright)" }}>
            выбрано: {locById.get(s.selectedLocationId)?.name} (скажите «сюда»)
          </span>
        )}
      </div>
    </div>
  );

  function zoomAtCenter(factor: number) {
    const { w, h } = sizeRef.current;
    const rect = canvasRef.current?.getBoundingClientRect();
    zoomAt((rect?.left ?? 0) + w / 2, (rect?.top ?? 0) + h / 2, factor);
  }
}

/* ================================================================== */
/* Rendering (pure of React)                                          */
/* ================================================================== */

function render(
  canvas: HTMLCanvasElement | null,
  size: { w: number; h: number },
  cam: Cam,
  s: GameState,
  locById: Map<string, Location>,
  durationMinutes: number,
  time: number,
  hover: { id: string } | null,
) {
  if (!canvas) return;
  const dprv = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  const { w, h } = size;
  if (canvas.width !== Math.round(w * dprv) || canvas.height !== Math.round(h * dprv)) {
    canvas.width = Math.round(w * dprv);
    canvas.height = Math.round(h * dprv);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
  }
  const ctx = canvas.getContext("2d")!;
  ctx.save();
  ctx.scale(dprv, dprv);
  ctx.clearRect(0, 0, w, h);

  const p = Math.min(w / VIEW_W, h / VIEW_H) * cam.zoom;
  const W2S = (wx: number, wy: number) => ({ sx: w / 2 + (wx - cam.x) * p, sy: h / 2 + (wy - cam.y) * p });

  // dawn progress: 0 = deep night, 1 = sunrise
  const dawn = clamp01(1 - s.timeUntilDawn / durationMinutes);

  drawGround(ctx, w, h, W2S, p, time, dawn);
  drawRiver(ctx, W2S, p, time, dawn);
  drawRoads(ctx, s, W2S);

  // Depth-sorted scene: landmarks + props + unit tokens (by ground-contact y).
  type Item = { y: number; z: number; render: () => void };
  const items: Item[] = [];

  for (const l of s.locations) {
    const assetId = LOC_ASSET[l.type];
    if (!assetId) continue;
    // enemy camp fog: keep the camp landmark (known origin), but dim if unscouted
    items.push({
      y: l.y,
      z: 1,
      render: () => drawLandmark(ctx, assetId, l, W2S, p, time),
    });
  }
  // decorative props enrich the world
  const village = locById.get("village");
  if (village) {
    items.push({ y: village.y + 5, z: 1, render: () => drawProp(ctx, "watermill_valedorn", village.x - 9, village.y + 6, W2S, p) });
  }
  const bridge = locById.get("bridge");
  if (bridge) {
    items.push({ y: bridge.y - 7, z: 1, render: () => drawProp(ctx, "watchtower_valedorn", bridge.x + 8, bridge.y - 9, W2S, p) });
    if (s.flags?.bridgeFortified) {
      items.push({ y: bridge.y + 2, z: 2, render: () => drawProp(ctx, "road_barricade_valedorn", bridge.x - 5, bridge.y + 2, W2S, p) });
    }
  }

  // unit tokens
  const visibleUnits = s.units.filter(
    (u) => u.count > 0 && u.state !== "destroyed" && (u.side === "player" || u.revealed),
  );
  // cluster offsets so stacked groups fan out
  const clusters: Record<string, number> = {};
  for (const u of visibleUnits) {
    const pos = unitWorldPos(u, locById);
    const key = `${Math.round(pos.x)}_${Math.round(pos.y)}`;
    const idx = clusters[key] ?? 0;
    clusters[key] = idx + 1;
    // Spiral the stacked groups outward so tokens and count plates don't overlap.
    const ang = idx * 2.4;
    const rad = idx ? 6 + idx * 1.7 : 0;
    const ox = Math.cos(ang) * rad;
    const oy = Math.sin(ang) * rad * 0.5;
    items.push({
      y: pos.y + oy + 2,
      z: 3,
      render: () => drawToken(ctx, u, pos.x + ox, pos.y + oy, W2S, p, time, s.selectedOfficerId),
    });
  }
  // fog markers for unrevealed enemy groups
  for (const u of s.units) {
    if (u.side !== "enemy" || u.revealed || u.count <= 0 || u.state === "destroyed") continue;
    const pos = unitWorldPos(u, locById);
    items.push({ y: pos.y, z: 3, render: () => drawFogToken(ctx, pos.x, pos.y, W2S, p, time) });
  }

  // supply wagons rolling from the village to the castle (Elyne's evacuation)
  if (s.village.cartsRolling > 0) {
    const v = locById.get("village");
    const c = locById.get("castle");
    if (v && c) {
      const n = Math.min(2, s.village.cartsRolling);
      for (let i = 0; i < n; i++) {
        const t = (time * 0.06 + i * 0.5) % 1;
        const wx = v.x + (c.x - v.x) * t;
        const wy = v.y + (c.y - v.y) * t;
        items.push({ y: wy, z: 2, render: () => drawProp(ctx, "supply_wagon_valedorn", wx, wy, W2S, p) });
      }
    }
  }

  items.sort((a, b) => a.y - b.y || a.z - b.z);
  for (const it of items) it.render();

  // battle rings + routes + selection + labels + lighting overlays
  drawRoutes(ctx, s, locById, W2S, time);
  for (const b of s.battles) {
    if (b.status !== "active") continue;
    const l = locById.get(b.locationId);
    if (l) drawBattleGlow(ctx, W2S(l.x, l.y), p, time);
  }
  drawNightDawn(ctx, w, h, W2S, p, s, locById, dawn, time);
  drawLabels(ctx, s, W2S, p, hover?.id, s.selectedLocationId);

  ctx.restore();
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function unitWorldPos(u: UnitGroup, locById: Map<string, Location>): { x: number; y: number } {
  if (u.state === "moving" && u.moveFromId && u.moveToId && u.moveProgress != null) {
    const a = locById.get(u.moveFromId);
    const b = locById.get(u.moveToId);
    if (a && b) {
      const t = u.moveProgress;
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
  }
  const l = locById.get(u.locationId);
  return { x: l?.x ?? 50, y: l?.y ?? 50 };
}

/* ---- terrain ---- */

function drawGround(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  W2S: (x: number, y: number) => { sx: number; sy: number },
  p: number,
  _time: number,
  _dawn: number,
) {
  // void behind the diorama
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#0b1220");
  bg.addColorStop(1, "#0a0f18");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // land mass (ellipse) in world space
  const c = W2S(55, 52);
  const rx = 58 * p;
  const ry = 46 * p;
  ctx.save();
  // soft table shadow
  ctx.beginPath();
  ctx.ellipse(c.sx, c.sy + 8, rx * 1.02, ry * 1.02, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.filter = "blur(12px)";
  ctx.fill();
  ctx.filter = "none";

  ctx.beginPath();
  ctx.ellipse(c.sx, c.sy, rx, ry, 0, 0, Math.PI * 2);
  ctx.clip();
  const grass = ctx.createRadialGradient(c.sx - rx * 0.2, c.sy - ry * 0.3, ry * 0.2, c.sx, c.sy, rx);
  grass.addColorStop(0, "#5f6f3c");
  grass.addColorStop(0.55, "#4c5c31");
  grass.addColorStop(1, "#38431f");
  ctx.fillStyle = grass;
  ctx.fillRect(c.sx - rx, c.sy - ry, rx * 2, ry * 2);
  // warm dirt patches
  for (const [px, py, pr, col] of [
    [30, 66, 20, "rgba(120,96,52,0.30)"],
    [70, 40, 22, "rgba(96,110,58,0.28)"],
    [48, 24, 16, "rgba(70,92,50,0.30)"],
  ] as [number, number, number, string][]) {
    const s0 = W2S(px, py);
    const gr = ctx.createRadialGradient(s0.sx, s0.sy, 2, s0.sx, s0.sy, pr * p);
    gr.addColorStop(0, col);
    gr.addColorStop(1, "transparent");
    ctx.fillStyle = gr;
    ctx.fillRect(c.sx - rx, c.sy - ry, rx * 2, ry * 2);
  }
  ctx.restore();

  // rim light on the land edge
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(c.sx, c.sy, rx, ry, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(20,26,16,0.9)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function drawRiver(
  ctx: CanvasRenderingContext2D,
  W2S: (x: number, y: number) => { sx: number; sy: number },
  p: number,
  time: number,
  _dawn: number,
) {
  // river runs NE→SW passing through the bridge at (50,60)
  const pts: [number, number][] = [
    [66, 6],
    [58, 30],
    [50, 60],
    [42, 82],
    [36, 98],
  ];
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  // banks
  ctx.beginPath();
  strokePath(ctx, pts, W2S);
  ctx.strokeStyle = "#5b5030";
  ctx.lineWidth = 11 * p * 0.9;
  ctx.stroke();
  // water
  ctx.beginPath();
  strokePath(ctx, pts, W2S);
  const s0 = W2S(50, 60);
  const wg = ctx.createLinearGradient(s0.sx - 40, 0, s0.sx + 40, 0);
  wg.addColorStop(0, "#2f6d93");
  wg.addColorStop(0.5, "#4a97c0");
  wg.addColorStop(1, "#2f6d93");
  ctx.strokeStyle = wg;
  ctx.lineWidth = 8 * p * 0.9;
  ctx.stroke();
  // moving shimmer
  ctx.beginPath();
  strokePath(ctx, pts, W2S);
  ctx.strokeStyle = "rgba(200,230,255,0.28)";
  ctx.lineWidth = 2.2 * p * 0.9;
  ctx.setLineDash([6, 14]);
  ctx.lineDashOffset = -(time * 26) % 400;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function strokePath(
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
  W2S: (x: number, y: number) => { sx: number; sy: number },
) {
  const s0 = W2S(pts[0][0], pts[0][1]);
  ctx.moveTo(s0.sx, s0.sy);
  for (let i = 1; i < pts.length - 1; i++) {
    const a = W2S(pts[i][0], pts[i][1]);
    const b = W2S(pts[i + 1][0], pts[i + 1][1]);
    ctx.quadraticCurveTo(a.sx, a.sy, (a.sx + b.sx) / 2, (a.sy + b.sy) / 2);
  }
  const last = W2S(pts[pts.length - 1][0], pts[pts.length - 1][1]);
  ctx.lineTo(last.sx, last.sy);
}

function drawRoads(
  ctx: CanvasRenderingContext2D,
  s: GameState,
  W2S: (x: number, y: number) => { sx: number; sy: number },
) {
  const seen = new Set<string>();
  ctx.save();
  ctx.strokeStyle = "rgba(196,168,110,0.34)";
  ctx.lineWidth = 3;
  ctx.setLineDash([2, 7]);
  ctx.lineCap = "round";
  for (const l of s.locations) {
    for (const r of l.roads) {
      const key = [l.id, r.to].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      const to = s.locations.find((x) => x.id === r.to);
      if (!to) continue;
      const a = W2S(l.x, l.y);
      const b = W2S(to.x, to.y);
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }
  }
  ctx.setLineDash([]);
  ctx.restore();
}

/* ---- sprites ---- */

function drawImageAnchored(
  ctx: CanvasRenderingContext2D,
  asset: GameAsset,
  img: HTMLImageElement,
  sx: number,
  sy: number,
  drawW: number,
) {
  const drawH = drawW * (img.height / img.width);
  const dx = sx - asset.anchor[0] * drawW;
  const dy = sy - asset.anchor[1] * drawH;
  // contact shadow
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(sx, sy - drawH * 0.02, drawW * 0.34, drawW * 0.11, 0, 0, Math.PI * 2);
  ctx.filter = "blur(5px)";
  ctx.fill();
  ctx.restore();
  ctx.drawImage(img, dx, dy, drawW, drawH);
}

function drawLandmark(
  ctx: CanvasRenderingContext2D,
  assetId: string,
  l: Location,
  W2S: (x: number, y: number) => { sx: number; sy: number },
  p: number,
  _time: number,
) {
  const asset = getAsset(assetId);
  const img = getImage(assetId);
  const { sx, sy } = W2S(l.x, l.y);
  if (!asset || !img) {
    // procedural fallback: a colored mound with a label dot
    ctx.save();
    ctx.fillStyle = l.controlledBy === "enemy" ? "#5b2b26" : "#3f4a2a";
    ctx.beginPath();
    ctx.arc(sx, sy - 14, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }
  const drawW = asset.recommendedScale * ART_K * p;
  drawImageAnchored(ctx, asset, img, sx, sy, drawW);
}

function drawProp(
  ctx: CanvasRenderingContext2D,
  assetId: string,
  wx: number,
  wy: number,
  W2S: (x: number, y: number) => { sx: number; sy: number },
  p: number,
) {
  const asset = getAsset(assetId);
  const img = getImage(assetId);
  if (!asset || !img) return;
  const { sx, sy } = W2S(wx, wy);
  const drawW = asset.recommendedScale * ART_K * p;
  drawImageAnchored(ctx, asset, img, sx, sy, drawW);
}

function drawToken(
  ctx: CanvasRenderingContext2D,
  u: UnitGroup,
  wx: number,
  wy: number,
  W2S: (x: number, y: number) => { sx: number; sy: number },
  p: number,
  time: number,
  selectedOfficerId: string | null,
) {
  const assetId = unitAssetId(u);
  const asset = getAsset(assetId);
  const img = getImage(assetId);
  const bob = u.state === "moving" ? Math.sin(time * 4 + wx) * 0.6 : Math.sin(time * 1.6 + wx) * 0.25;
  const { sx, sy } = W2S(wx, wy + bob * 0.2);
  const factionCol = u.side === "player" ? "#6fb0ff" : "#e2694f";
  const selected = u.commanderId != null && u.commanderId === selectedOfficerId;

  // faction ring on the ground
  ctx.save();
  const ringR = (u.side === "player" ? 8 : 8) * p * 0.9;
  ctx.beginPath();
  ctx.ellipse(sx, sy, ringR, ringR * 0.42, 0, 0, Math.PI * 2);
  ctx.strokeStyle = selected ? "#ffe08a" : factionCol + "cc";
  ctx.lineWidth = selected ? 3 : 2;
  ctx.stroke();
  if (selected) {
    ctx.beginPath();
    ctx.ellipse(sx, sy, ringR * 1.25, ringR * 0.52, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,224,138,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();

  if (asset && img) {
    const drawW = asset.recommendedScale * ART_K * p;
    drawImageAnchored(ctx, asset, img, sx, sy, drawW);
  } else {
    ctx.save();
    ctx.fillStyle = factionCol;
    ctx.beginPath();
    ctx.arc(sx, sy - 10 * p * 0.4, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // count + morale plate
  const plateW = 42;
  const plateH = 16;
  const top = asset ? sy - asset.recommendedScale * ART_K * p * 0.9 : sy - 30;
  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = "rgba(10,10,14,0.82)";
  roundRect(ctx, sx - plateW / 2, top, plateW, plateH, 4);
  ctx.fill();
  ctx.strokeStyle = factionCol + "aa";
  ctx.lineWidth = 1;
  roundRect(ctx, sx - plateW / 2, top, plateW, plateH, 4);
  ctx.stroke();
  ctx.fillStyle = "#f0ead8";
  ctx.font = "700 10px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(u.count), sx, top + plateH / 2 - 1);
  // morale bar
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(sx - plateW / 2 + 4, top + plateH - 3, plateW - 8, 2);
  ctx.fillStyle = u.morale > 50 ? "#8ec06a" : u.morale > 28 ? "#d8b24a" : "#d0663f";
  ctx.fillRect(sx - plateW / 2 + 4, top + plateH - 3, (plateW - 8) * (u.morale / 100), 2);
  ctx.restore();
}

function drawFogToken(
  ctx: CanvasRenderingContext2D,
  wx: number,
  wy: number,
  W2S: (x: number, y: number) => { sx: number; sy: number },
  p: number,
  _time: number,
) {
  const { sx, sy } = W2S(wx, wy);
  ctx.save();
  const r = 12 * p * 0.7;
  const g = ctx.createRadialGradient(sx, sy - r, 2, sx, sy - r, r * 1.6);
  g.addColorStop(0, "rgba(120,40,34,0.55)");
  g.addColorStop(1, "rgba(40,14,12,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(sx, sy - r, r * 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(230,190,180,0.85)";
  ctx.font = "700 15px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("?", sx, sy - r);
  ctx.restore();
}

function drawRoutes(
  ctx: CanvasRenderingContext2D,
  s: GameState,
  locById: Map<string, Location>,
  W2S: (x: number, y: number) => { sx: number; sy: number },
  time: number,
) {
  for (const u of s.units) {
    if (u.state !== "moving" || !u.moveDestId) continue;
    if (u.side === "enemy" && !u.revealed) continue;
    const pos = unitWorldPos(u, locById);
    const dest = locById.get(u.moveDestId);
    if (!dest) continue;
    const a = W2S(pos.x, pos.y);
    const b = W2S(dest.x, dest.y);
    ctx.save();
    ctx.strokeStyle = u.side === "player" ? "rgba(126,196,112,0.9)" : "rgba(214,92,70,0.85)";
    ctx.lineWidth = 2.4;
    ctx.setLineDash([3, 5]);
    ctx.lineDashOffset = -(time * 30) % 100;
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
}

function drawBattleGlow(
  ctx: CanvasRenderingContext2D,
  { sx, sy }: { sx: number; sy: number },
  p: number,
  time: number,
) {
  const pulse = 0.6 + Math.sin(time * 4) * 0.4;
  ctx.save();
  const r = 22 * p * 0.6;
  const g = ctx.createRadialGradient(sx, sy - r * 0.5, 2, sx, sy - r * 0.5, r);
  g.addColorStop(0, `rgba(255,150,60,${0.5 * pulse})`);
  g.addColorStop(1, "rgba(255,90,40,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(sx, sy - r * 0.5, r, 0, Math.PI * 2);
  ctx.fill();
  // crossed-swords mark
  ctx.strokeStyle = "rgba(255,220,180,0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sx - 6, sy - 22);
  ctx.lineTo(sx + 6, sy - 10);
  ctx.moveTo(sx + 6, sy - 22);
  ctx.lineTo(sx - 6, sy - 10);
  ctx.stroke();
  ctx.restore();
}

function drawNightDawn(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  W2S: (x: number, y: number) => { sx: number; sy: number },
  p: number,
  s: GameState,
  locById: Map<string, Location>,
  dawn: number,
  time: number,
) {
  // night wash weakens as dawn approaches
  const night = 1 - dawn;
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  const wash = ctx.createLinearGradient(0, 0, w, h);
  const a = 0.44 * night;
  wash.addColorStop(0, `rgba(30,42,86,${a})`);
  wash.addColorStop(1, `rgba(12,18,40,${a + 0.08})`);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // dawn warmth from the east
  if (dawn > 0.02) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const e = W2S(96, 30);
    const g = ctx.createRadialGradient(e.sx, e.sy, 10, e.sx, e.sy, Math.max(w, h) * 0.8);
    g.addColorStop(0, `rgba(255,190,120,${0.28 * dawn})`);
    g.addColorStop(1, "rgba(255,180,120,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  // torch glow at held player positions (stronger at night)
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const held = new Set(
    s.units.filter((u) => u.side === "player" && u.count > 0 && u.state !== "moving").map((u) => u.locationId),
  );
  for (const id of held) {
    const l = locById.get(id);
    if (!l) continue;
    const { sx, sy } = W2S(l.x, l.y);
    const flick = 0.8 + Math.sin(time * 6 + l.x) * 0.2;
    const r = 26 * p * 0.6;
    const g = ctx.createRadialGradient(sx, sy - 6, 2, sx, sy - 6, r);
    g.addColorStop(0, `rgba(255,170,80,${0.32 * night * flick + 0.06})`);
    g.addColorStop(1, "rgba(255,150,70,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(sx, sy - 6, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // vignette
  ctx.save();
  const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.72);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.4)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function drawLabels(
  ctx: CanvasRenderingContext2D,
  s: GameState,
  W2S: (x: number, y: number) => { sx: number; sy: number },
  _p: number,
  hoverId: string | undefined,
  selectedId: string | null,
) {
  ctx.save();
  ctx.font = "600 11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const l of s.locations) {
    const { sx, sy } = W2S(l.x, l.y);
    const isObj = l.isObjective;
    const emph = hoverId === l.id || selectedId === l.id;
    const label = l.name;
    const tw = ctx.measureText(label).width;
    const ly = sy + 14;
    ctx.globalAlpha = emph ? 1 : 0.9;
    ctx.fillStyle = emph ? "rgba(20,16,11,0.94)" : "rgba(10,8,6,0.72)";
    roundRect(ctx, sx - tw / 2 - 6, ly - 8, tw + 12, 16, 8);
    ctx.fill();
    ctx.strokeStyle = emph ? "var(--gold-bright)" : isObj ? "rgba(203,162,74,0.7)" : "rgba(120,100,60,0.5)";
    ctx.lineWidth = 1;
    roundRect(ctx, sx - tw / 2 - 6, ly - 8, tw + 12, 16, 8);
    ctx.stroke();
    ctx.fillStyle = isObj ? "#e6c56b" : "#e8dcc0";
    ctx.fillText(label, sx, ly);
  }
  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ---- tooltip (HTML) ---- */

function MapTip({ loc, units, x, y }: { loc: Location; units: UnitGroup[]; x: number; y: number }) {
  const here = units.filter(
    (u) => u.count > 0 && u.locationId === loc.id && (u.side === "player" || u.revealed),
  );
  const eff = loc.effects;
  const tags: string[] = [];
  if (eff.defenseBonus > 1.1) tags.push(`оборона ×${eff.defenseBonus}`);
  if (eff.archerBonus > 1.1) tags.push(`лучники ×${eff.archerBonus}`);
  if (eff.chokePoint) tags.push("узкий проход");
  if (eff.hidesTroops) tags.push("укрытие");
  if (eff.grantsVision) tags.push("обзор");
  if (loc.foodStore > 0) tags.push(`припасы ${loc.foodStore}`);
  return (
    <div className="map-tip lm-tip" style={{ left: x, top: y }}>
      <div className="tt-name">{loc.name}</div>
      <div className="tt-type">{LOCATION_TYPE_LABELS[loc.type]}</div>
      <div className="tt-desc">{loc.description}</div>
      {tags.length > 0 && (
        <div className="tt-stats">
          {tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      )}
      {here.length > 0 && (
        <div className="tt-stats">
          {here.map((u) => (
            <span key={u.id} style={{ color: u.side === "enemy" ? "var(--red-bright)" : "var(--green)" }}>
              {u.count} {UNIT_LABELS[u.type].toLowerCase()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

