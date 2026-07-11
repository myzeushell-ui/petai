/**
 * Tactical battle scene — a Warcraft II / Lords of the Realm II inspired view.
 *
 * When a battle is underway the player can zoom into a tiled battlefield where
 * sprite armies clash: spearmen hold the line, archers loose volleys, cavalry
 * charges the flank, the fallen drop in puffs of dust. It is a *visualisation*
 * of the running simulation — the Battle object's counts, momentum and status
 * drive it; nothing here changes the outcome. Pure Canvas, no external assets.
 */

import { useEffect, useMemo, useRef } from "react";
import { useGame } from "../state/GameContext";
import { UNIT_LABELS } from "../game/constants";
import type { GameState, LocationType, Side } from "../game/types";

interface SideSnap {
  spearmen: number;
  archers: number;
  cavalry: number;
  morale: number;
  total: number;
}
interface Snap {
  locType: LocationType;
  locName: string;
  defender: Side;
  status: string;
  momentum: number;
  player: SideSnap;
  enemy: SideSnap;
  playerCasualties: number;
  enemyCasualties: number;
}

function sideCounts(s: GameState, ids: string[]): SideSnap {
  const out: SideSnap = { spearmen: 0, archers: 0, cavalry: 0, morale: 0, total: 0 };
  let mSum = 0, groups = 0;
  for (const id of ids) {
    const u = s.units.find((g) => g.id === id);
    if (!u || u.count <= 0) continue;
    out[u.type] += u.count;
    out.total += u.count;
    mSum += u.morale;
    groups++;
  }
  out.morale = groups ? Math.round(mSum / groups) : 0;
  return out;
}

/* ------------------------------------------------------------------ */

interface Arrow { x: number; y: number; x0: number; y0: number; x1: number; y1: number; t: number; }
interface Puff { x: number; y: number; t: number; enemy: boolean; }

