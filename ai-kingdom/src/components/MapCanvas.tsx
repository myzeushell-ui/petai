/**
 * Cartographic battlefield renderer.
 *
 * Draws the strategic map as a hand-inked royal war map on aged parchment —
 * river, forest, hills, fields, settlements, roads — with night lighting,
 * torch glow at held positions, fog over un-scouted ground and a dawn warmth
 * that grows as the night ends. Pure Canvas, no external assets (CSP-safe).
 * The interactive nodes/markers live in a DOM layer above this.
 */

import { useEffect, useRef } from "react";
import type { Location } from "../game/types";

export interface MapCanvasProps {
  locations: Location[];
  heldIds: string[];
  battleIds: string[];
  intelLevel: number;
  timeUntilDawn: number;
  durationMinutes: number;
  villageRaided: boolean;
}

/* deterministic PRNG so the drawn terrain is stable across redraws */
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function MapCanvas(props: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Redraw only when something that affects the drawing changes.
  const sig = [
    props.locations.map((l) => l.id).join(","),
    props.heldIds.slice().sort().join(","),
    props.battleIds.slice().sort().join(","),
    Math.round(props.intelLevel * 4),
    Math.floor(props.timeUntilDawn / 20),
    props.villageRaided,
  ].join("|");

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let raf = 0;
    const draw = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(ctx, w, h, props);
    };

    draw();
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    });
    ro.observe(wrap);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  return (
    <div ref={wrapRef} className="map-canvas-wrap">
      <canvas ref={canvasRef} className="map-canvas" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

const PALETTE = {
  paper0: "#efe3c4",
  paper1: "#e3d0a8",
  paper2: "#d3bd90",
  paperEdge: "#8a6f45",
  ink: "#4a3a22",
  inkSoft: "#6b5738",
  forest: "#5c6b3a",
  forestDark: "#3f4a26",
  water: "#7c93a0",
  waterDark: "#5b7280",
  hill: "#9a7f4e",
  road: "#7a5f38",
  fire: "#e8a24a",
  night: "#1a2740",
};

function px(pct: number, dim: number): number {
  return (pct / 100) * dim;
}

function render(ctx: CanvasRenderingContext2D, w: number, h: number, p: MapCanvasProps) {
  const R = mulberry(1337);

  drawParchment(ctx, w, h, R);
  drawFields(ctx, w, h, R);
  drawRiver(ctx, w, h);
  drawTerrain(ctx, w, h, p.locations, R);
  drawRoads(ctx, w, h, p.locations);
  drawFog(ctx, w, h, p);
  drawNight(ctx, w, h, p);
  drawFrame(ctx, w, h);
  drawCompass(ctx, w, h);
}

function drawParchment(ctx: CanvasRenderingContext2D, w: number, h: number, R: () => number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, PALETTE.paper0);
  g.addColorStop(0.55, PALETTE.paper1);
  g.addColorStop(1, PALETTE.paper2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Age stains — soft irregular blotches.
  for (let i = 0; i < 26; i++) {
    const x = R() * w;
    const y = R() * h;
    const r = (0.03 + R() * 0.09) * Math.min(w, h);
    const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
    const a = 0.04 + R() * 0.06;
    rg.addColorStop(0, `rgba(90,64,32,${a})`);
    rg.addColorStop(1, "rgba(90,64,32,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Paper fibre speckle.
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = R() > 0.5 ? "#3a2c18" : "#fff4d8";
    ctx.fillRect(R() * w, R() * h, 1, 1);
  }
  ctx.globalAlpha = 1;

  // Burnt / darkened edges (vignette).
  const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.42, w / 2, h / 2, Math.max(w, h) * 0.75);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(48,32,14,0.32)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
}

function drawFields(ctx: CanvasRenderingContext2D, w: number, h: number, R: () => number) {
  // Faint hatch marks suggesting open farmland in the south-west.
  ctx.strokeStyle = "rgba(120,96,56,0.10)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) {
    const x = R() * w * 0.6;
    const y = h * 0.55 + R() * h * 0.4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 5, y + 2);
    ctx.stroke();
  }
}

function riverPoints(w: number, h: number) {
  // Mirrors the SVG river band through the bridge.
  return {
    p0: { x: px(63, w), y: px(2, h) },
    c1: { x: px(52, w), y: px(34, h) },
    p1: { x: px(50, w), y: px(60, h) },
    c2: { x: px(48, w), y: px(82, h) },
    p2: { x: px(40, w), y: px(100, h) },
  };
}

