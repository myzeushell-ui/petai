/**
 * Tactical battle scene — living, positional battlefield (V2).
 *
 * A faithful visualisation of the running battle simulation: each participating
 * unit group becomes a SQUAD of many soldiers in a real formation (shield wall,
 * line, loose, wedge). Squads deploy from their side, advance to the line,
 * trade volleys, charge and clash; casualties fall to match the sim's counts,
 * and a broken side routs. The authoritative outcome still comes from the game
 * engine's Battle resolution — this view renders that state, it never decides it.
 *
 * Pure Canvas, no external assets. Camera supports pan (drag) and zoom.
 */

import { useEffect, useMemo, useRef } from "react";
import { useGame } from "../state/GameContext";
import { UNIT_LABELS } from "../game/constants";
import type { GameState, LocationType, Side, UnitType } from "../game/types";

/* ------------------------------------------------------------------ */
/* Battlefield world model                                             */
/* ------------------------------------------------------------------ */

const WORLD_W = 1000;
const WORLD_H = 600;

type Formation = "shield_wall" | "line" | "loose" | "wedge";

interface Squad {
  id: string;
  side: Side;
  type: UnitType;
  count: number;
  morale: number;
  commanderId: string | null;
  accent: string;
  role: "defender" | "attacker";
  formation: Formation;
}

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
  squads: Squad[];
}

function formationFor(type: UnitType, role: "defender" | "attacker"): Formation {
  if (type === "cavalry") return "wedge";
  if (type === "archers") return "loose";
  if (type === "spearmen") return role === "defender" ? "shield_wall" : "line";
  return "line";
}

function sideTotals(squads: Squad[], side: Side): SideSnap {
  const out: SideSnap = { spearmen: 0, archers: 0, cavalry: 0, morale: 0, total: 0 };
  let mSum = 0, n = 0;
  for (const q of squads) {
    if (q.side !== side) continue;
    out[q.type] += q.count;
    out.total += q.count;
    mSum += q.morale;
    n++;
  }
  out.morale = n ? Math.round(mSum / n) : 0;
  return out;
}

function computeSquads(s: GameState, playerIds: string[], enemyIds: string[], defender: Side): Squad[] {
  const out: Squad[] = [];
  const push = (ids: string[], side: Side) => {
    for (const id of ids) {
      const u = s.units.find((g) => g.id === id);
      if (!u || u.count <= 0) continue;
      const officer = u.commanderId ? s.officers.find((o) => o.id === u.commanderId) : null;
      const role: "defender" | "attacker" = side === defender ? "defender" : "attacker";
      out.push({
        id: u.id,
        side,
        type: u.type,
        count: u.count,
        morale: u.morale,
        commanderId: u.commanderId,
        accent: side === "player" ? officer?.accentColor ?? "#6e9a54" : "#b0392c",
        role,
        formation: formationFor(u.type, role),
      });
    }
  };
  push(playerIds, "player");
  push(enemyIds, "enemy");
  return out;
}

/* ------------------------------------------------------------------ */
/* Per-squad animation state                                           */
/* ------------------------------------------------------------------ */

interface Soldier { ox: number; oy: number; ph: number; }
interface Fallen { x: number; y: number; t: number; }
interface Anim {
  x: number; y: number; tx: number; ty: number;
  soldiers: Soldier[];
  fallen: Fallen[];
  phase: "deploy" | "advance" | "engaged" | "rout";
  charge: number;
  lastCount: number;
  volley: number;
}
interface Arrow { x0: number; y0: number; x1: number; y1: number; t: number; enemy: boolean; }
interface Spark { x: number; y: number; t: number; }

/* deterministic tiny prng for formation scatter */
let seedN = 22222;
function rnd() { seedN = (seedN * 1103515245 + 12345) & 0x7fffffff; return seedN / 0x7fffffff; }

function spriteCount(count: number): number {
  return count <= 0 ? 0 : Math.max(1, Math.min(34, Math.round(count / 12)));
}

