import { useState } from "react";
import { useGame } from "../state/GameContext";
import { Crest } from "./Crest";

export default function MainMenu() {
  const g = useGame();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="menu">
      <div className="menu-card">
        <Crest seed={7} accent="#cba24a" size={92} className="crest-big" />
        <div className="title">AI KINGDOM</div>
        <div className="subtitle">Ночь перед осадой</div>
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
              <li>Выберите офицера слева, чтобы говорить с ним.</li>
              <li>
                Отдайте приказ голосом или текстом справа: например,{" "}
                <span className="kbd">Эдвард, удерживай мост до рассвета</span>.
              </li>
              <li>Проверьте разбор приказа и подтвердите его.</li>
              <li>Снимите паузу (пробел) и следите за докладами на карте.</li>
              <li>Меняйте приказы, реагируйте на события и решите судьбу пленника.</li>
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

        <div className="hint">
          Прототип v1 · локальный разбор приказов · без внешних API · Web Speech для голоса
        </div>
      </div>
    </div>
  );
}
