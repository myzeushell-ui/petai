import { useGame } from "../state/GameContext";
import { Crest } from "./Crest";
import { getScenario } from "../game/scenario";
import { formatMinutes } from "../game/util";

export default function Briefing() {
  const g = useGame();
  const s = g.state!;
  const scenario = getScenario(s.scenarioId);

  const player = s.units.filter((u) => u.side === "player");
  const totals = {
    spearmen: player.filter((u) => u.type === "spearmen").reduce((a, u) => a + u.count, 0),
    archers: player.filter((u) => u.type === "archers").reduce((a, u) => a + u.count, 0),
    cavalry: player.filter((u) => u.type === "cavalry").reduce((a, u) => a + u.count, 0),
  };

  return (
    <div className="overlay">
      <div className="modal" style={{ width: "min(600px, 96vw)" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
          <Crest seed={42} accent="#4a8fb0" size={48} />
          <div>
            <h2 style={{ marginBottom: 2 }}>{scenario.name}</h2>
            <div className="role" style={{ color: "var(--tx-2)", fontSize: 12 }}>Доклад советницы Мары Вельт</div>
          </div>
        </div>

        <div className="msg narrator" style={{ maxWidth: "100%", marginBottom: 14 }}>
          «{scenario.intro}»
        </div>

        <ul className="report-highlights">
          <li>⚔ Враг приближается по восточной дороге. Точная численность неизвестна — нужна разведка.</li>
          <li>🌉 Каменный мост — узкая переправа. Тот, кто держит мост, держит врага.</li>
          <li>🌾 В деревне {s.locations.find((l) => l.type === "village")?.foodStore ?? 0} припасов. Её можно защитить или эвакуировать.</li>
          <li>🏰 До рассвета — {formatMinutes(s.timeUntilDawn)}. Удержите замок до утра.</li>
          <li>
            🛡 Ваши силы: {totals.spearmen} копейщиков, {totals.archers} лучников, {totals.cavalry} всадников,{" "}
            {Math.round(s.resources.food)} припасов.
          </li>
        </ul>

        <p className="muted" style={{ fontSize: 12, lineHeight: 1.6 }}>
          Игра начнётся на паузе — распределите войска через офицеров, затем снимите паузу
          (<span className="kbd">пробел</span>).
        </p>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={g.beginPlay}>
            Принять командование
          </button>
        </div>
      </div>
    </div>
  );
}