function formationOffsets(f: Formation, n: number): Soldier[] {
  const out: Soldier[] = [];
  if (n <= 0) return out;
  if (f === "loose") {
    const cols = Math.ceil(Math.sqrt(n * 1.6));
    for (let i = 0; i < n; i++) {
      const c = i % cols, r = Math.floor(i / cols);
      out.push({ ox: (c - cols / 2) * 15 + (rnd() - 0.5) * 8, oy: (r - 1) * 15 + (rnd() - 0.5) * 8, ph: rnd() * 6 });
    }
    return out;
  }
  if (f === "wedge") {
    let placed = 0, row = 0;
    while (placed < n) {
      const inRow = row + 1;
      for (let c = 0; c < inRow && placed < n; c++, placed++) {
        out.push({ ox: -row * 12, oy: (c - row / 2) * 15, ph: rnd() * 6 });
      }
      row++;
    }
    return out;
  }
  const rows = f === "shield_wall" ? 3 : 2;
  const per = Math.ceil(n / rows);
  const dx = f === "shield_wall" ? 11 : 12;
  for (let i = 0; i < n; i++) {
    const r = i % rows, c = Math.floor(i / rows);
    out.push({ ox: -r * dx, oy: (c - per / 2) * 10 + r * 3, ph: rnd() * 6 });
  }
  return out;
}