function drawRiver(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const { p0, c1, p1, c2, p2 } = riverPoints(w, h);
  const band = (width: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.quadraticCurveTo(c1.x, c1.y, p1.x, p1.y);
    ctx.quadraticCurveTo(c2.x, c2.y, p2.x, p2.y);
    ctx.stroke();
  };
  band(px(2.8, w), "rgba(91,114,128,0.5)"); // dark banks
  band(px(1.9, w), PALETTE.water);
  band(px(0.7, w), "rgba(205,222,230,0.45)"); // highlight
}

function treeMark(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.fillStyle = PALETTE.forestDark;
  ctx.fillRect(x - 0.6, y, 1.2, s * 0.5);
  ctx.fillStyle = PALETTE.forest;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x + s * 0.6, y + s * 0.2);
  ctx.lineTo(x - s * 0.6, y + s * 0.2);
  ctx.closePath();
  ctx.fill();
}

function drawTerrain(ctx: CanvasRenderingContext2D, w: number, h: number, locations: Location[], R: () => number) {
  const at = (id: string) => locations.find((l) => l.id === id);

  // Northern forest — a cluster of inked trees.
  const forest = at("forest");
  if (forest) {
    const cx = px(forest.x, w);
    const cy = px(forest.y, h);
    const rad = Math.min(w, h) * 0.16;
    for (let i = 0; i < 46; i++) {
      const ang = R() * Math.PI * 2;
      const rr = Math.sqrt(R()) * rad;
      const tx = cx + Math.cos(ang) * rr * 1.25;
      const ty = cy + Math.sin(ang) * rr * 0.8 - rad * 0.3;
      if (Math.hypot(tx - cx, ty - cy) < rad * 0.32) continue; // keep node clear
      treeMark(ctx, tx, ty, 4 + R() * 3);
    }
  }

  // Eastern hills — hachure arcs suggesting elevation.
  const hills = at("hills");
  if (hills) {
    const cx = px(hills.x, w);
    const cy = px(hills.y, h);
    ctx.strokeStyle = "rgba(122,95,56,0.5)";
    ctx.lineWidth = 1.3;
    for (let k = 0; k < 3; k++) {
      const ry = 18 + k * 12;
      const rx = 34 + k * 16;
      ctx.beginPath();
      ctx.ellipse(cx + (k - 1) * 10, cy + 6, rx, ry, 0, Math.PI * 0.08, Math.PI * 0.92);
      ctx.stroke();
      // little downhill hachures
      for (let j = 0; j < 8; j++) {
        const t = 0.12 + (j / 8) * 0.76;
        const a = Math.PI * t;
        const ex = cx + (k - 1) * 10 + Math.cos(a) * rx;
        const ey = cy + 6 + Math.sin(a) * ry;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex, ey + 4);
        ctx.stroke();
      }
    }
  }

  // Village — a few drawn roofs.
  const village = at("village");
  if (village) {
    const cx = px(village.x, w);
    const cy = px(village.y, h);
    for (let i = 0; i < 5; i++) {
      const hx = cx + (R() - 0.5) * 34;
      const hy = cy + (R() - 0.5) * 24 + 14;
      ctx.fillStyle = "rgba(120,74,40,0.7)";
      ctx.beginPath();
      ctx.moveTo(hx - 4, hy);
      ctx.lineTo(hx, hy - 4);
      ctx.lineTo(hx + 4, hy);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(70,50,28,0.6)";
      ctx.fillRect(hx - 3, hy, 6, 3);
    }
  }

  // Enemy camp — faint tents (kept subtle; fog handles concealment).
  const camp = at("enemy_camp");
  if (camp) {
    const cx = px(camp.x, w);
    const cy = px(camp.y, h);
    for (let i = 0; i < 6; i++) {
      const tx = cx + (R() - 0.5) * 40;
      const ty = cy + (R() - 0.5) * 28 + 14;
      ctx.fillStyle = "rgba(90,40,32,0.55)";
      ctx.beginPath();
      ctx.moveTo(tx, ty - 5);
      ctx.lineTo(tx + 5, ty + 3);
      ctx.lineTo(tx - 5, ty + 3);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Castle — a drawn rocky outcrop base.
  const castle = at("castle");
  if (castle) {
    const cx = px(castle.x, w);
    const cy = px(castle.y, h);
    ctx.fillStyle = "rgba(90,80,70,0.35)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 20, 40, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRoads(ctx: CanvasRenderingContext2D, w: number, h: number, locations: Location[]) {
  const seen = new Set<string>();
  ctx.lineCap = "round";
  for (const loc of locations) {
    for (const road of loc.roads) {
      const key = [loc.id, road.to].sort().join("-");
      if (seen.has(key)) continue;
      seen.add(key);
      const b = locations.find((l) => l.id === road.to);
      if (!b) continue;
      const x1 = px(loc.x, w), y1 = px(loc.y, h), x2 = px(b.x, w), y2 = px(b.y, h);
      // worn dirt track: soft light base + dashed ink centre
      ctx.strokeStyle = "rgba(150,120,74,0.30)";
      ctx.lineWidth = 5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(74,58,34,0.55)";
      ctx.lineWidth = 1.4;
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
  ctx.setLineDash([]);
}

function drawFog(ctx: CanvasRenderingContext2D, w: number, h: number, p: MapCanvasProps) {
  // The eastern approaches stay shrouded until scouting lifts the veil.
  const veil = Math.max(0, 0.42 - p.intelLevel * 0.42);
  if (veil <= 0.02) return;
  const g = ctx.createLinearGradient(w * 0.52, 0, w, 0);
  g.addColorStop(0, "rgba(28,34,44,0)");
  g.addColorStop(1, `rgba(24,30,42,${veil})`);
  ctx.fillStyle = g;
  ctx.fillRect(w * 0.52, 0, w * 0.48, h);
}

function drawNight(ctx: CanvasRenderingContext2D, w: number, h: number, p: MapCanvasProps) {
  // Gentle cool night tint — enough for mood, not enough to bury the parchment.
  ctx.fillStyle = "rgba(30,44,72,0.13)";
  ctx.fillRect(0, 0, w, h);

  // Moonlight from the upper-left.
  const moon = ctx.createRadialGradient(w * 0.16, h * 0.12, 0, w * 0.16, h * 0.12, Math.min(w, h) * 0.5);
  moon.addColorStop(0, "rgba(200,216,245,0.14)");
  moon.addColorStop(1, "rgba(200,216,245,0)");
  ctx.fillStyle = moon;
  ctx.fillRect(0, 0, w, h);

  // Warm torch glow at held positions and battles.
  const glow = (id: string, color: string, strength: number, radius: number) => {
    const loc = p.locations.find((l) => l.id === id);
    if (!loc) return;
    const x = px(loc.x, w), y = px(loc.y, h);
    const rg = ctx.createRadialGradient(x, y, 0, x, y, radius);
    rg.addColorStop(0, color.replace("A", String(strength)));
    rg.addColorStop(1, color.replace("A", "0"));
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };
  for (const id of p.heldIds) glow(id, "rgba(232,162,74,A)", 0.22, Math.min(w, h) * 0.14);
  // Castle always has hearth-light.
  glow("castle", "rgba(232,162,74,A)", 0.18, Math.min(w, h) * 0.16);
  for (const id of p.battleIds) glow(id, "rgba(220,90,60,A)", 0.32, Math.min(w, h) * 0.15);
  if (p.villageRaided) glow("village", "rgba(210,70,45,A)", 0.3, Math.min(w, h) * 0.13);

  // Dawn: the eastern sky warms as the night runs out.
  const prog = 1 - Math.max(0, Math.min(1, p.timeUntilDawn / p.durationMinutes));
  if (prog > 0.55) {
    const d = (prog - 0.55) / 0.45;
    const dg = ctx.createLinearGradient(w, 0, w * 0.4, 0);
    dg.addColorStop(0, `rgba(232,150,90,${0.22 * d})`);
    dg.addColorStop(1, "rgba(232,150,90,0)");
    ctx.fillStyle = dg;
    ctx.fillRect(w * 0.4, 0, w * 0.6, h);
  }
}

function drawFrame(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = "rgba(74,58,34,0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(6, 6, w - 12, h - 12);
  ctx.strokeStyle = "rgba(203,162,74,0.4)";
  ctx.lineWidth = 1;
  ctx.strokeRect(10, 10, w - 20, h - 20);
}

function drawCompass(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w - 34;
  const cy = h - 34;
  const r = 15;
  ctx.strokeStyle = "rgba(74,58,34,0.6)";
  ctx.fillStyle = "rgba(74,58,34,0.6)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  // north star
  ctx.beginPath();
  ctx.moveTo(cx, cy - r - 2);
  ctx.lineTo(cx + 3, cy);
  ctx.lineTo(cx, cy + r + 2);
  ctx.lineTo(cx - 3, cy);
  ctx.closePath();
  ctx.fill();
  ctx.font = "8px Georgia, serif";
  ctx.fillStyle = "rgba(74,58,34,0.8)";
  ctx.textAlign = "center";
  ctx.fillText("С", cx, cy - r - 5);
}
