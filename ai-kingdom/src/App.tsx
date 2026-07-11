import { useEffect, useState } from "react";
import { useGame } from "./state/GameContext";
import MainMenu from "./components/MainMenu";
import TopBar from "./components/TopBar";
import OfficerPanel from "./components/OfficerPanel";
import StrategicMap from "./components/StrategicMap";
import ConversationPanel from "./components/ConversationPanel";
import EventLogPanel from "./components/EventLogPanel";
import OrderConfirmModal from "./components/OrderConfirmModal";
import ReportBanner from "./components/ReportBanner";
import Tutorial from "./components/Tutorial";
import Briefing from "./components/Briefing";
import PrisonerScene from "./components/PrisonerScene";
import EndReport from "./components/EndReport";
import SettingsMenu from "./components/SettingsMenu";
import DebugPanel from "./components/DebugPanel";
import BattleScene from "./components/BattleScene";
import "./styles/map.css";

export default function App() {
  const g = useGame();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);

  const phase = g.state?.phase;
  const playing = phase === "playing";

  // Keyboard shortcuts: Space = pause/resume, ` = debug panel, Esc = close overlays.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "TEXTAREA" || tag === "INPUT";
      if (e.key === "Escape") {
        setSettingsOpen(false);
        setDebugOpen(false);
        return;
      }
      if (e.key === "`") {
        e.preventDefault();
        setDebugOpen((v) => !v);
        return;
      }
      if (!typing && e.code === "Space" && playing) {
        e.preventDefault();
        g.setSpeed(g.state!.speed === 0 ? 1 : 0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [g, playing]);

  if (!g.state) return <MainMenu />;

  return (
    <>
      <div className="shell">
        <div className="area-top">
          <TopBar onOpenSettings={() => setSettingsOpen(true)} onOpenDebug={() => setDebugOpen(true)} />
        </div>
        <div className="area-left">
          <OfficerPanel />
        </div>
        <div className="area-map">
          <StrategicMap />
        </div>
        <div className="area-right">
          <ConversationPanel />
        </div>
        <div className="area-bottom">
          <EventLogPanel />
        </div>
      </div>

      <ReportBanner />
      <Tutorial />
      {g.state.viewBattleId && <BattleScene />}
      <OrderConfirmModal />
      {phase === "briefing" && <Briefing />}
      {phase === "prisoner" && <PrisonerScene />}
      {phase === "ended" && <EndReport />}
      <SettingsMenu open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <DebugPanel open={debugOpen} onClose={() => setDebugOpen(false)} />
    </>
  );
}