/** World-space target formation centre for a squad, given the front line. */
function squadTarget(sq: Squad, frontX: number): { x: number; y: number } {
  const dir = sq.side === "player" ? -1 : 1; // offset from front toward own side
  const band = WORLD_H / 2;
  if (sq.type === "archers") return { x: frontX + dir * 150, y: band + dir * 10 };
  if (sq.type === "cavalry") return { x: frontX + dir * 120, y: sq.side === "player" ? band - 190 : band + 190 };
  return { x: frontX + dir * 26, y: band }; // spearmen at the line
}
function squadDeploy(sq: Squad): { x: number; y: number } {
  const edge = sq.side === "player" ? 90 : WORLD_W - 90;
  const t = squadTarget(sq, WORLD_W / 2);
  return { x: edge, y: t.y };
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function BattleScene() {
  const g = useGame();
  const s = g.state!;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const snapRef = useRef<Snap | null>(null);
  const camRef = useRef({ scale: 0, x: 0, y: 0, fitted: false });
  const dragRef = useRef<{ on: boolean; px: number; py: number }>({ on: false, px: 0, py: 0 });
  const animRef = useRef<Map<string, Anim>>(new Map());

  const battle = s.battles.find((b) => b.id === s.viewBattleId) ?? null;

  const snap = useMemo<Snap | null>(() => {
    if (!battle) return null;
    const loc = s.locations.find((l) => l.id === battle.locationId);
    const squads = computeSquads(s, battle.playerGroupIds, battle.enemyGroupIds, battle.defenderSide);
    return {
      locType: loc?.type ?? "field",
      locName: loc?.name ?? "Поле боя",
      defender: battle.defenderSide,
      status: battle.status,
      momentum: battle.momentum,
      player: sideTotals(squads, "player"),
      enemy: sideTotals(squads, "enemy"),
      playerCasualties: battle.playerCasualties,
      enemyCasualties: battle.enemyCasualties,
      squads,
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
    const arrows: Arrow[] = [];
    const sparks: Spark[] = [];

    /* ---- camera interaction ---- */
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const cam = camRef.current;
      const f = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      cam.scale = Math.max(0.45, Math.min(2.6, cam.scale * f));
    };
    const onDown = (e: PointerEvent) => { dragRef.current = { on: true, px: e.clientX, py: e.clientY }; };
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current.on) return;
      const cam = camRef.current;
      cam.x += e.clientX - dragRef.current.px;
      cam.y += e.clientY - dragRef.current.py;
      dragRef.current.px = e.clientX;
      dragRef.current.py = e.clientY;
    };
    const onUp = () => { dragRef.current.on = false; };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

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
        camRef.current.fitted = false;
      }

      const snp = snapRef.current;
      const cam = camRef.current;
      if (!cam.fitted) {
        // Frame the combat zone rather than the whole empty field, for drama.
        cam.scale = Math.min(w / 680, h / 470);
        const focusX = 540, focusY = WORLD_H / 2;
        cam.x = w / 2 - focusX * cam.scale;
        cam.y = h / 2 - focusY * cam.scale;
        cam.fitted = true;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#10131a";
      ctx.fillRect(0, 0, w, h);
      if (!snp) { raf = requestAnimationFrame(loop); return; }

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.translate(cam.x, cam.y);
      ctx.scale(cam.scale, cam.scale);

      const active = snp.status === "active";
      const frontX = WORLD_W / 2 + (snp.momentum / 100) * 150;

      drawTerrain(ctx, snp.locType, t);

      // Reconcile squad animation entries with the live squad list.
      const anim = animRef.current;
      const liveIds = new Set(snp.squads.map((q) => q.id));
      for (const id of [...anim.keys()]) if (!liveIds.has(id)) anim.delete(id);

      const playerBroken = snp.status === "enemy_won";
      const enemyBroken = snp.status === "player_won";

      for (const sq of snp.squads) {
        let a = anim.get(sq.id);
        if (!a) {
          const dep = squadDeploy(sq);
          a = { x: dep.x, y: dep.y, tx: dep.x, ty: dep.y, soldiers: formationOffsets(sq.formation, spriteCount(sq.count)), fallen: [], phase: "deploy", charge: 0, lastCount: sq.count, volley: 1 + rnd() };
          anim.set(sq.id, a);
        }

        // Target position.
        const tgt = squadTarget(sq, frontX);
        const routing = (sq.side === "player" && playerBroken) || (sq.side === "enemy" && enemyBroken) || sq.morale < 12;
        if (routing) {
          a.phase = "rout";
          a.tx = sq.side === "player" ? -120 : WORLD_W + 120;
          a.ty = tgt.y + (sq.side === "player" ? -60 : 60);
        } else {
          if (a.phase === "deploy" && Math.abs(a.x - a.tx) < 4) a.phase = "advance";
          a.tx = tgt.x;
          a.ty = tgt.y;
          if (a.phase !== "rout") {
            const nearLine = Math.abs(a.x - frontX) < 70;
            a.phase = nearLine && active ? "engaged" : "advance";
          }
        }

        // Cavalry charge oscillation once engaged.
        if (sq.type === "cavalry" && active && a.phase !== "rout") {
          a.charge = Math.sin(t * 0.8 + sq.id.length) * 0.5 + 0.5;
          const dir = sq.side === "player" ? 1 : -1;
          a.tx = tgt.x + dir * a.charge * 150;
          a.ty = tgt.y + (WORLD_H / 2 - tgt.y) * a.charge;
        }

        // Ease toward target.
        const spd = a.phase === "rout" ? 2.4 : sq.type === "cavalry" ? 2.2 : 1.6;
        a.x += (a.tx - a.x) * Math.min(1, dt * spd);
        a.y += (a.ty - a.y) * Math.min(1, dt * spd);

        // Casualty sync: shrink sprite count toward the sim count.
        const target = spriteCount(sq.count);
        while (a.soldiers.length > target) {
          const dead = a.soldiers.pop()!;
          a.fallen.push({ x: a.x + dead.ox, y: a.y + dead.oy, t: 0 });
          if (a.fallen.length > 40) a.fallen.shift();
          spawnSpark(sparks, a.x + dead.ox, a.y + dead.oy);
        }
        while (a.soldiers.length < target && sq.count > 0) {
          a.soldiers.push({ ox: -(a.soldiers.length % 3) * 11, oy: (a.soldiers.length - target / 2) * 10, ph: rnd() * 6 });
        }
        a.lastCount = sq.count;

        // Archer volleys.
        if (sq.type === "archers" && active && a.phase !== "rout") {
          a.volley -= dt;
          if (a.volley <= 0) {
            a.volley = 2.2 + rnd() * 1.5;
            const dir = sq.side === "player" ? 1 : -1;
            arrows.push({ x0: a.x, y0: a.y, x1: frontX + dir * 40, y1: WORLD_H / 2 + (rnd() - 0.5) * 120, t: 0, enemy: sq.side === "enemy" });
          }
        }
      }

      // Fallen bodies (under living soldiers).
      for (const a of anim.values()) drawFallen(ctx, a.fallen, dt);

      // Living squads.
      for (const sq of snp.squads) {
        const a = anim.get(sq.id)!;
        drawSquad(ctx, sq, a, t, active);
      }

      updateArrows(ctx, arrows, sparks, dt);
      drawSparks(ctx, sparks, dt);

      ctx.restore();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  if (!battle || !snap) return null;
  const won = snap.status === "player_won";
  const lost = snap.status === "enemy_won";
  const over = won || lost;
  const zoom = (f: number) => { camRef.current.scale = Math.max(0.45, Math.min(2.6, camRef.current.scale * f)); };
  const resetCam = () => { camRef.current.fitted = false; };

  return (
    <div className="overlay battle-overlay">
      <div className="battle-scene">
        <div className="bs-top">
          <div className="bs-title">⚔ Сражение: {snap.locName}</div>
          <div className="bs-cam">
            <button className="btn btn-ghost btn-sm" onClick={() => zoom(1.2)} title="Приблизить">＋</button>
            <button className="btn btn-ghost btn-sm" onClick={() => zoom(1 / 1.2)} title="Отдалить">－</button>
            <button className="btn btn-ghost btn-sm" onClick={resetCam} title="Показать всё поле">⤾</button>
            <button className="btn btn-gold btn-sm" onClick={() => g.viewBattle(null)}>К командованию ✕</button>
          </div>
        </div>

        <div ref={wrapRef} className="bs-field">
          <canvas ref={canvasRef} className="bs-canvas" />
          {over && <div className={`bs-result ${won ? "win" : "lose"}`}>{won ? "Враг отброшен!" : "Позиция потеряна"}</div>}
          <div className="bs-hint">тяни — двигать камеру · колесо — зум</div>
        </div>

        <div className="bs-hud">
          <SidePanel title="Наши войска" snap={snap.player} casualties={snap.playerCasualties} side="player" />
          <div className="bs-momentum">
            <div className="bs-mom-label">Перевес</div>
            <div className="bs-mom-bar">
              <span style={{ left: `${50 + Math.max(-48, Math.min(48, snap.momentum / 2))}%` }} />
            </div>
            <div className="bs-mom-sub">{active(snap) ? "Идёт бой…" : won ? "Победа" : lost ? "Поражение" : "Затишье"}</div>
          </div>
          <SidePanel title="Враг" snap={snap.enemy} casualties={snap.enemyCasualties} side="enemy" />
        </div>
        <div className="bs-note">Живое поле отражает ход симуляции — исход решает сражение, вы наблюдаете и командуете.</div>
      </div>
    </div>
  );
}

function active(snap: Snap) { return snap.status === "active"; }

function SidePanel({ title, snap, casualties, side }: { title: string; snap: SideSnap; casualties: number; side: Side }) {
  const row = (label: string, n: number) => (n > 0 ? (<div className="bs-row"><span>{label}</span><span className="bs-n">{n}</span></div>) : null);
  return (
    <div className={`bs-side ${side}`}>
      <div className="bs-side-title">{title}</div>
      {row(UNIT_LABELS.spearmen, snap.spearmen)}
      {row(UNIT_LABELS.archers, snap.archers)}
      {row(UNIT_LABELS.cavalry, snap.cavalry)}
      <div className="bs-row bs-mor"><span>Мораль</span><span className="bs-n">{snap.morale}</span></div>
      <div className="bs-row bs-cas"><span>Потери</span><span className="bs-n">≈{casualties}</span></div>
    </div>
  );
}

/* ================= drawing (world coordinates) ================= */

const COL = {
  steel: "#c2c6cc", steelDark: "#8b9098", skin: "#caa079", shadow: "rgba(0,0,0,0.3)",
  enemyCoat: "#8f2f24", spear: "#7a5a34",
};

function drawTerrain(ctx: CanvasRenderingContext2D, type: LocationType, t: number) {
  const g = ctx.createLinearGradient(0, 0, 0, WORLD_H);
  g.addColorStop(0, "#5c6e3e");
  g.addColorStop(1, "#465730");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  // subtle tile shade
  for (let y = 0; y < WORLD_H; y += 40) for (let x = 0; x < WORLD_W; x += 40) {
    ctx.fillStyle = (x / 40 + y / 40) % 2 ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.025)";
    ctx.fillRect(x, y, 40, 40);
  }
  // grass tufts
  ctx.strokeStyle = "rgba(120,150,80,0.3)";
  for (let i = 0; i < 200; i++) { const x = (i * 71) % WORLD_W, y = (i * 149) % WORLD_H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 3); ctx.stroke(); }

  if (type === "bridge") {
    const rx = WORLD_W / 2, rw = 90;
    const rg = ctx.createLinearGradient(rx - rw, 0, rx + rw, 0);
    rg.addColorStop(0, "#3f5b6b"); rg.addColorStop(0.5, "#6f93a4"); rg.addColorStop(1, "#3f5b6b");
    ctx.fillStyle = rg; ctx.fillRect(rx - rw, 0, rw * 2, WORLD_H);
    ctx.strokeStyle = "rgba(220,235,240,0.25)";
    for (let i = 0; i < 7; i++) { const yy = (t * 26 + i * WORLD_H / 7) % WORLD_H; ctx.beginPath(); ctx.moveTo(rx - rw, yy); ctx.lineTo(rx + rw, yy + 8); ctx.stroke(); }
    const by = WORLD_H * 0.36, bh = WORLD_H * 0.28;
    ctx.fillStyle = "#8b7f6a"; ctx.fillRect(rx - rw - 10, by, rw * 2 + 20, bh);
    ctx.fillStyle = "#6f6252"; for (let x = rx - rw - 10; x < rx + rw + 10; x += 16) ctx.fillRect(x, by, 3, bh);
    ctx.strokeStyle = "#5a4f42"; ctx.strokeRect(rx - rw - 10, by, rw * 2 + 20, bh);
  } else if (type === "castle") {
    ctx.fillStyle = "#7b756c"; ctx.fillRect(0, 0, 70, WORLD_H);
    ctx.fillStyle = "#5f5a52"; for (let y = 0; y < WORLD_H; y += 34) ctx.fillRect(0, y, 70, 4);
    for (let y = 0; y < WORLD_H; y += 28) ctx.fillRect(70, y, 9, 14);
  } else if (type === "hills") {
    ctx.fillStyle = "rgba(120,100,60,0.2)";
    ctx.beginPath(); ctx.moveTo(0, WORLD_H); ctx.quadraticCurveTo(WORLD_W * 0.25, WORLD_H * 0.35, WORLD_W * 0.5, WORLD_H * 0.6); ctx.lineTo(0, WORLD_H * 0.6); ctx.closePath(); ctx.fill();
  } else if (type === "forest") {
    for (let i = 0; i < 40; i++) { const x = (i * 131) % WORLD_W, y = (i * 83) % WORLD_H; ctx.fillStyle = "#2f4a26"; ctx.beginPath(); ctx.moveTo(x, y - 12); ctx.lineTo(x + 8, y + 6); ctx.lineTo(x - 8, y + 6); ctx.closePath(); ctx.fill(); }
  }
}

