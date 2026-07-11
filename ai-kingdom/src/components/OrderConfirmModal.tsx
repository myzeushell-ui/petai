import { useGame } from "../state/GameContext";
import { describeOrder } from "../game/orders";
import { RISK_LABELS } from "../game/constants";

export default function OrderConfirmModal() {
  const g = useGame();
  const s = g.state!;
  // Show the most recent order awaiting confirmation.
  const order = [...s.orders].reverse().find((o) => o.status === "awaiting_confirmation");
  if (!order) return null;

  const officer = s.officers.find((o) => o.id === order.officerId);
  const lines = describeOrder(order, s);

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Подтверждение приказа</h2>
        <div className="lead">
          {officer?.name} ожидает вашего слова. Проверьте, верно ли понят приказ.
        </div>

        {order.warned && (
          <div
            className="banner critical"
            style={{ position: "static", transform: "none", width: "auto", marginBottom: 12 }}
          >
            <div className="bt">Офицер предупреждает</div>
            <div className="bm">
              Приказ сопряжён с высоким риском ({RISK_LABELS[order.risk]}). Настаиваете — и {officer?.name.split(" ").slice(-1)[0]} исполнит его, но запомнит это.
            </div>
          </div>
        )}

        <div className="order-card">
          {lines.map((l) => (
            <div className="row" key={l.label}>
              <span className="k">{l.label}</span>
              <span className={`v ${l.label === "Риск" ? `risk-${order.risk}` : ""}`}>{l.value}</span>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-ghost"
            title="Отменить и вернуть текст приказа в строку для правки"
            onClick={() => g.reviseOrder(order.id)}
          >
            Изменить
          </button>
          <button className="btn btn-danger" onClick={() => g.declineOrder(order.id)}>
            Отменить
          </button>
          <button className="btn btn-primary" onClick={() => g.confirmOrder(order.id)}>
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}