export default function BattleScene() {
  const g = useGame();
  const s = g.state!;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const snapRef = useRef<Snap | null>(null);

  const battle = s.battles.find((b) => b.id === s.viewBattleId) ?? null;

  const snap = useMemo<Snap | null>(() => {
    if (!battle) return null;
    const loc = s.locations.find((l) => l.id === battle.locationId);
    return {
      locType: loc?.type ?? "field",
      locName: loc?.name ?? "Поле боя",
      defender: battle.defenderSide,
      status: battle.status,
      momentum: battle.momentum,
      player: sideCounts(s, battle.playerGroupIds),
      enemy: sideCounts(s, battle.enemyGroupIds),
      playerCasualties: battle.playerCasualties,
      enemyCasualties: battle.enemyCasualties,
    };
  }, [s, battle]);
  snapRef.current = snap;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let last = performance.now();
    let arrowTimer = 0;
    const arrows: Arrow[] = [];
    const puffs: Puff[] = [];
    let lastP = snapRef.current?.player.total ?? 0;
    let lastE = snapRef.current?.enemy.total ?? 0;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;

      const rect = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const snp = snapRef.current;
      if (!snp) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const active = snp.status === "active";
      const frontX = w / 2 + (snp.momentum / 100) * w * 0.14;
      const combatTop = snp.locType === "bridge" ? h * 0.42 : h * 0.3;
      const combatBot = snp.locType === "bridge" ? h * 0.62 : h * 0.82;

      drawTerrain(ctx, w, h, snp.locType, t);

      // Casualty puffs when a side's numbers drop.
      if (snp.player.total < lastP) spawnPuffs(puffs, frontX - 30, combatTop, combatBot, false, lastP - snp.player.total);
      if (snp.enemy.total < lastE) spawnPuffs(puffs, frontX + 30, combatTop, combatBot, true, lastE - snp.enemy.total);
      lastP = snp.player.total;
      lastE = snp.enemy.total;

      // Ranks.
      drawRank(ctx, "player", "spearmen", snp.player.spearmen, frontX - 34, combatTop, combatBot, t, active, snp.locType);
      drawRank(ctx, "player", "archers", snp.player.archers, frontX - 92, combatTop - 6, combatBot + 6, t, false, snp.locType);
      drawRank(ctx, "enemy", "spearmen", snp.enemy.spearmen, frontX + 34, combatTop, combatBot, t, active, snp.locType);
      drawRank(ctx, "enemy", "archers", snp.enemy.archers, frontX + 92, combatTop - 6, combatBot + 6, t, false, snp.locType);

      // Cavalry as charging wings, kept on their own land near the approaches.
      drawCavalry(ctx, w, snp, frontX, t, active, (combatTop + combatBot) / 2);

      // Archer volleys.
      arrowTimer -= dt;
      if (active && arrowTimer <= 0) {
        arrowTimer = 0.5 + 0.4 * (1 - Math.min(1, (snp.player.archers + snp.enemy.archers) / 300));
        if (snp.player.archers > 0) launch(arrows, frontX - 92, mid(combatTop, combatBot), frontX + 30, rand(combatTop, combatBot));
        if (snp.enemy.archers > 0) launch(arrows, frontX + 92, mid(combatTop, combatBot), frontX - 30, rand(combatTop, combatBot));
      }
      updateArrows(ctx, arrows, puffs, dt);
      updatePuffs(ctx, puffs, dt);

      // Front-line clash sparks.
      if (active && snp.player.total > 0 && snp.enemy.total > 0) {
        drawClash(ctx, frontX, combatTop, combatBot, t);
      }

      drawFrame(ctx, w, h);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!battle || !snap) return null;

  const won = snap.status === "player_won";
  const lost = snap.status === "enemy_won";
  const over = won || lost;

  return (
    <div className="overlay battle-overlay">
      <div className="battle-scene">
        <div className="bs-top">
          <div className="bs-title">⚔ {snap.locName}</div>
          <button className="btn btn-ghost btn-sm" onClick={() => g.viewBattle(null)}>
            Вернуться на карту ✕
          </button>
        </div>

        <div ref={wrapRef} className="bs-field">
          <canvas ref={canvasRef} className="bs-canvas" />
          {over && (
            <div className={`bs-result ${won ? "win" : "lose"}`}>{won ? "Враг отброшен!" : "Позиция потеряна"}</div>
          )}
        </div>

        <div className="bs-hud">
          <SidePanel title="Наши войска" snap={snap.player} casualties={snap.playerCasualties} side="player" />
          <div className="bs-momentum">
            <div className="bs-mom-label">Перевес</div>
            <div className="bs-mom-bar">
              <span
                style={{
                  left: `${50 + Math.max(-48, Math.min(48, snap.momentum / 2))}%`,
                }}
              />
            </div>
            <div className="bs-mom-sub">{snap.status === "active" ? "Идёт бой…" : won ? "Победа" : lost ? "Поражение" : "Затишье"}</div>
          </div>
          <SidePanel title={`Враг`} snap={snap.enemy} casualties={snap.enemyCasualties} side="enemy" />
        </div>
        <div className="bs-note">Исход решает ход сражения на карте — здесь вы наблюдаете за битвой.</div>
      </div>
    </div>
  );
}

function SidePanel({ title, snap, casualties, side }: { title: string; snap: SideSnap; casualties: number; side: Side }) {
  const row = (label: string, n: number) =>
    n > 0 ? (
      <div className="bs-row">
        <span>{label}</span>
        <span className="bs-n">{n}</span>
      </div>
    ) : null;
  return (
    <div className={`bs-side ${side}`}>
      <div className="bs-side-title">{title}</div>
      {row(UNIT_LABELS.spearmen, snap.spearmen)}
      {row(UNIT_LABELS.archers, snap.archers)}
      {row(UNIT_LABELS.cavalry, snap.cavalry)}
      <div className="bs-row bs-mor">
        <span>Мораль</span>
        <span className="bs-n">{snap.morale}</span>
      </div>
      <div className="bs-row bs-cas">
        <span>Потери</span>
        <span className="bs-n">≈{casualties}</span>
      </div>
    </div>
  );
}

/* ================= drawing ================= */

const COL = {
  playerCoat: "#4d7a3c",
  playerTrim: "#d8b24a",
  enemyCoat: "#8f2f24",
  enemyTrim: "#c9b28a",
  steel: "#c2c6cc",
  steelDark: "#8b9098",
  skin: "#caa079",
  shadow: "rgba(0,0,0,0.28)",
};

function mid(a: number, b: number) { return (a + b) / 2; }
function rand(a: number, b: number) { return a + (b - a) * pseudo(); }
let seedN = 12345;
function pseudo() { seedN = (seedN * 1103515245 + 12345) & 0x7fffffff; return seedN / 0x7fffffff; }