function drawSquad(ctx: CanvasRenderingContext2D, sq: Squad, a: Anim, t: number, active: boolean) {
  const facing = sq.side === "player" ? 1 : -1;
  const engaged = a.phase === "engaged" && active;
  const alpha = a.phase === "rout" ? Math.max(0.25, 1 - (sq.side === "player" ? Math.max(0, -a.x) : Math.max(0, a.x - WORLD_W)) / 200) : 1;
  ctx.globalAlpha = alpha;

  // banner + officer near the rear-centre of the squad
  const bx = a.x - facing * 26, by = a.y;
  drawBanner(ctx, bx, by, sq.accent, sq.side, t);
  if (sq.commanderId) drawOfficer(ctx, bx - facing * 10, by + 14, sq.accent, facing);

  // soldiers
  for (const sol of a.soldiers) {
    const sx = a.x + sol.ox * facing;
    const sy = a.y + sol.oy;
    const bob = Math.sin(t * 5 + sol.ph) * (engaged ? 1.6 : a.phase === "advance" || a.phase === "rout" ? 1.2 : 0.6);
    if (sq.type === "cavalry") drawHorse(ctx, sx, sy + bob, sq.accent, facing, t + sol.ph);
    else if (sq.type === "archers") drawArcher(ctx, sx, sy + bob, sq.accent, facing, t + sol.ph);
    else drawInfantry(ctx, sx, sy + bob, sq.accent, facing, sq.formation === "shield_wall", engaged, t + sol.ph);
  }
  ctx.globalAlpha = 1;

  // count label
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(a.x - 16, a.y - 42, 32, 13);
  ctx.fillStyle = sq.side === "player" ? "#cfe6bf" : "#f0cfc7";
  ctx.font = "10px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(String(sq.count), a.x, a.y - 32);
}

