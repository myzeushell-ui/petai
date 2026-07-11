import { useEffect, useRef } from "react";
import { useGame } from "../state/GameContext";
import { isActive } from "../game/orders";
import { STATUS_LABELS, ACTION_LABELS } from "../game/constants";
import { formatClock } from "../game/util";

export default function EventLogPanel() {
  const g = useGame();
  const s = g.state!;
  const logRef = useRef<HTMLDivElement>(null);

  const activeOrders = s.orders.filter(isActive);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [s.log.length]);

  return (
    <div className="panel">
      <div className="bottom-split" style={{ height: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div className="panel-title">Хроника ночи</div>
          <div className="panel-body" ref={logRef} style={{ paddingTop: 6 }}>
            {s.log.length === 0 && <div className="muted" style={{ fontSize: 12 }}>Пока тихо…</div>}
            {s.log.map((e) => (
              <div key={e.id} className={`log-entry ${e.severity}`}>
                <span className="t">{formatClock(e.tick)}</span>
                <span>{e.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", minHeight: 0, borderLeft: "1px solid var(--wood-edge)" }}>
          <div className="panel-title">
            <span>Активные приказы</span>
            <span className="muted" style={{ fontSize: 10 }}>{activeOrders.length}</span>
          </div>
          <div className="panel-body" style={{ paddingTop: 6 }}>
            {activeOrders.length === 0 && <div className="muted" style={{ fontSize: 12 }}>Нет действующих приказов.</div>}
            {activeOrders.map((o) => {
              const officer = s.officers.find((of) => of.id === o.officerId);
              const loc = s.locations.find((l) => l.id === o.targetLocationId);
              return (
                <div className="order-row" key={o.id}>
                  <span className={`st ${o.status}`}>{STATUS_LABELS[o.status]}</span>
                  <span className="grow">
                    <strong>{officer?.name.split(" ").slice(-1)[0] ?? "—"}</strong> · {ACTION_LABELS[o.action]}
                    {loc ? ` → ${loc.name}` : ""}
                    {o.officerInitiated && <span className="init" title={o.initiativeReason}> ⚔ по своей инициативе</span>}
                  </span>
                  <button className="btn btn-ghost btn-sm" title="Отменить приказ" onClick={() => g.cancelOrder(o.id)}>
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
