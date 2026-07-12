import { useState } from "react";
import { useGame } from "../state/GameContext";
import Portrait from "./Portrait";
import { stateFromOfficer } from "../assets/portraits";
import { INJURY_LABELS, PERMANENT_INJURY_LABELS } from "../game/constants";
import type { GameState, OfficerVerdict } from "../game/types";

const VERDICTS: { id: OfficerVerdict; label: string }[] = [
  { id: "praise", label: "Похвалить" },
  { id: "promote", label: "Повысить" },
  { id: "forgive", label: "Простить" },
  { id: "blame", label: "Обвинить" },
  { id: "dismiss", label: "Снять" },
];

export default function AftermathScene() {
  const g = useGame();
  const s = g.state!;
  const a = s.aftermath;
  const [chronicle, setChronicle] = useState<string>("heroic");

  const victorious = s.outcome.kind.includes("victory");
  const losses = Math.round(Number(s.flags.playerCasualtiesTotal ?? 0));
  const castle = Math.round(s.resources.castleIntegrity);
  const survivors = s.officers.filter((o) => o.alive).length;

  const CHRONICLES = victorious
    ? [
        { id: "heroic", label: "Героическая оборона", text: "Малой кровью и железной волей корона отстояла Рассветный Предел." },
        { id: "measured", label: "Расчётливая победа", text: "Холодный расчёт и дисциплина сломили врага у самых стен." },
        { id: "people", label: "Победа народа", text: "Ополчение и знать встали плечом к плечу — и выстояли." },
      ]
    : [
        { id: "tragic", label: "Горькая ночь", text: "Предел пал, но песни о его защитниках переживут эту ночь." },
        { id: "betrayed", label: "Слишком поздно", text: "Врага недооценили, и цена оказалась непомерной." },
        { id: "defiant", label: "Несломленные", text: "Корона отступила, но не склонилась. Война только начинается." },
      ];

  return (
    <div className="aftermath">
      <div className="aftermath-inner">
        <header className={`aftermath-head ${victorious ? "win" : "lose"}`}>
          <div className="aftermath-kicker">Глава I · После битвы</div>
          <h1>{s.outcome.title}</h1>
          <p className="aftermath-summary">{s.outcome.summary}</p>
        </header>

        <div className="aftermath-stats">
          <Stat label="Замок" value={`${castle}%`} tone={castle > 50 ? "ok" : "bad"} />
          <Stat label="Потери" value={`${losses}`} tone={losses < 300 ? "ok" : "bad"} />
          <Stat label="Деревня" value={villageWord(s)} tone={s.village.damage < 40 ? "ok" : "bad"} />
          <Stat label="Офицеров в строю" value={`${survivors}/${s.officers.length}`} tone={survivors >= 4 ? "ok" : "bad"} />
          <Stat label="Мораль" value={`${Math.round(s.resources.kingdomMorale)}`} tone={s.resources.kingdomMorale > 50 ? "ok" : "bad"} />
        </div>

        <h2 className="aftermath-h2">Судьба совета</h2>
        <p className="muted aftermath-sub">Назначьте героя ночи и вынесите решение по каждому — они это запомнят.</p>

        <div className="aftermath-officers">
          {s.officers.map((o) => {
            const isHero = a?.heroOfficerId === o.id;
            const verdict = a?.verdicts[o.id];
            return (
              <div key={o.id} className={`aftermath-officer ${o.alive ? "" : "fallen"}`}>
                <div className="aftermath-officer-top">
                  <Portrait
                    characterKey={o.id}
                    state={o.alive ? stateFromOfficer(o) : "wounded"}
                    size={64}
                    shape="card"
                    dim={!o.alive}
                    ring={isHero}
                    crestSeed={o.crestSeed}
                    accent={o.accentColor}
                  />
                  <div className="aftermath-officer-id">
                    <div className="name">
                      {o.name} {isHero && <span className="hero-star">★ герой</span>}
                    </div>
                    <div className="role muted">
                      {o.alive ? o.role : "Пал в бою"}
                      {o.injury !== "none" && o.alive && ` · ${INJURY_LABELS[o.injury]}`}
                      {o.permanentInjury !== "none" && ` · ${PERMANENT_INJURY_LABELS[o.permanentInjury]}`}
                    </div>
                  </div>
                </div>
                {o.alive && (
                  <div className="aftermath-verdicts">
                    <button
                      className={`pill ${isHero ? "sel" : ""}`}
                      onClick={() => g.nameHero(isHero ? null : o.id)}
                    >
                      ★ герой
                    </button>
                    {VERDICTS.map((v) => (
                      <button
                        key={v.id}
                        className={`pill ${verdict === v.id ? "sel" : ""}`}
                        onClick={() => g.setAftermathVerdict(o.id, v.id)}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <h2 className="aftermath-h2">Официальная хроника</h2>
        <div className="aftermath-chronicles">
          {CHRONICLES.map((c) => (
            <button
              key={c.id}
              className={`choice-opt ${chronicle === c.id ? "sel" : ""}`}
              onClick={() => setChronicle(c.id)}
            >
              <div className="choice-opt-label">{c.label}</div>
              <div className="choice-opt-blurb">{c.text}</div>
            </button>
          ))}
        </div>

        <footer className="council-foot">
          <div className="muted">Ваши решения перейдут в следующую главу.</div>
          <button className="btn btn-primary btn-lg" onClick={() => g.concludeAftermath(chronicle)}>
            {s.prisoner && !s.prisoner.decided ? "К пленнику →" : "Завершить главу →"}
          </button>
        </footer>
      </div>
    </div>
  );
}

function villageWord(s: GameState): string {
  if (s.flags.villageRaided) return "разграблена";
  if (s.village.evacuationProgress >= 0.8 || s.flags.villageEvacuated) return "спасена";
  if (s.village.damage > 50) return "разорена";
  return "цела";
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "ok" | "bad" }) {
  return (
    <div className={`aftermath-stat ${tone}`}>
      <div className="aftermath-stat-v">{value}</div>
      <div className="aftermath-stat-l">{label}</div>
    </div>
  );
}