function drawBanner(ctx: CanvasRenderingContext2D, x: number, y: number, accent: string, side: Side, t: number) {
  ctx.strokeStyle = "#3a2c1c"; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.lineTo(x, y - 26); ctx.stroke();
  const sway = Math.sin(t * 2 + x) * 3;
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(x, y - 26);
  ctx.lineTo(x + 16, y - 24 + sway);
  ctx.lineTo(x + 13, y - 18 + sway);
  ctx.lineTo(x + 16, y - 12 + sway);
  ctx.lineTo(x, y - 12);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = side === "player" ? "rgba(255,240,200,0.5)" : "rgba(0,0,0,0.3)";
  ctx.fillRect(x + 3, y - 22 + sway * 0.6, 3, 3);
}

function drawOfficer(ctx: CanvasRenderingContext2D, x: number, y: number, accent: string, facing: number) {
  ctx.fillStyle = COL.shadow; ctx.beginPath(); ctx.ellipse(x, y + 9, 6, 2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = accent; ctx.fillRect(x - 3, y - 5, 6, 9);
  ctx.fillStyle = COL.skin; ctx.beginPath(); ctx.arc(x, y - 8, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#d4b24a"; ctx.beginPath(); ctx.arc(x, y - 10, 3.2, Math.PI, Math.PI * 2); ctx.fill(); // gold helm crest
  ctx.strokeStyle = COL.steel; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x + facing * 2, y - 2); ctx.lineTo(x + facing * 9, y - 12); ctx.stroke();
}

function drawInfantry(ctx: CanvasRenderingContext2D, x: number, y: number, coat: string, facing: number, shield: boolean, engaged: boolean, t: number) {
  ctx.fillStyle = COL.shadow; ctx.beginPath(); ctx.ellipse(x, y + 9, 5, 2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#3a2c1c"; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(x - 2, y + 3); ctx.lineTo(x - 2, y + 8); ctx.moveTo(x + 2, y + 3); ctx.lineTo(x + 2, y + 8); ctx.stroke();
  ctx.fillStyle = coat; ctx.fillRect(x - 3, y - 3, 6, 8);
  ctx.fillStyle = COL.skin; ctx.beginPath(); ctx.arc(x, y - 5, 2.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = COL.steel; ctx.beginPath(); ctx.arc(x, y - 6, 2.7, Math.PI, Math.PI * 2); ctx.fill();
  const jab = engaged ? Math.max(0, Math.sin(t * 6)) * 4 : 0;
  ctx.strokeStyle = COL.spear; ctx.lineWidth = 1; ctx.beginPath();
  ctx.moveTo(x + facing * 2, y + 2); ctx.lineTo(x + facing * (7 + jab), y - 10); ctx.stroke();
  ctx.fillStyle = COL.steel; ctx.beginPath(); ctx.arc(x + facing * (7 + jab), y - 10, 1.2, 0, Math.PI * 2); ctx.fill();
  if (shield) { ctx.fillStyle = COL.steelDark; ctx.fillRect(x + facing * 3, y - 3, 2, 7); }
}

function drawArcher(ctx: CanvasRenderingContext2D, x: number, y: number, coat: string, facing: number, t: number) {
  ctx.fillStyle = COL.shadow; ctx.beginPath(); ctx.ellipse(x, y + 8, 4, 1.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = coat; ctx.fillRect(x - 2.4, y - 3, 5, 8);
  ctx.fillStyle = COL.skin; ctx.beginPath(); ctx.arc(x, y - 5, 2.2, 0, Math.PI * 2); ctx.fill();
  const draw = Math.max(0, Math.sin(t * 2)) * 1.6;
  ctx.strokeStyle = "#5a3d1e"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(x + facing * 4, y - 1, 4.5, -Math.PI / 2.1, Math.PI / 2.1, facing < 0); ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.beginPath(); ctx.moveTo(x + facing * (4 - draw), y - 4.5); ctx.lineTo(x + facing * (4 - draw), y + 2.5); ctx.stroke();
}

function drawHorse(ctx: CanvasRenderingContext2D, x: number, y: number, coat: string, facing: number, t: number) {
  const gallop = Math.sin(t * 11) * 2;
  ctx.fillStyle = COL.shadow; ctx.beginPath(); ctx.ellipse(x, y + 7, 10, 2.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#5a4632"; ctx.beginPath(); ctx.ellipse(x, y, 9, 4.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#3a2c1c"; ctx.lineWidth = 1.5;
  for (const lx of [-6, -2, 2, 6]) { ctx.beginPath(); ctx.moveTo(x + lx, y + 3); ctx.lineTo(x + lx + gallop * (lx > 0 ? 1 : -1) * 0.4, y + 9); ctx.stroke(); }
  ctx.fillStyle = "#5a4632"; ctx.beginPath();
  ctx.moveTo(x + facing * 7, y - 2); ctx.lineTo(x + facing * 13, y - 7); ctx.lineTo(x + facing * 14, y - 3); ctx.lineTo(x + facing * 8, y + 1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = coat; ctx.fillRect(x - 2, y - 8, 4, 7);
  ctx.fillStyle = COL.steel; ctx.beginPath(); ctx.arc(x, y - 9, 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = COL.spear; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y - 6); ctx.lineTo(x + facing * 17, y - 9); ctx.stroke();
}

function drawFallen(ctx: CanvasRenderingContext2D, fallen: Fallen[], dt: number) {
  for (let i = fallen.length - 1; i >= 0; i--) {
    const f = fallen[i];
    f.t += dt * 0.15;
    if (f.t >= 1) { fallen.splice(i, 1); continue; }
    ctx.globalAlpha = Math.min(1, 1.4 - f.t);
    ctx.fillStyle = "rgba(40,30,20,0.7)";
    ctx.beginPath(); ctx.ellipse(f.x, f.y + 6, 5, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function updateArrows(ctx: CanvasRenderingContext2D, arrows: Arrow[], sparks: Spark[], dt: number) {
  ctx.strokeStyle = "#2a2013"; ctx.lineWidth = 1.4;
  for (let i = arrows.length - 1; i >= 0; i--) {
    const a = arrows[i];
    a.t += dt * 1.3;
    if (a.t >= 1) { spawnSpark(sparks, a.x1, a.y1); arrows.splice(i, 1); continue; }
    const x = a.x0 + (a.x1 - a.x0) * a.t;
    const arc = -Math.sin(a.t * Math.PI) * 60;
    const y = a.y0 + (a.y1 - a.y0) * a.t + arc;
    const pt = Math.max(0, a.t - 0.06);
    const px = a.x0 + (a.x1 - a.x0) * pt;
    const py = a.y0 + (a.y1 - a.y0) * pt + -Math.sin(pt * Math.PI) * 60;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
  }
}
function spawnSpark(sparks: Spark[], x: number, y: number) { if (sparks.length < 120) sparks.push({ x, y, t: 0 }); }
function drawSparks(ctx: CanvasRenderingContext2D, sparks: Spark[], dt: number) {
  for (let i = sparks.length - 1; i >= 0; i--) {
    const p = sparks[i]; p.t += dt * 2.2;
    if (p.t >= 1) { sparks.splice(i, 1); continue; }
    ctx.fillStyle = `rgba(255,220,150,${(1 - p.t) * 0.6})`;
    ctx.beginPath(); ctx.arc(p.x, p.y - p.t * 6, 1.6 + p.t * 3, 0, Math.PI * 2); ctx.fill();
  }
}
