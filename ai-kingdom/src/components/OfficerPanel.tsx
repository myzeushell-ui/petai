import { useGame } from "../state/GameContext";
import { Crest } from "./Crest";
import { UnitIcon } from "./icons";
import { relationshipLabel } from "../game/officers";
import { officerMoodLine } from "../game/dialogue";
import { INJURY_LABELS, PERMANENT_INJURY_LABELS, UNIT_LABELS } from "../game/constants";
import type { Officer } from "../game/types";

const TRAITS: { key: keyof Officer["traits"]; label: string }[] = [
  { key: "loyalty", label: "Верность" },
  { key: "courage", label: "Смелость" },
  { key: "caution", label: "Осторожн." },
  { key: "ambition", label: "Амбиции" },
  { key: "discipline", label: "Дисципл." },
  { key: "competence", label: "Умение" },
];

export default function OfficerPanel() {
  const g = useGame();
  const s = g.state!;

  return (
    <div className="panel">
      <div className="panel-title">
        <span>Совет офицеров</span>
        <span className="muted" style={{ fontSize: 10 }}>{s.officers.filter((o) => o.alive).length} в строю</span>
      </div>
      <div className="panel-body">
        {s.officers.map((o) => {
          const rel = relationshipLabel(o);
          const groups = s.units.filter((u) => u.commanderId === o.id && u.count > 0);
          const selected = s.selectedOfficerId === o.id;
          return (
            <div
              key={o.id}
              className={`officer-card ${selected ? "selected" : ""} ${o.alive ? "" : "dead"}`}
              onClick={() => o.alive && g.selectOfficer(o.id)}
            >
              <div className="officer-top">
                <Crest seed={o.crestSeed} accent={o.accentColor} size={42} />
                <div className="officer-id">
                  <div className="name">{o.name}</div>
                  <div className="role">{o.title}</div>
                </div>
              </div>

              <div className="officer-badges">
                <span className={`badge rel-${rel}`}>{rel}</span>
                {o.injury !== "none" && (
                  <span className={`badge injury ${o.alive ? "" : "dead"}`}>{INJURY_LABELS[o.injury]}</span>
                )}
                {o.permanentInjury !== "none" && (
                  <span className="badge injury">{PERMANENT_INJURY_LABELS[o.permanentInjury]}</span>
                )}
                {o.pendingInitiativeOrderId && <span className="badge" style={{ color: "var(--gold)" }}>ждёт приказа</span>}
              </div>

              <div className="officer-task">
                <span className={`dot ${o.currentTask.includes("Ожидает") ? "" : "active"}`} />
                {o.currentTask}
              </div>
              <div className="officer-mood">«{officerMoodLine(o)}»</div>

              {selected && (
                <>
                  <div className="traits">
                    {TRAITS.map((t) => (
                      <div className="trait" key={t.key}>
                        <span style={{ width: 52 }}>{t.label}</span>
                        <span className="tbar">
                          <span style={{ width: `${o.traits[t.key]}%` }} />
                        </span>
                      </div>
                    ))}
                  </div>
                  {groups.length > 0 ? (
                    groups.map((u) => (
                      <div className="troop-line" key={u.id}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <UnitIcon type={u.type} /> {UNIT_LABELS[u.type]}
                        </span>
                        <span>
                          <span className="cnt">{u.count}</span>{" "}
                          <span className="muted" style={{ fontSize: 10 }}>м{Math.round(u.morale)}</span>
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="troop-line muted">Нет войск под началом</div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
