import { useGame } from "../state/GameContext";

export default function ReportBanner() {
  const g = useGame();
  const s = g.state!;
  if (s.phase !== "playing") return null;

  const ev = [...s.events].reverse().find((e) => e.requiresPause && !e.handled);
  if (!ev) return null;

  const officer = s.officers.find((o) => o.id === ev.officerId);
  const isInitiative = ev.kind === "initiative_request" && officer?.pendingInitiativeOrderId;

  return (
    <div className={`banner ${ev.severity === "critical" ? "critical" : ""}`}>
      <div className="bt">{ev.title}</div>
      <div className="bm">{ev.message}</div>
      <div className="ba">
        {isInitiative ? (
          <>
            <button
              className="btn btn-ghost"
              onClick={() => {
                g.resolveInitiative(officer!.id, false);
                g.dismissEvents(ev.id);
              }}
            >
              Отказать
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                g.resolveInitiative(officer!.id, true);
                g.dismissEvents(ev.id);
              }}
            >
              Разрешить атаку
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={() => g.dismissEvents(ev.id)}>
              Понятно
            </button>
            <button
              className="btn btn-gold"
              onClick={() => {
                g.dismissEvents(ev.id);
                g.setSpeed(1);
              }}
            >
              Продолжить ▶
            </button>
          </>
        )}
      </div>
    </div>
  );
}
