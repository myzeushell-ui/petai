import { useEffect, useRef, useState } from "react";
import { speechInput } from "../game/speech";

type MicState = "idle" | "listening" | "error" | "unsupported";

export default function MicButton({
  onInterim,
  onFinal,
  lang,
  enabled,
}: {
  onInterim: (t: string) => void;
  onFinal: (t: string) => void;
  lang: string;
  enabled: boolean;
}) {
  const [micState, setMicState] = useState<MicState>(speechInput.isSupported() ? "idle" : "unsupported");
  const [msg, setMsg] = useState("");
  const listeningRef = useRef(false);

  useEffect(() => () => speechInput.stop(), []);

  const toggle = () => {
    if (!speechInput.isSupported()) {
      setMicState("unsupported");
      setMsg("Голосовой ввод не поддерживается — используйте текст.");
      return;
    }
    if (listeningRef.current) {
      speechInput.stop();
      listeningRef.current = false;
      setMicState("idle");
      setMsg("");
      return;
    }
    speechInput.setLang(lang);
    listeningRef.current = true;
    setMicState("listening");
    setMsg("Слушаю…");
    speechInput.start({
      onInterim: (t) => {
        setMsg("Распознаю: " + t);
        onInterim(t);
      },
      onFinal: (t) => {
        setMsg("Распознано — проверьте и отправьте.");
        onFinal(t);
      },
      onError: (e) => {
        listeningRef.current = false;
        setMicState("error");
        setMsg(e === "not-allowed" ? "Нет доступа к микрофону." : "Ошибка распознавания.");
      },
      onEnd: () => {
        listeningRef.current = false;
        setMicState((prev) => (prev === "error" ? prev : "idle"));
      },
    });
  };

  const title = !enabled
    ? "Включите голосовой ввод в настройках"
    : micState === "unsupported"
      ? "Браузер не поддерживает распознавание речи"
      : micState === "listening"
        ? "Остановить"
        : "Говорите приказ";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <button
        type="button"
        className={`mic ${micState === "listening" ? "listening" : ""}`}
        onClick={toggle}
        disabled={!enabled || micState === "unsupported"}
        title={title}
        aria-label={title}
      >
        {micState === "listening" ? "◉" : "🎙"}
      </button>
      {msg && (
        <div className={`voice-status ${micState === "error" ? "err" : ""}`} style={{ position: "absolute", bottom: 54, left: 10, right: 10 }}>
          {msg}
        </div>
      )}
    </div>
  );
}
