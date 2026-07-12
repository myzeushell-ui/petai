import { useEffect, useMemo } from "react";
import { useGame } from "../state/GameContext";
import Portrait from "./Portrait";
import { CHAPTERS, saveChapter } from "../game/campaign";

export default function CampaignScreen({ onBack }: { onBack: () => void }) {
  const g = useGame();
  const s = g.state!;

  // Persist this chapter's result once when the screen opens.
  const save = useMemo(() => saveChapter(s, undefined, 1), [s]);
  useEffect(() => void save, [save]);

  const hero = s.aftermath?.heroOfficerId
    ? s.officers.find((o) => o.id === s.aftermath!.heroOfficerId)
    : null;
  const survivors = s.officers.filter((o) => o.alive);

  return (
    <div className="campaign">
      <div className="campaign-inner">
        <header className="campaign-head">
          <div className="council-kicker">Хроника королевства Валедорн</div>
          <h1>Кампания</h1>
          <p className="muted">Ваши решения переходят из главы в главу. Репутация двора: <b>{save.reputation}</b>.</p>
        </header>

        <div className="campaign-chapters">
          {CHAPTERS.map((c) => {
            const done = c.chapter === 1;
            return (
              <div key={c.chapter} className={`campaign-chapter ${done ? "done" : "locked"}`}>
                <div className="campaign-ch-no">Глава {toRoman(c.chapter)}</div>
                <div className="campaign-ch-title">{c.title}</div>
                <div className="campaign-ch-sub muted">{c.subtitle}</div>
                <div className={`campaign-ch-status ${done ? "done" : "locked"}`}>
                  {done ? "✔ завершена" : "🔒 заблокирована"}
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="aftermath-h2">Что перенесётся в Главу II</h2>
        <div className="campaign-carry">
          <div className="campaign-carry-officers">
            {survivors.map((o) => (
              <div key={o.id} className="campaign-carry-officer">
                <Portrait characterKey={o.id} size={46} shape="card" crestSeed={o.crestSeed} accent={o.accentColor} />
                <div>
                  <div className="name">{o.name.replace(/^Сэр |^Леди /, "")}</div>
                  <div className="muted" style={{ fontSize: 10.5 }}>
                    вер {Math.round(o.traits.loyalty)} · ув {Math.round(o.traits.respectForPlayer)} · об {Math.round(o.traits.resentment)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ul className="campaign-carry-facts">
            {hero && <li>★ Герой ночи: <b>{hero.name}</b></li>}
            <li>Замок: <b>{Math.round(s.resources.castleIntegrity)}%</b> прочности</li>
            <li>Деревня: <b>{save.chapters[0]?.villageState}</b></li>
            {s.prisoner?.decision && <li>Судьба Кассиана Рейка: <b>{prisonerWord(s.prisoner.decision)}</b></li>}
            {s.officers.some((o) => !o.alive) && (
              <li>Павшие: <b>{s.officers.filter((o) => !o.alive).map((o) => o.name).join(", ")}</b></li>
            )}
          </ul>
        </div>

        <footer className="council-foot">
          <button className="btn btn-ghost" onClick={onBack}>← Назад к итогам</button>
          <button className="btn btn-primary" onClick={g.newGame}>Сыграть заново</button>
        </footer>
      </div>
    </div>
  );
}

function toRoman(n: number): string {
  return ["", "I", "II", "III", "IV"][n] ?? String(n);
}

function prisonerWord(d: string): string {
  return (
    { execute: "казнён", imprison: "в темнице", release: "отпущен", recruit: "на службе короны" }[d] ?? d
  );
}
