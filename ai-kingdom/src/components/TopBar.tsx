import { useState } from "react";
import { useGame } from "../state/GameContext";
import { Crest } from "./Crest";
import { audio } from "../game/audio";
import { formatClock, formatMinutes } from "../game/util";
import type { GameSpeed } from "../game/types";

const SPEEDS: GameSpeed[] = [1, 2, 4];

export default function TopBar({
  onOpenSettings,
  onOpenDebug,
}: {
  onOpenSettings: () => void;
  onOpenDebug: () => void;
}) {
  const g = useGame();
  const s = g.state!;
  const r = s.resources;
  const paused = s.speed === 0;
  const [muted, setMuted] = useState(!audio.isEnabled());
  const dawnClass = s.timeUntilDawn < 60 ? "warn" : "dawn";
  const canControl = s.phase === "playing";

  const meter = (value: number, color: string) => (
    <div className="meter">
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
    </div>
  );

  return (
    <div className="topbar">
      <div className="kingdom">
        <Crest seed={7} accent="#cba24a" size={34} />
        <div>
          <h1>{s.kingdomName}</h1>
          <div className="sub">Ночь перед осадой</div>
        </div>
      </div>

      <div className="stat-group">
        <div className="stat">
          <span className="k">До рассвета</span>
          <span className={`v ${dawnClass}`}>{formatMinutes(s.timeUntilDawn)}</span>
          <span className="k" style={{ marginTop: 1 }}>{formatClock(s.tick)}</span>
        </div>
        <div className="stat">
          <span className="k">Продовольствие</span>
          <span className={`v ${r.food < 40 ? "warn" : ""}`}>{Math.round(r.food)}</span>
          {meter(r.food, "var(--gold)")}
        </div>
        <div className="stat">
          <span className="k">Мораль</span>
          <span className={`v ${r.kingdomMorale < 40 ? "bad" : ""}`}>{Math.round(r.kingdomMorale)}</span>
          {meter(r.kingdomMorale, "var(--red-bright)")}
        </div>
        <div className="stat">
          <span className="k">Замок</span>
          <span className={`v ${r.castleIntegrity < 50 ? "bad" : ""}`}>{Math.round(r.castleIntegrity)}%</span>
          {meter(r.castleIntegrity, "var(--metal)")}
        </div>
        <div className="stat">
          <span className="k">Деревня</span>
          <span className={`v ${r.villageIntegrity < 50 ? "warn" : ""}`}>{Math.round(r.villageIntegrity)}%</span>
          {meter(r.villageIntegrity, "var(--green)")}
        </div>

        <div className="speed" role="group" aria-label="Скорость времени">
          <button
            className={paused ? "active" : ""}
            onClick={() => g.setSpeed(0)}
            disabled={!canControl}
            title="Пауза (пробел)"
          >
            ❚❚
          </button>
          {SPEEDS.map((sp) => (
            <button
              key={sp}
              className={!paused && s.speed === sp ? "active" : ""}
              onClick={() => g.setSpeed(sp)}
              disabled={!canControl}
              title={`Скорость ×${sp}`}
            >
              ×{sp}
            </button>
          ))}
        </div>

        <button
          className="btn btn-ghost btn-icon"
          onClick={() => {
            const next = !muted;
            setMuted(next);
            audio.setEnabled(!next);
          }}
          title={muted ? "Включить звук" : "Выключить звук"}
          aria-label="Звук"
        >
          {muted ? "🔇" : "🔊"}
        </button>
        <button className="btn btn-ghost btn-icon" onClick={onOpenSettings} title="Настройки" aria-label="Настройки">
          ⚙
        </button>
        <button className="btn btn-ghost btn-icon" onClick={onOpenDebug} title="Отладка (`)" aria-label="Отладка">
          ⚑
        </button>
      </div>
    </div>
  );
}
