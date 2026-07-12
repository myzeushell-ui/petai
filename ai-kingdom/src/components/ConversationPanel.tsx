import { useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "../state/GameContext";
import Portrait from "./Portrait";
import { stateFromOfficer } from "../assets/portraits";
import MicButton from "./MicButton";
import type { DialogueMessage } from "../game/types";

const QUICK_BY_OFFICER: Record<string, string[]> = {
  edward: ["Удерживай мост до рассвета", "Сколько людей ты потерял?", "Отступай к замку"],
  roland: ["Спрячь конницу за холмами и жди приказа", "Атакуй фланг врага", "Что посоветуешь?"],
  mara: ["Доложи обстановку", "Что по врагу?", "Отправь разведчиков в лес", "Каковы наши запасы?"],
};

export default function ConversationPanel() {
  const g = useGame();
  const s = g.state!;
  const [text, setText] = useState("");
  const streamRef = useRef<HTMLDivElement>(null);

  const officer = s.officers.find((o) => o.id === s.selectedOfficerId) ?? null;

  const thread = useMemo<DialogueMessage[]>(() => {
    return s.dialogue.filter(
      (m) =>
        m.speaker === "narrator" ||
        m.speaker === "system" ||
        m.officerId === s.selectedOfficerId ||
        (!s.selectedOfficerId && m.speaker !== "player"),
    );
  }, [s.dialogue, s.selectedOfficerId]);

  useEffect(() => {
    const el = streamRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread.length]);

  // "Изменить" on the confirm card returns the order's text here for editing.
  useEffect(() => {
    if (s.pendingRevision) {
      setText(s.pendingRevision);
      g.clearRevision();
    }
  }, [s.pendingRevision, g]);

  const send = (raw?: string) => {
    const value = (raw ?? text).trim();
    if (!value) return;
    g.submit(value);
    setText("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const quick = officer ? QUICK_BY_OFFICER[officer.id] ?? [] : [];
  const pendingField = s.pendingClarification?.awaiting;

  return (
    <div className="panel">
      <div className="convo">
        <div className="convo-head">
          {officer ? (
            <>
              <Portrait
                characterKey={officer.id}
                state={stateFromOfficer(officer)}
                size={40}
                shape="card"
                crestSeed={officer.crestSeed}
                accent={officer.accentColor}
              />
              <div style={{ minWidth: 0 }}>
                <div className="name">{officer.name}</div>
                <div className="role">{officer.title}</div>
              </div>
            </>
          ) : (
            <div className="role">Выберите офицера слева, чтобы говорить с ним</div>
          )}
        </div>

        <div className="convo-stream" ref={streamRef}>
          {thread.length === 0 && <div className="center-empty">Отдайте первый приказ, милорд.</div>}
          {thread.map((m) => {
            const cls =
              m.speaker === "player"
                ? "player"
                : m.speaker === "narrator"
                  ? "narrator"
                  : m.speaker === "system"
                    ? "system"
                    : "officer";
            const who =
              m.speaker === "player"
                ? "Вы"
                : m.speaker === "narrator"
                  ? "Хроника"
                  : m.speaker === "system"
                    ? ""
                    : s.officers.find((o) => o.id === m.officerId)?.name ?? "";
            return (
              <div key={m.id} className={`msg ${cls}`}>
                {who && <div className="who">{who}</div>}
                {m.text}
              </div>
            );
          })}
        </div>

        <div className="convo-input" style={{ position: "relative" }}>
          {pendingField && (
            <div className="voice-status" style={{ color: "var(--gold)" }}>
              Офицер ждёт уточнения ({pendingField === "unitCount" ? "число войск" : pendingField === "target" ? "цель" : "офицер"}).
            </div>
          )}
          {quick.length > 0 && (
            <div className="quick-replies">
              {quick.map((q) => (
                <button key={q} className="chip" onClick={() => send(`${officer?.name.split(" ").slice(-1)[0] ?? ""}, ${q}`)}>
                  {q}
                </button>
              ))}
            </div>
          )}
          <div className="input-row">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
              placeholder={
                officer
                  ? `Приказ для ${officer.name.split(" ").slice(-1)[0]}… (Enter — отправить)`
                  : "Например: Эдвард, удерживай мост до рассвета"
              }
            />
            <MicButton
              lang={s.settings.speechLang}
              enabled={s.settings.voiceInput}
              onInterim={(t) => setText(t)}
              onFinal={(t) => setText(t)}
            />
            <button className="btn btn-primary" onClick={() => send()} disabled={!text.trim()} style={{ height: 40 }}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
