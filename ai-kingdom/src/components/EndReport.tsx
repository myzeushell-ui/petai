import { useState } from "react";
import { useGame } from "../state/GameContext";
import { relationshipLabel } from "../game/officers";
import { INJURY_LABELS } from "../game/constants";
import CampaignScreen from "./CampaignScreen";

export default function EndReport() {
  const g = useGame();
  const s = g.state!;
  const o = s.outcome;
  const win = o.kind.includes("victory");
  const [showCampaign, setShowCampaign] = useState(false);

  if (showCampaign) return <CampaignScreen onBack={() => setShowCampaign(false)} />;

  return (
    <div className="overlay">
      <div className="modal" style={{ width: "min(640px, 96vw)", borderColor: win ? "var(--gold)" : "var(--red)" }}>
        <div className={`report-title ${win ? "win" : "lose"}`}>{o.title}</div>
        <div className="lead" style={{ textAlign: "center" }}>
          {o.summary}
        </div>

        <ul className="report-highlights">
          {o.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>

        <div className="panel-title" style={{ border: "none", padding: "6px 0" }}>
          Судьбы офицеров
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {s.officers.map((of) => (
            <div key={of.id} className="order-row" style={{ marginBottom: 0 }}>
              <span className="grow">
                <strong>{of.name}</strong>
                <span className="muted"> — {relationshipLabel(of)}</span>
                {of.injury !== "none" && (
                  <span style={{ color: of.alive ? "var(--warn)" : "var(--danger)" }}> · {INJURY_LABELS[of.injury]}</span>
                )}
              </span>
              <span className="muted" style={{ fontSize: 10 }}>
                вер {Math.round(of.traits.loyalty)} · ув {Math.round(of.traits.respectForPlayer)} · об{" "}
                {Math.round(of.traits.resentment)}
              </span>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={g.quitToMenu}>
            В меню
          </button>
          <button className="btn btn-gold" onClick={() => setShowCampaign(true)}>
            Хроника королевства →
          </button>
          <button className="btn btn-primary" onClick={g.newGame}>
            Новая партия
          </button>
        </div>
      </div>
    </div>
  );
}
