import { useGame } from "../state/GameContext";
import { speechInput, speechOutput } from "../game/speech";

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      className="btn"
      onClick={onClick}
      style={{ justifyContent: "space-between", width: "100%" }}
    >
      <span>{label}</span>
      <span style={{ color: on ? "var(--ok)" : "var(--tx-mut)" }}>{on ? "вкл" : "выкл"}</span>
    </button>
  );
}

export default function SettingsMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const g = useGame();
  const s = g.state!;
  if (!open) return null;

  const inputSupported = speechInput.isSupported();
  const outputSupported = speechOutput.isSupported();

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ width: "min(440px, 96vw)" }} onClick={(e) => e.stopPropagation()}>
        <h2>Настройки</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          <Toggle
            on={s.settings.voiceInput}
            onClick={() => g.updateSettings({ voiceInput: !s.settings.voiceInput })}
            label="Голосовой ввод приказов"
          />
          {!inputSupported && (
            <div className="voice-status err">Распознавание речи недоступно в этом браузере (нужен Chrome/Edge).</div>
          )}
          <Toggle
            on={s.settings.voiceOutput}
            onClick={() => g.updateSettings({ voiceOutput: !s.settings.voiceOutput })}
            label="Озвучивать ответы офицеров"
          />
          {!outputSupported && (
            <div className="voice-status err">Синтез речи недоступен — текст отображается всегда.</div>
          )}
        </div>

        <div className="panel-title" style={{ border: "none", padding: "12px 0 6px" }}>
          Партия
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn" onClick={g.newGame}>
            Начать заново
          </button>
          <button className="btn" onClick={g.quitToMenu}>
            Выйти в меню (сохранит прогресс)
          </button>
          <button className="btn btn-danger" onClick={g.resetSave}>
            Сбросить сохранение
          </button>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onClose}>
            Продолжить
          </button>
        </div>
      </div>
    </div>
  );
}
