import { useMemo, useState } from "react";
import { useGame } from "../state/GameContext";
import Portrait from "./Portrait";
import { assetUrl } from "../assets/registry";
import {
  COUNCIL_VOICES,
  PLAN_OPTIONS,
  VILLAGE_OPTIONS,
  FORTIFY_OPTIONS,
  DEFAULT_COUNCIL,
} from "../game/council";
import type { CouncilDecisions, FortifyFocus, MainPlan, VillagePlan } from "../game/types";

export default function WarCouncil() {
  const g = useGame();
  const s = g.state!;
  const officerById = useMemo(() => new Map(s.officers.map((o) => [o.id, o])), [s.officers]);

  const [d, setD] = useState<CouncilDecisions>(DEFAULT_COUNCIL);
  const [speaker, setSpeaker] = useState<string>("mara");

  const plan = PLAN_OPTIONS.find((p) => p.id === d.plan)!;
  const castle = assetUrl("castle_dawns_edge");

  // Who is pleased / displeased by the current main plan?
  const pleased = new Set<string>([plan.backer]);
  const displeased = new Set<string>([plan.opposed]);
  if (d.village === "full_evac") pleased.add("elyne");
  if (d.village === "stand") displeased.add("elyne");
  if (d.autonomyOfficerId) pleased.add(d.autonomyOfficerId);

  const officers = s.officers;

  return (
    <div className="council">
      <div className="council-bg" aria-hidden>
        {castle && <img src={castle} alt="" className="council-bg-castle" />}
        <div className="council-bg-grade" />
      </div>

      <div className="council-inner">
        <header className="council-head">
          <div>
            <div className="council-kicker">Военный совет · Рассветный Предел</div>
            <h1>Ночь перед осадой</h1>
          </div>
          <div className="council-clock">
            <span className="muted">До рассвета</span>
            <b>{Math.round(s.timeUntilDawn)} мин</b>
          </div>
        </header>

        {/* Round table of five voices */}
        <div className="council-table">
          {COUNCIL_VOICES.map((v) => {
            const o = officerById.get(v.officerId);
            if (!o) return null;
            const active = speaker === v.officerId;
            const mood = pleased.has(v.officerId)
              ? "pleased"
              : displeased.has(v.officerId)
                ? "displeased"
                : "neutral";
            return (
              <button
                key={v.officerId}
                className={`council-seat ${active ? "active" : ""} mood-${mood}`}
                onClick={() => setSpeaker(v.officerId)}
              >
                <Portrait
                  characterKey={v.officerId}
                  state={mood === "displeased" ? "angry" : mood === "pleased" ? "victorious" : "neutral"}
                  size={92}
                  shape="tall"
                  ring={active}
                  crestSeed={o.crestSeed}
                  accent={o.accentColor}
                />
                <div className="council-seat-name">{o.name.replace(/^Сэр |^Леди /, "")}</div>
                <div className="council-seat-role">{o.role}</div>
                {mood !== "neutral" && (
                  <span className={`council-mood ${mood}`}>{mood === "pleased" ? "одобряет" : "недоволен"}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active speaker's argument */}
        {(() => {
          const v = COUNCIL_VOICES.find((x) => x.officerId === speaker)!;
          const o = officerById.get(speaker)!;
          return (
            <div className="council-speech">
              <div className="council-speech-who">{o.name}</div>
              <p className="council-speech-line">«{v.line}»</p>
              <p className="council-speech-concern">⚔ {v.concern}</p>
            </div>
          );
        })()}

        {/* Decisions */}
        <div className="council-decisions">
          <Choice
            title="Главный план обороны"
            options={PLAN_OPTIONS.map((p) => ({ id: p.id, label: p.label, blurb: p.blurb, backer: p.backer }))}
            value={d.plan}
            onPick={(id) => setD((x) => ({ ...x, plan: id as MainPlan }))}
            officerById={officerById}
          />
          <Choice
            title="Судьба деревни"
            options={VILLAGE_OPTIONS.map((v) => ({ id: v.id, label: v.label, blurb: v.blurb }))}
            value={d.village}
            onPick={(id) => setD((x) => ({ ...x, village: id as VillagePlan }))}
            officerById={officerById}
          />
          <Choice
            title="Куда бросить укрепления"
            options={FORTIFY_OPTIONS.map((f) => ({ id: f.id, label: f.label, blurb: f.blurb }))}
            value={d.fortify}
            onPick={(id) => setD((x) => ({ ...x, fortify: id as FortifyFocus }))}
            officerById={officerById}
          />

          <div className="council-assign">
            <OfficerPick
              title="Дать свободу действий"
              hint="Офицер сможет действовать по своей инициативе."
              officers={officers.map((o) => ({ id: o.id, name: o.name }))}
              value={d.autonomyOfficerId}
              onPick={(id) => setD((x) => ({ ...x, autonomyOfficerId: id }))}
            />
            <OfficerPick
              title="Доверить резерв"
              hint="Кто поведёт резервный отряд в критический момент."
              officers={officers.map((o) => ({ id: o.id, name: o.name }))}
              value={d.reserveOfficerId}
              onPick={(id) => setD((x) => ({ ...x, reserveOfficerId: id }))}
            />
          </div>
        </div>

        <footer className="council-foot">
          <div className="council-summary muted">
            План: <b>{plan.label}</b> · Деревня:{" "}
            <b>{VILLAGE_OPTIONS.find((v) => v.id === d.village)!.label}</b> · Укрепления:{" "}
            <b>{FORTIFY_OPTIONS.find((f) => f.id === d.fortify)!.label}</b>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => g.resolveCouncil(d)}>
            Принять решения и начать оборону →
          </button>
        </footer>
      </div>
    </div>
  );
}

function Choice({
  title,
  options,
  value,
  onPick,
  officerById,
}: {
  title: string;
  options: { id: string; label: string; blurb: string; backer?: string }[];
  value: string;
  onPick: (id: string) => void;
  officerById: Map<string, { name: string }>;
}) {
  return (
    <div className="choice">
      <div className="choice-title">{title}</div>
      <div className="choice-opts">
        {options.map((o) => {
          const backer = o.backer ? officerById.get(o.backer) : null;
          return (
            <button
              key={o.id}
              className={`choice-opt ${value === o.id ? "sel" : ""}`}
              onClick={() => onPick(o.id)}
            >
              <div className="choice-opt-label">{o.label}</div>
              <div className="choice-opt-blurb">{o.blurb}</div>
              {backer && <div className="choice-opt-backer">за: {backer.name.replace(/^Сэр |^Леди /, "")}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OfficerPick({
  title,
  hint,
  officers,
  value,
  onPick,
}: {
  title: string;
  hint: string;
  officers: { id: string; name: string }[];
  value: string | null;
  onPick: (id: string | null) => void;
}) {
  return (
    <div className="choice">
      <div className="choice-title">{title}</div>
      <div className="choice-hint muted">{hint}</div>
      <div className="officer-pick-row">
        <button className={`pill ${value === null ? "sel" : ""}`} onClick={() => onPick(null)}>
          Никому
        </button>
        {officers.map((o) => (
          <button
            key={o.id}
            className={`pill ${value === o.id ? "sel" : ""}`}
            onClick={() => onPick(o.id)}
          >
            {o.name.replace(/^Сэр |^Леди /, "")}
          </button>
        ))}
      </div>
    </div>
  );
}