function drawTerrain(ctx: CanvasRenderingContext2D, w: number, h: number, type: LocationType, t: number) {
  // grass/dirt base
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#5c6e3e");
  g.addColorStop(1, "#48592f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // tile speckle
  ctx.globalAlpha = 0.5;
  for (let y = 0; y < h; y += 22) {
    for (let x = 0; x < w; x += 22) {
      const shade = (Math.floor(x / 22) + Math.floor(y / 22)) % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)";
      ctx.fillStyle = shade;
      ctx.fillRect(x, y, 22, 22);
    }
  }
  ctx.globalAlpha = 1;
  // grass tufts
  ctx.strokeStyle = "rgba(120,150,80,0.35)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 120; i++) {
    const x = ((i * 97) % w);
    const y = ((i * 173) % h);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 3);
    ctx.stroke();
  }

  if (type === "bridge") {
    // river across the middle, vertical, with a stone bridge deck.
    const rx = w / 2;
    const rw = w * 0.14;
    const rg = ctx.createLinearGradient(rx - rw, 0, rx + rw, 0);
    rg.addColorStop(0, "#3f5b6b");
    rg.addColorStop(0.5, "#6f93a4");
    rg.addColorStop(1, "#3f5b6b");
    ctx.fillStyle = rg;
    ctx.fillRect(rx - rw, 0, rw * 2, h);
    // shimmer
    ctx.strokeStyle = "rgba(220,235,240,0.25)";
    for (let i = 0; i < 6; i++) {
      const yy = ((t * 20 + i * h / 6) % h);
      ctx.beginPath();
      ctx.moveTo(rx - rw, yy);
      ctx.lineTo(rx + rw, yy + 6);
      ctx.stroke();
    }
    // stone bridge deck (horizontal band in vertical centre)
    const by = h * 0.42, bh = h * 0.2;
    ctx.fillStyle = "#8b7f6a";
    ctx.fillRect(rx - rw - 6, by, rw * 2 + 12, bh);
    ctx.fillStyle = "#6f6252";
    for (let x = rx - rw - 6; x < rx + rw + 6; x += 12) ctx.fillRect(x, by, 2, bh);
    ctx.strokeStyle = "#5a4f42";
    ctx.strokeRect(rx - rw - 6, by, rw * 2 + 12, bh);
  } else if (type === "castle") {
    // castle wall on the player's (left) edge
    ctx.fillStyle = "#7b756c";
    ctx.fillRect(0, 0, w * 0.1, h);
    ctx.fillStyle = "#5f5a52";
    for (let y = 0; y < h; y += 26) ctx.fillRect(0, y, w * 0.1, 3);
    // crenellations
    for (let y = 0; y < h; y += 20) ctx.fillRect(w * 0.1, y, 6, 10);
  } else if (type === "hills") {
    ctx.fillStyle = "rgba(120,100,60,0.25)";
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.quadraticCurveTo(w * 0.25, h * 0.4, w * 0.5, h * 0.65);
    ctx.lineTo(0, h * 0.65);
    ctx.closePath();
    ctx.fill();
  } else if (type === "forest") {
    for (let i = 0; i < 22; i++) {
      const x = (i * 131) % w;
      const y = (i * 71) % h;
      ctx.fillStyle = "#2f4a26";
      ctx.beginPath();
      ctx.moveTo(x, y - 8);
      ctx.lineTo(x + 6, y + 4);
      ctx.lineTo(x - 6, y + 4);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function drawRank(
  ctx: CanvasRenderingContext2D,
  side: Side,
  type: "spearmen" | "archers",
  count: number,
  x: number,
  top: number,
  bot: number,
  t: number,
  clashing: boolean,
  locType: LocationType,
) {
  if (count <= 0) return;
  const n = Math.max(1, Math.min(28, Math.round(count / 12)));
  const cols = type === "archers" ? 2 : 3;
  const rows = Math.ceil(n / cols);
  const band = bot - top;
  const rowGap = Math.min(16, band / Math.max(1, rows));
  seedN = 999 + (side === "player" ? 1 : 7) * 31 + type.length;
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const dir = side === "player" ? -1 : 1;
    const sx = x + dir * c * 11 + (pseudo() - 0.5) * 3;
    const sy = top + r * rowGap + (pseudo() - 0.5) * 3 + (locType === "bridge" ? 0 : 0);
    const bob = Math.sin(t * 5 + i) * (clashing ? 1.6 : 0.8);
    if (type === "spearmen") drawInfantry(ctx, sx, sy + bob, side, clashing, t + i);
    else drawArcher(ctx, sx, sy + bob, side, t + i);
  }
}

function drawInfantry(ctx: CanvasRenderingContext2D, x: number, y: number, side: Side, clash: boolean, t: number) {
  const coat = side === "player" ? COL.playerCoat : COL.enemyCoat;
  const dir = side === "player" ? 1 : -1;
  ctx.fillStyle = COL.shadow;
  ctx.beginPath();
  ctx.ellipse(x, y + 8, 5, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // legs
  ctx.strokeStyle = "#3a2c1c";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x - 2, y + 3);
  ctx.lineTo(x - 2, y + 8);
  ctx.moveTo(x + 2, y + 3);
  ctx.lineTo(x + 2, y + 8);
  ctx.stroke();
  // body
  ctx.fillStyle = coat;
  ctx.fillRect(x - 3, y - 3, 6, 7);
  // head + helm
  ctx.fillStyle = COL.skin;
  ctx.beginPath();
  ctx.arc(x, y - 5, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COL.steel;
  ctx.beginPath();
  ctx.arc(x, y - 6, 2.6, Math.PI, Math.PI * 2);
  ctx.fill();
  // shield
  ctx.fillStyle = COL.steelDark;
  ctx.fillRect(x + dir * 3 - (dir > 0 ? 0 : 1.5), y - 2, 1.6, 5);
  // spear
  const jab = clash ? Math.max(0, Math.sin(t * 6)) * 3 : 0;
  ctx.strokeStyle = "#7a5a34";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + dir * 2, y + 2);
  ctx.lineTo(x + dir * (6 + jab), y - 9);
  ctx.stroke();
  ctx.fillStyle = COL.steel;
  ctx.beginPath();
  ctx.arc(x + dir * (6 + jab), y - 9, 1.1, 0, Math.PI * 2);
  ctx.fill();
}

function drawArcher(ctx: CanvasRenderingContext2D, x: number, y: number, side: Side, t: number) {
  const coat = side === "player" ? COL.playerTrim : COL.enemyTrim;
  const dir = side === "player" ? 1 : -1;
  ctx.fillStyle = COL.shadow;
  ctx.beginPath();
  ctx.ellipse(x, y + 7, 4, 1.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = coat;
  ctx.fillRect(x - 2.4, y - 3, 5, 7);
  ctx.fillStyle = COL.skin;
  ctx.beginPath();
  ctx.arc(x, y - 5, 2.2, 0, Math.PI * 2);
  ctx.fill();
  // bow
  const draw = Math.max(0, Math.sin(t * 2)) * 1.5;
  ctx.strokeStyle = "#5a3d1e";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x + dir * 4, y - 1, 4, -Math.PI / 2.2, Math.PI / 2.2, dir < 0);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.beginPath();
  ctx.moveTo(x + dir * (4 - draw), y - 4);
  ctx.lineTo(x + dir * (4 - draw), y + 2);
  ctx.stroke();
}

function drawCavalry(ctx: CanvasRenderingContext2D, w: number, snp: Snap, frontX: number, t: number, active: boolean, combatMid: number) {
  const drawSide = (side: Side, count: number) => {
    if (count <= 0) return;
    const n = Math.min(6, Math.max(1, Math.ceil(count / 18)));
    const homeX = side === "player" ? w * 0.13 : w * 0.87;
    // Charge up to the river edge / approach, never standing in the water.
    const edgeX = side === "player" ? Math.min(frontX - 26, w * 0.42) : Math.max(frontX + 26, w * 0.58);
    const chargeT = active ? Math.sin(t * 0.7) * 0.5 + 0.5 : 0.2;
    const x = homeX + (edgeX - homeX) * chargeT;
    const baseY = combatMid + (side === "player" ? -46 : 46);
    for (let i = 0; i < n; i++) drawHorse(ctx, x, baseY + i * 12, side, t + i);
  };
  drawSide("player", snp.player.cavalry);
  drawSide("enemy", snp.enemy.cavalry);
}

function drawHorse(ctx: CanvasRenderingContext2D, x: number, y: number, side: Side, t: number) {
  const dir = side === "player" ? 1 : -1;
  const coat = side === "player" ? COL.playerCoat : COL.enemyCoat;
  const gallop = Math.sin(t * 10) * 1.5;
  ctx.fillStyle = COL.shadow;
  ctx.beginPath();
  ctx.ellipse(x, y + 6, 9, 2.4, 0, 0, Math.PI * 2);
  ctx.fill();
  // horse body
  ctx.fillStyle = "#5a4632";
  ctx.beginPath();
  ctx.ellipse(x, y, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // legs
  ctx.strokeStyle = "#3a2c1c";
  ctx.lineWidth = 1.4;
  for (const lx of [-5, -2, 2, 5]) {
    ctx.beginPath();
    ctx.moveTo(x + lx, y + 3);
    ctx.lineTo(x + lx + gallop * (lx > 0 ? 1 : -1) * 0.4, y + 8);
    ctx.stroke();
  }
  // neck + head
  ctx.fillStyle = "#5a4632";
  ctx.beginPath();
  ctx.moveTo(x + dir * 6, y - 2);
  ctx.lineTo(x + dir * 11, y - 6);
  ctx.lineTo(x + dir * 12, y - 3);
  ctx.lineTo(x + dir * 7, y + 1);
  ctx.closePath();
  ctx.fill();
  // rider
  ctx.fillStyle = coat;
  ctx.fillRect(x - 2, y - 7, 4, 6);
  ctx.fillStyle = COL.steel;
  ctx.beginPath();
  ctx.arc(x, y - 8, 2, 0, Math.PI * 2);
  ctx.fill();
  // lance
  ctx.strokeStyle = "#7a5a34";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y - 5);
  ctx.lineTo(x + dir * 14, y - 8);
  ctx.stroke();
}

function launch(arrows: Arrow[], x0: number, y0: number, x1: number, y1: number) {
  arrows.push({ x: x0, y: y0, x0, y0, x1, y1, t: 0 });
}
function updateArrows(ctx: CanvasRenderingContext2D, arrows: Arrow[], puffs: Puff[], dt: number) {
  ctx.strokeStyle = "#2a2013";
  ctx.lineWidth = 1.2;
  for (let i = arrows.length - 1; i >= 0; i--) {
    const a = arrows[i];
    a.t += dt * 1.6;
    if (a.t >= 1) {
      puffs.push({ x: a.x1, y: a.y1, t: 0, enemy: a.x1 < a.x0 });
      arrows.splice(i, 1);
      continue;
    }
    const x = a.x0 + (a.x1 - a.x0) * a.t;
    const arc = -Math.sin(a.t * Math.PI) * 26;
    const y = a.y0 + (a.y1 - a.y0) * a.t + arc;
    const px = a.x0 + (a.x1 - a.x0) * Math.max(0, a.t - 0.05);
    const py = a.y0 + (a.y1 - a.y0) * Math.max(0, a.t - 0.05) + -Math.sin(Math.max(0, a.t - 0.05) * Math.PI) * 26;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(x, y);
    ctx.stroke();
    a.x = x;
    a.y = y;
  }
}
function spawnPuffs(puffs: Puff[], x: number, top: number, bot: number, enemy: boolean, n: number) {
  const k = Math.min(6, Math.max(1, Math.round(n / 20)));
  for (let i = 0; i < k; i++) puffs.push({ x: x + (Math.sin(i) * 14), y: top + (bot - top) * ((i * 37 % 100) / 100), t: 0, enemy });
}
function updatePuffs(ctx: CanvasRenderingContext2D, puffs: Puff[], dt: number) {
  for (let i = puffs.length - 1; i >= 0; i--) {
    const p = puffs[i];
    p.t += dt * 1.5;
    if (p.t >= 1) { puffs.splice(i, 1); continue; }
    const r = 2 + p.t * 8;
    ctx.fillStyle = `rgba(${p.enemy ? "150,60,50" : "90,80,70"},${(1 - p.t) * 0.5})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y - p.t * 6, r, 0, Math.PI * 2);
    ctx.fill();
  }
}
function drawClash(ctx: CanvasRenderingContext2D, x: number, top: number, bot: number, t: number) {
  for (let i = 0; i < 5; i++) {
    const y = top + (bot - top) * ((Math.sin(t * 7 + i * 2) * 0.5 + 0.5));
    const a = Math.max(0, Math.sin(t * 12 + i));
    ctx.fillStyle = `rgba(255,220,150,${a * 0.5})`;
    ctx.beginPath();
    ctx.arc(x + (Math.sin(t * 9 + i) * 4), y, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
}
function drawFrame(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, w - 3, h - 3);
}
