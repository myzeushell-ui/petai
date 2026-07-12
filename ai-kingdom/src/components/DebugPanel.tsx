import { useState } from "react";
import { useGame } from "../state/GameContext";

export default function DebugPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const g = useGame();
  const s = g.state!;
  const [showMem, setShowMem] = useState(false);
  if (!open) return null;

  const target = s.selectedOfficerId ?? s.officers[0]?.id ?? "edward";

  return (
    <div className="debug-panel">
      <h4 style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Отладка</span>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
      </h4>

      <div className="debug-row">
        <button className="btn btn-sm" onClick={() => g.debug.addTime(-30)}>−30 мин до зари</button>
        <button className="btn btn-sm" onClick={g.debug.revealEnemy}>Раскрыть врага</button>
      </div>
      <div className="debug-row">
        <button className="btn btn-sm" onClick={() => g.debug.setMorale(s.resources.kingdomMorale + 15)}>Мораль +15</button>
        <button className="btn btn-sm" onClick={() => g.debug.setMorale(s.resources.kingdomMorale - 15)}>Мораль −15</button>
      </div>
      <div className="debug-row">
        <button className="btn btn-sm" onClick={() => g.debug.addTroops(target, 100)}>+100 войск ({target.slice(0, 3)})</button>
        <button className="btn btn-sm btn-danger" onClick={g.debug.forceVictory}>Разбить врага</button>
      </div>
      <div className="debug-row">
        <button className="btn btn-sm" onClick={() => g.setSpeed(4)}>Скорость ×4</button>
        <button className="btn btn-sm" onClick={g.newGame}>Рестарт</button>
      </div>

      <div className="debug-row" style={{ fontSize: 11, color: "var(--tx-2)", flexDirection: "column", gap: 2 }}>
        <span>фаза {s.scenarioPhase} · tick {Math.round(s.tick)} · враг intel {Math.round(s.enemy.intelLevel * 100)}%</span>
        <span>
          враг ≈ {s.enemy.estimatedStrength ?? "?"} / {s.enemy.trueStrength} · бои {s.battles.filter((b) => b.status === "active").length}
        </span>
        <span>потери {Number(s.flags.playerCasualtiesTotal ?? 0)} · деревня dmg {Math.round(s.village.damage)} · эвак {Math.round(s.village.evacuationProgress * 100)}%</span>
      </div>

      {s.enemyPlan && (
        <div className="debug-plan">
          <div style={{ color: "var(--gold-bright)", fontWeight: 700, marginBottom: 3 }}>
            План врага: {s.enemyPlan.id}
          </div>
          <div style={{ color: "var(--tx-2)", marginBottom: 4 }}>{s.enemyPlan.reason}</div>
          <div style={{ color: "var(--tx-2)", marginBottom: 4 }}>
            знает позиции: {s.enemyPlan.knowledge.knownPlayerLocations.join(", ") || "—"} · увер.{" "}
            {Math.round(s.enemyPlan.knowledge.confidence * 100)}% · баррикада{" "}
            {s.enemyPlan.knowledge.barricadeSeen ? "да" : "нет"} · конница{" "}
            {s.enemyPlan.knowledge.cavalrySeen ? "да" : "нет"}
          </div>
          {s.enemyPlan.scores.map((sc) => (
            <div key={sc.id} style={{ display: "flex", justifyContent: "space-between", color: sc.id === s.enemyPlan!.id ? "var(--gold)" : "var(--tx-2)" }}>
              <span>{sc.id}</span>
              <span>{sc.score.toFixed(2)} (p{Math.round(sc.probabilityOfSuccess * 100)}/loss{Math.round(sc.expectedLosses * 100)})</span>
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-ghost btn-sm" onClick={() => setShowMem((v) => !v)} style={{ width: "100%" }}>
        {showMem ? "Скрыть память" : "Память офицеров"}
      </button>
      {showMem && (
        <div style={{ fontSize: 10.5, color: "var(--tx-2)", marginTop: 4, maxHeight: 130, overflowY: "auto" }}>
          {s.officers.map((o) => (
            <div key={o.id} style={{ marginBottom: 4 }}>
              <strong style={{ color: "var(--tx-1)" }}>{o.name.split(" ").slice(-1)[0]}</strong>: {o.memory.length
                ? o.memory.map((m) => m.type.replace(/PLAYER_|_/g, " ").trim().toLowerCase()).join(", ")
                : "—"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
