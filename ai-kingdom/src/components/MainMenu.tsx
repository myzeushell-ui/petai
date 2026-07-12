import { useState } from "react";
import { useGame } from "../state/GameContext";
import { Crest } from "./Crest";
import Portrait from "./Portrait";
import { assetUrl } from "../assets/registry";

const COUNCIL: { key: string; name: string }[] = [
  { key: "edward", name: "Эдвард Вейл" },
  { key: "roland", name: "Роланд Эшфорд" },
  { key: "mara", name: "Мара Вельт" },
  { key: "alaric", name: "Аларик Торн" },
  { key: "elyne", name: "Элин Арден" },
];

export default function MainMenu() {
  const g = useGame();
  const [showHelp, setShowHelp] = useState(false);
  const castle = assetUrl("castle_dawns_edge");

  return (
    <div className="menu menu-cinematic">
      {/* Cinematic backdrop: the fortress at night */}
      <div className="menu-bg" aria-hidden>
        {castle && <img className="menu-bg-castle" src={castle} alt="" draggable={false} />}
        <div className="menu-bg-grade" />
      </div>

      <div className="menu-card menu-card-hero">
        <Crest seed={7} accent="#cba24a" size={82} className="crest-big" />
        <div className="title">AI KINGDOM</div>
        <div className="subtitle">Ночь перед осадой · Королевство Валедорн</div>
        <div className="tagline">
          Вы — молодой правитель. Вы командуете не фигурами, а людьми, которые командуют войсками.
        </div>

        {!showHelp ? (
          <div className="menu-actions">
            {g.hasSavedGame && (
              <button className="btn btn-gold" onClick={g.continueGame}>
                Продолжить
              </button>
            )}
            <button className="btn btn-primary" onClick={g.newGame}>
              Новая партия
            </button>
            <button className="btn" onClick={() => setShowHelp(true)}>
              Как играть
            </button>
            {g.hasSavedGame && (
              <button className="btn btn-ghost btn-sm" onClick={g.resetSave}>
                Сбросить сохранение
              </button>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "left", maxWidth: 520, margin: "0 auto" }}>
            <ol className="report-highlights" style={{ counterReset: "step" }}>
              <li>Соберите военный совет и выберите план обороны.</li>
              <li>
                Отдавайте приказы голосом или текстом: например,{" "}
                <span className="kbd">Эдвард, удерживай мост до рассвета</span>.
              </li>
              <li>Проверьте разбор приказа и подтвердите его.</li>
              <li>Снимите паузу (пробел) и следите за докладами на живой карте.</li>
              <li>Решайте судьбу деревни, реагируйте на кризис и пережившите до рассвета.</li>
            </ol>
            <p className="muted" style={{ fontSize: 12, lineHeight: 1.6 }}>
              Голосовой ввод работает в Chrome/Edge (русский язык). В любом браузере всё доступно
              текстом. Офицеры помнят ваши решения — доверие легко потерять.
            </p>
            <div className="menu-actions" style={{ marginTop: 16 }}>
              <button className="btn btn-primary" onClick={g.newGame}>
                Начать
              </button>
              <button className="btn btn-ghost" onClick={() => setShowHelp(false)}>
                Назад
              </button>
            </div>
          </div>
        )}

        {!showHelp && (
          <div className="menu-council">
            {COUNCIL.map((c) => (
              <div className="menu-council-face" key={c.key}>
                <Portrait characterKey={c.key} size={62} shape="card" />
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="hint">
          V3 «Живое королевство» · локальный разбор приказов · без внешних API · Web Speech для голоса
        </div>
      </div>
    </div>
  );
}
