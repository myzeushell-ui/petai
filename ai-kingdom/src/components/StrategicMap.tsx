import { useMemo, useState } from "react";
import { useGame } from "../state/GameContext";
import { LocationIcon, UNIT_GLYPH } from "./icons";
import MapCanvas from "./MapCanvas";
import { LOCATION_TYPE_LABELS, UNIT_LABELS } from "../game/constants";
import { getScenario } from "../game/scenario";
import type { Location, UnitGroup } from "../game/types";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function StrategicMap() {
  const g = useGame();
  const s = g.state!;
  const [hover, setHover] = useState<string | null>(null);

  const locById = useMemo(() => new Map(s.locations.map((l) => [l.id, l])), [s.locations]);

  // Marker screen position (interpolated for moving groups) + fan-out offsets.
  const markers = useMemo(() => {
    const visible = s.units.filter(
      (u) => u.count > 0 && (u.side === "player" || u.revealed) && u.state !== "destroyed",
    );
    const clusterCount: Record<string, number> = {};
    return visible.map((u) => {
      const pos = markerPos(u, locById);
      const key = `${Math.round(pos.x)}_${Math.round(pos.y)}`;
      const idx = clusterCount[key] ?? 0;
      clusterCount[key] = idx + 1;
      const angle = idx * 2.2;
      return {
        u,
        x: pos.x + Math.cos(angle) * (idx ? 3.2 : 0),
        y: pos.y + Math.sin(angle) * (idx ? 3.2 : 0) - 5.5,
      };
    });
  }, [s.units, locById]);

  const activeBattles = new Set(s.battles.filter((b) => b.status === "active").map((b) => b.locationId));
  const hoverLoc = hover ? locById.get(hover) : null;

  // Positions lit by our fires (torch glow on the drawn map).
  const heldIds = useMemo(
    () =>
      [
        ...new Set(
          s.units
            .filter((u) => u.side === "player" && u.count > 0 && u.state !== "moving")
            .map((u) => u.locationId),
        ),
      ],
    [s.units],
  );
  const durationMinutes = getScenario(s.scenarioId).durationMinutes;

  return (
    <div className="panel" style={{ padding: 0 }}>
      <div className="map-wrap">
        <MapCanvas
          locations={s.locations}
          heldIds={heldIds}
          battleIds={[...activeBattles]}
          intelLevel={s.enemy.intelLevel}
          timeUntilDawn={s.timeUntilDawn}
          durationMinutes={durationMinutes}
          villageRaided={Boolean(s.flags.villageRaided)}
        />

        {s.locations.map((loc) => {
          const ctrl = loc.controlledBy;
          return (
            <div
              key={loc.id}
              className={`loc-node ctrl-${ctrl} ${loc.isObjective ? "objective" : ""} ${
                s.selectedLocationId === loc.id ? "selected" : ""
              }`}
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              onClick={() => g.selectLocation(s.selectedLocationId === loc.id ? null : loc.id)}
              onMouseEnter={() => setHover(loc.id)}
              onMouseLeave={() => setHover((h) => (h === loc.id ? null : h))}
            >
              <div className="loc-disc">
                <LocationIcon type={loc.type} />
                {activeBattles.has(loc.id) && <div className="battle-ring" />}
              </div>
              <div className="loc-label">{loc.name}</div>
            </div>
          );
        })}

        {markers.map(({ u, x, y }) => (
          <div
            key={u.id}
            className={`marker ${u.side} ${u.state} ${u.side === "enemy" && !u.revealed ? "hidden" : ""}`}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span className="pip">{UNIT_GLYPH[u.type]}</span>
            <span>{u.count}</span>
            <span className="mor">
              <span style={{ width: `${u.morale}%` }} />
            </span>
          </div>
        ))}

        {hoverLoc && <MapTip loc={hoverLoc} units={s.units} />}

        <div className="map-legend">
          <span className="lg"><span className="sw" style={{ background: "var(--green)" }} />наши</span>
          <span className="lg"><span className="sw" style={{ background: "var(--red-bright)" }} />враг</span>
          <span className="lg"><span className="sw" style={{ background: "var(--gold)" }} />цель</span>
          {s.selectedLocationId && (
            <span className="lg" style={{ color: "var(--gold-bright)" }}>
              выбрано: {locById.get(s.selectedLocationId)?.name} (скажите «сюда»)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function markerPos(u: UnitGroup, locById: Map<string, Location>): { x: number; y: number } {
  if (u.state === "moving" && u.moveFromId && u.moveToId && u.moveProgress != null) {
    const a = locById.get(u.moveFromId);
    const b = locById.get(u.moveToId);
    if (a && b) return { x: lerp(a.x, b.x, u.moveProgress), y: lerp(a.y, b.y, u.moveProgress) };
  }
  const loc = locById.get(u.locationId);
  return { x: loc?.x ?? 50, y: loc?.y ?? 50 };
}

function MapTip({ loc, units }: { loc: Location; units: UnitGroup[] }) {
  const here = units.filter((u) => u.count > 0 && u.locationId === loc.id && (u.side === "player" || u.revealed));
  const eff = loc.effects;
  const tags: string[] = [];
  if (eff.defenseBonus > 1.1) tags.push(`оборона ×${eff.defenseBonus}`);
  if (eff.archerBonus > 1.1) tags.push(`лучники ×${eff.archerBonus}`);
  if (eff.chokePoint) tags.push("узкий проход");
  if (eff.hidesTroops) tags.push("укрытие");
  if (eff.grantsVision) tags.push("обзор");
  if (loc.foodStore > 0) tags.push(`припасы ${loc.foodStore}`);
  return (
    <div className="map-tip" style={{ left: `${loc.x}%`, top: `${loc.y}%` }}>
      <div className="tt-name">{loc.name}</div>
      <div className="tt-type">{LOCATION_TYPE_LABELS[loc.type]}</div>
      <div className="tt-desc">{loc.description}</div>
      {tags.length > 0 && (
        <div className="tt-stats">
          {tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      )}
      {here.length > 0 && (
        <div className="tt-stats">
          {here.map((u) => (
            <span key={u.id} style={{ color: u.side === "enemy" ? "var(--red-bright)" : "var(--green)" }}>
              {u.count} {UNIT_LABELS[u.type].toLowerCase()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
