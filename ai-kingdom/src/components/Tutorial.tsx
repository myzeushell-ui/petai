import { useGame } from "../state/GameContext";

const STEPS: { text: string; style: React.CSSProperties }[] = [
  { text: "Слева — ваш совет офицеров. Выберите офицера, чтобы говорить с ним.", style: { left: 278, top: 120 } },
  { text: "Справа отдайте приказ голосом или текстом. Например: «Эдвард, удерживай мост до рассвета».", style: { right: 356, top: 200 } },
  { text: "Опасные приказы требуют подтверждения. Проверьте, верно ли вас поняли.", style: { left: "50%", top: 150, transform: "translateX(-50%)" } },
  { text: "Время на паузе. Снимите паузу вверху (или пробелом), чтобы события пошли.", style: { right: 200, top: 58 } },
  { text: "Внизу — хроника ночи и активные приказы. Здесь появляются доклады.", style: { left: 300, bottom: 178 } },
  { text: "Меняйте приказы в любой момент. Офицеры помнят ваши решения — берегите доверие.", style: { right: 356, bottom: 120 } },
];

export default function Tutorial() {
  const g = useGame();
  const s = g.state!;
  if (!s.tutorial.active || s.phase !== "playing") return null;
  const step = Math.min(s.tutorial.step, STEPS.length - 1);
  const current = STEPS[step];

  return (
    <div className="coach" style={current.style}>
      <div className="step">
        Обучение · шаг {step + 1}/{STEPS.length}
      </div>
      <div className="txt">{current.text}</div>
      <div className="ca">
        <button className="btn btn-ghost btn-sm" onClick={g.skipTutorial}>
          Пропустить
        </button>
        <button className="btn btn-gold btn-sm" onClick={g.advanceTutorial}>
          {step + 1 >= STEPS.length ? "Готово" : "Далее"}
        </button>
      </div>
    </div>
  );
}
