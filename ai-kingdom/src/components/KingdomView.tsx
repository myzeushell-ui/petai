import { useGame } from "../state/GameContext";
import Portrait from "./Portrait";
import {
  SEASON_LABELS,
  SPECIALTY_LABELS,
  RESOURCE_LABELS,
  STRATEGIC_RESOURCES,
  TAX_LABELS,
  RATION_LABELS,
  CONSCRIPTION_LABELS,
  kingdomTotals,
  provinceManpowerPool,
  type Province,
  type StrategicResource,
} from "../game/kingdom";

const HUD_RESOURCES: StrategicResource[] = [
  "food",
  "gold",
  "manpower",
  "weapons",
  "iron",
  "timber",
  "stone",
  "horses",
  "medicine",
  "influence",
];

const IND_ROWS: { key: keyof Province["indicators"]; label: string; good: "high" | "low" }[] = [
  { key: "happiness", label: "Счастье", good: "high" },
  { key: "health", label: "Здоровье", good: "high" },
  { key: "foodSecurity", label: "Сытость", good: "high" },
  { key: "trustInCrown", label: "Доверие короне", good: "high" },
  { key: "warWeariness", label: "Усталость от войны", good: "low" },
];

export default function KingdomView({ onClose }: { onClose: () => void }) {
  const g = useGame();
  const s = g.state!;
  const k = s.kingdom;
  const totals = kingdomTotals(k);

  return (
    <div className="kingdom-view">
      <div className="kingdom-inner">
        <header className="kingdom-head">
          <div>
            <div className="council-kicker">Королевство · {k.capital}</div>
            <h1>{k.name}</h1>
            <p className="muted">
              {SEASON_LABELS[k.season]}, день {k.day} · год {k.year} · репутация двора {Math.round(k.reputation)}
            </p>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>
            ✕ Закрыть
          </button>
        </header>

        {/* Realm stockpile */}
        <div className="kingdom-stock">
          {HUD_RESOURCES.map((r) => (
            <div className="kingdom-res" key={r}>
              <span className="kingdom-res-v">{Math.round(k.stockpile[r])}</span>
              <span className="kingdom-res-l">{RESOURCE_LABELS[r]}</span>
            </div>
          ))}
        </div>

        {/* Realm totals */}
        <div className="kingdom-totals muted">
          Население: <b>{totals.population.toLocaleString("ru-RU")}</b> · Ополчение: <b>{totals.militia}</b> ·
          Мобилизационный резерв: <b>{totals.manpowerPool}</b> · Провинций: <b>{totals.playerProvinces}/{totals.provinces}</b> ·
          Средн. счастье <b>{totals.avgHappiness}</b> · лояльность <b>{totals.avgLoyalty}</b>
        </div>

        <h2 className="aftermath-h2">Провинции</h2>
        <div className="kingdom-provinces">
          {k.provinces.map((p) => (
            <ProvinceCard key={p.id} p={p} governor={s.officers.find((o) => o.id === p.governorId) ?? null} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProvinceCard({
  p,
  governor,
}: {
  p: Province;
  governor: { id: string; name: string; crestSeed: number; accentColor: string } | null;
}) {
  const pool = provinceManpowerPool(p);
  const localRes = STRATEGIC_RESOURCES.filter((r) => (p.resources[r] ?? 0) > 0);
  return (
    <div className={`province-card owner-${p.owner}`}>
      <div className="province-head">
        <div>
          <div className="province-name">{p.name}</div>
          <div className="province-spec">{SPECIALTY_LABELS[p.specialty]}</div>
        </div>
        {governor && (
          <div className="province-gov" title={`Губернатор: ${governor.name}`}>
            <Portrait characterKey={governor.id} size={40} shape="card" crestSeed={governor.crestSeed} accent={governor.accentColor} />
            <span className="muted">{governor.name.replace(/^Сэр |^Леди /, "")}</span>
          </div>
        )}
      </div>

      <div className="province-pop">
        <span>👥 {p.population.toLocaleString("ru-RU")}</span>
        <span className="muted">
          крестьяне {p.cohorts.peasants} · ремесл. {p.cohorts.artisans} · ополчение {p.cohorts.militia} · знать {p.cohorts.nobles}
        </span>
      </div>

      <div className="province-indicators">
        {IND_ROWS.map((row) => {
          const v = p.indicators[row.key];
          const ok = row.good === "high" ? v >= 55 : v <= 35;
          return (
            <div className="pind" key={row.key}>
              <span className="pind-l">{row.label}</span>
              <span className="pind-bar">
                <span className={`pind-fill ${ok ? "ok" : "bad"}`} style={{ width: `${v}%` }} />
              </span>
              <span className="pind-v">{Math.round(v)}</span>
            </div>
          );
        })}
      </div>

      <div className="province-foot">
        <span className="prov-chip">Лояльность {Math.round(p.loyalty)}</span>
        <span className="prov-chip">Плодородие {Math.round(p.fertility)}</span>
        <span className="prov-chip">Дороги {Math.round(p.infrastructure)}</span>
        <span className="prov-chip">Резерв {pool}</span>
      </div>

      <div className="province-policies muted">
        Налог: {TAX_LABELS[p.tax]} · Рационы: {RATION_LABELS[p.ration]} · Призыв: {CONSCRIPTION_LABELS[p.conscription]}
      </div>

      {localRes.length > 0 && (
        <div className="province-res">
          {localRes.map((r) => (
            <span key={r} className="prov-res-chip">
              {RESOURCE_LABELS[r]} {Math.round(p.resources[r] ?? 0)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
