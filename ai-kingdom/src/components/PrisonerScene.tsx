import { useGame } from "../state/GameContext";
import type { PrisonerDecision } from "../game/types";

const CHOICES: { id: PrisonerDecision; title: string; desc: string }[] = [
  { id: "execute", title: "Казнить", desc: "Устрашить врага. Одни одобрят, другие содрогнутся." },
  { id: "imprison", title: "Заключить в темницу", desc: "Живой козырь для будущих переговоров." },
  { id: "release", title: "Отпустить", desc: "Жест милосердия — или опасной слабости." },
  { id: "recruit", title: "Завербовать", desc: "Переманить под свои знамёна. Успех не гарантирован." },
];

export default function PrisonerScene() {
  const g = useGame();
  const s = g.state!;
  const p = s.prisoner;
  if (!p) return null;

  const respect = p.respectForPlayer;
  const odds = respect > 68 ? "высоки" : respect > 45 ? "средние" : "невелики";

  return (
    <div className="overlay">
      <div className="modal" style={{ width: "min(620px, 96vw)", borderColor: "var(--red)" }}>
        <h2 style={{ color: "var(--gold-bright)" }}>Судьба пленника</h2>
        <div className="lead">
          Битва окончена. Перед вами связанный <strong>{p.commanderName}</strong>, командир разбитого войска.
          Его взгляд тяжёл, но в нём читается уважение к вашей стойкости (уважение к вам: {Math.round(respect)}/100).
          Шансы склонить его на свою сторону — <strong>{odds}</strong>.
        </div>

        <div className="prisoner-choices">
          {CHOICES.map((c) => (
            <button key={c.id} className="choice" onClick={() => g.decidePrisoner(c.id)}>
              <div className="ch">{c.title}</div>
              <div className="cd">{c.desc}</div>
            </button>
          ))}
        </div>

        <p className="muted" style={{ fontSize: 11.5, marginTop: 14, lineHeight: 1.5 }}>
          Ваше решение изменит мораль королевства, отношение офицеров и войдёт в итоговый отчёт.
        </p>
      </div>
    </div>
  );
}
