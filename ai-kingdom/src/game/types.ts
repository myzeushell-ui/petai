/**
 * AI Kingdom — canonical type contract.
 *
 * This file is the single source of truth for every subsystem. Game logic
 * (pure functions) and the React UI both depend on these types, but never the
 * other way around. Keep this file free of runtime logic beyond constants that
 * are genuinely part of the data contract.
 */

/* ------------------------------------------------------------------ */
/* Primitive unions                                                    */
/* ------------------------------------------------------------------ */

export type Side = "player" | "enemy";

export type UnitType = "spearmen" | "archers" | "cavalry";

export type LocationType =
  | "castle"
  | "bridge"
  | "forest"
  | "village"
  | "hills"
  | "enemy_camp"
  | "road"
  | "field";

export type Faction = "player" | "enemy" | "neutral" | "contested";

/** Every action the local command interpreter can recognise. */
export type OrderAction =
  | "MOVE"
  | "DEFEND"
  | "ATTACK"
  | "HOLD"
  | "SCOUT"
  | "SUPPLY"
  | "RETREAT"
  | "WAIT"
  | "AMBUSH"
  | "PROTECT"
  | "EVACUATE"
  | "REINFORCE"
  | "CANCEL_ORDER"
  | "CHANGE_ORDER"
  | "ASK_STATUS"
  | "ASK_ADVICE"
  | "SUMMON_OFFICER"
  | "PRISONER_DECISION"
  | "UNKNOWN";

/** Lifecycle of a formal order object. */
export type OrderStatus =
  | "draft"
  | "awaiting_confirmation"
  | "accepted"
  | "preparing"
  | "moving"
  | "executing"
  | "completed"
  | "failed"
  | "cancelled"
  | "disobeyed"
  | "interrupted";

export type RiskLevel = "none" | "low" | "medium" | "high" | "extreme";

export type UnitState =
  | "idle"
  | "preparing"
  | "moving"
  | "holding"
  | "fighting"
  | "retreating"
  | "routed"
  | "destroyed";

export type InjuryLevel = "none" | "light" | "heavy" | "dead";
export type PermanentInjury = "none" | "eye" | "arm" | "limp";

export type SpeechStyle = "stoic" | "brash" | "analytic";

/** How an officer responds to a dangerous order. */
export type AcceptanceOutcome = "accept" | "warn" | "refuse";

export type GamePhase =
  | "menu"
  | "briefing"
  | "playing"
  | "prisoner"
  | "ended";

export type GameSpeed = 0 | 1 | 2 | 4;

/* ------------------------------------------------------------------ */
/* Officers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Personality + condition parameters. All on a 0..100 scale so behaviour code
 * can compare and blend them uniformly. These are not decorative: officer
 * acceptance, initiative and dialogue all read from here.
 */
export interface OfficerTraits {
  loyalty: number;
  courage: number;
  caution: number;
  ambition: number;
  discipline: number;
  initiative: number;
  competence: number;
  stress: number;
  respectForPlayer: number;
  resentment: number;
  fatigue: number;
}

export interface Officer {
  id: string;
  name: string;
  title: string;
  /** Short role label used in the UI. */
  role: string;
  /** Deterministic seed for the procedural crest/portrait. */
  crestSeed: number;
  accentColor: string;
  bio: string;
  character: string;
  competencies: string[];
  traits: OfficerTraits;
  speechStyle: SpeechStyle;
  /** Human-readable current task, kept in sync with the active order. */
  currentTask: string;
  /** Unit groups this officer currently commands. */
  commandedUnitIds: string[];
  /** Location the officer is personally at. */
  locationId: string;
  injury: InjuryLevel;
  permanentInjury: PermanentInjury;
  alive: boolean;
  /** Recent important events, newest last. Persisted with the game. */
  memory: MemoryEvent[];
  /** Set when the officer is awaiting the player's answer to a proposal. */
  pendingInitiativeOrderId?: string;
}

/* ------------------------------------------------------------------ */
/* Units                                                               */
/* ------------------------------------------------------------------ */

export interface UnitGroup {
  id: string;
  side: Side;
  type: UnitType;
  count: number;
  /** 0..100 */
  morale: number;
  /** 0..100 — higher = more tired. */
  fatigue: number;
  /** 0..100 — supply level; low supply erodes morale. */
  supply: number;
  locationId: string;
  commanderId: string | null;
  orderId: string | null;
  state: UnitState;
  /** For enemy fog-of-war: has the player's scouting revealed this group? */
  revealed: boolean;
  /** Movement bookkeeping (game minutes). */
  moveFromId?: string;
  moveToId?: string;
  moveProgress?: number; // 0..1 of the current road hop
  /** Remaining waypoints after moveToId (multi-hop paths). */
  movePath?: string[];
  /** Where the group ultimately intends to arrive. */
  moveDestId?: string;
}

/* ------------------------------------------------------------------ */
/* Locations                                                           */
/* ------------------------------------------------------------------ */

export interface LocationEffects {
  /** Multiplier applied to defenders here. 1 = neutral. */
  defenseBonus: number;
  /** Multiplier applied to archers here. */
  archerBonus: number;
  /** Multiplier applied to cavalry attacking here (<1 = penalty). */
  cavalryModifier: number;
  /** Movement speed multiplier for troops crossing/leaving. */
  speedModifier: number;
  /** Troops here are hidden from the enemy unless engaged. */
  hidesTroops: boolean;
  /** Grants vision over neighbouring locations. */
  grantsVision: boolean;
  /** Only a narrow front can fight here (limits attacker numbers). */
  chokePoint: boolean;
}

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  /** Map coordinates as percentages (0..100) of the map area. */
  x: number;
  y: number;
  description: string;
  controlledBy: Faction;
  effects: LocationEffects;
  /** Food stored at this location (e.g. the village). */
  foodStore: number;
  /** Roads to other locations with travel distance in game minutes. */
  roads: RoadLink[];
  /** True for the castle — losing it loses the game. */
  isObjective: boolean;
}

export interface RoadLink {
  to: string;
  /** Base travel time in game minutes at normal speed. */
  distance: number;
}

/* ------------------------------------------------------------------ */
/* Orders & command interpretation                                     */
/* ------------------------------------------------------------------ */

/** Structured interpretation produced by the CommandInterpreter. */
export interface ParsedCommand {
  action: OrderAction;
  officerId: string | null;
  targetLocationId: string | null;
  unitType: UnitType | null;
  unitCount: number | null;
  /** Free conditions like "until dawn", "hold at all costs". */
  conditions: OrderCondition[];
  /** 0..1 confidence in the interpretation. */
  confidence: number;
  /** True if the player said "all/whole force" rather than a number. */
  takeAll: boolean;
  /** Field names still required to make the order actionable. */
  missing: MissingField[];
  risk: RiskLevel;
  /** True for pure information requests that need no confirmation. */
  isQuestion: boolean;
  rawText: string;
  /** Human-readable one line of what the system understood. */
  summary: string;
}

export type MissingField =
  | "officer"
  | "action"
  | "target"
  | "unitCount"
  | "unitType";

export type OrderCondition =
  | "until_dawn"
  | "at_all_costs"
  | "hold_position"
  | "avoid_losses"
  | "on_my_command"
  | "quietly";

export interface OrderResult {
  success: boolean;
  summary: string;
  casualties?: number;
  memoryEvents?: MemoryEventType[];
}

export interface Order {
  id: string;
  officerId: string;
  action: OrderAction;
  targetLocationId: string | null;
  unitType: UnitType | null;
  unitCount: number | null;
  /** Actual unit groups assigned once accepted. */
  unitGroupIds: string[];
  conditions: OrderCondition[];
  priority: number;
  createdAt: number;
  startedAt: number | null;
  expectedCompletion: number | null;
  status: OrderStatus;
  risk: RiskLevel;
  sourceText: string;
  parsed: ParsedCommand;
  result: OrderResult | null;
  /** Set when the officer replaced/updated a previous order. */
  supersedesOrderId?: string;
  /** True if the officer generated this order himself (initiative). */
  officerInitiated?: boolean;
  /** Explanation shown in the journal for initiative-driven orders. */
  initiativeReason?: string;
  /** The officer warned the player about this order before accepting. */
  warned?: boolean;
  /** The officer judged this order likely to be very costly. */
  flaggedSuicidal?: boolean;
}

/* ------------------------------------------------------------------ */
/* Memory                                                              */
/* ------------------------------------------------------------------ */

export type MemoryEventType =
  | "PLAYER_TRUSTED_ME_WITH_IMPORTANT_COMMAND"
  | "PLAYER_IGNORED_MY_WARNING"
  | "PLAYER_SAVED_MY_SOLDIERS"
  | "PLAYER_ORDERED_SUICIDAL_DEFENSE"
  | "PLAYER_GAVE_GLORY_TO_RIVAL"
  | "PLAYER_REWARDED_ME"
  | "PLAYER_BLAMED_ME_UNFAIRLY"
  | "PLAYER_SPARED_ENEMY_COMMANDER"
  | "PLAYER_EXECUTED_PRISONER"
  | "PLAYER_RECRUITED_ENEMY_COMMANDER"
  | "PLAYER_IMPRISONED_COMMANDER"
  | "I_WON_MAJOR_BATTLE"
  | "I_LOST_MANY_SOLDIERS"
  | "I_DISOBEYED_ORDER"
  | "PLAYER_FORGAVE_DISOBEDIENCE"
  | "PLAYER_LISTENED_TO_ME"
  | "PLAYER_TRUSTED_MY_INITIATIVE";

export interface MemoryEvent {
  id: string;
  type: MemoryEventType;
  tick: number;
  description: string;
  /** 0..1 — how strongly this colours the officer's mood. */
  emotionalWeight: number;
  loyaltyDelta: number;
  respectDelta: number;
  resentmentDelta: number;
  relatedOfficerId: string | null;
  relatedOrderId: string | null;
}

/* ------------------------------------------------------------------ */
/* World events & dialogue                                             */
/* ------------------------------------------------------------------ */

export type WorldEventKind =
  | "narrative"
  | "report"
  | "warning"
  | "battle"
  | "initiative_request"
  | "enemy_move"
  | "scout_result"
  | "supply"
  | "casualty"
  | "victory"
  | "defeat";

export interface EventChoice {
  id: string;
  label: string;
}

export interface WorldEvent {
  id: string;
  tick: number;
  kind: WorldEventKind;
  severity: "info" | "notable" | "critical";
  title: string;
  message: string;
  officerId: string | null;
  locationId: string | null;
  /** Auto-pauses the game so the player can react. */
  requiresPause: boolean;
  handled: boolean;
}

export type DialogueSpeaker = "player" | "narrator" | "system" | string; // or officerId

export type DialogueKind =
  | "order"
  | "report"
  | "question"
  | "advice"
  | "ambient"
  | "confirm"
  | "system"
  | "briefing";

export interface DialogueMessage {
  id: string;
  tick: number;
  speaker: DialogueSpeaker;
  officerId: string | null;
  text: string;
  kind: DialogueKind;
}

/* ------------------------------------------------------------------ */
/* Battle                                                              */
/* ------------------------------------------------------------------ */

export interface BattleRoundLog {
  tick: number;
  text: string;
}

export interface Battle {
  id: string;
  locationId: string;
  startedAt: number;
  status: "active" | "player_won" | "enemy_won" | "stalemate" | "ended";
  /** Which side holds the ground and gets the terrain defence bonus. */
  defenderSide: Side;
  playerGroupIds: string[];
  enemyGroupIds: string[];
  /** -100..100. Positive favours the player. */
  momentum: number;
  playerCasualties: number;
  enemyCasualties: number;
  rounds: number;
  log: BattleRoundLog[];
  /** Fires an initiative opportunity check for flanking officers. */
  flankOpportunity: boolean;
  /** Accumulates game minutes until the next round resolves. */
  roundTimer: number;
  /** Officer id whose initiative has already been offered for this battle. */
  initiativeOfferedTo?: string;
}

/* ------------------------------------------------------------------ */
/* Enemy                                                               */
/* ------------------------------------------------------------------ */

export interface EnemyState {
  commanderName: string;
  /** Scenario-script phase. */
  scriptPhase: string;
  /** Actual total strength (hidden until revealed). */
  trueStrength: number;
  /** Player's current best estimate from scouting. */
  estimatedStrength: number | null;
  /** How much intel the player has gathered (0..1). */
  intelLevel: number;
  approachRoute: string[];
  /** Whether a village raid detachment has been dispatched. */
  raidDispatched: boolean;
  /** Whether the enemy has been provoked/ambushed and rerouted. */
  rerouted: boolean;
  routed: boolean;
}

/* ------------------------------------------------------------------ */
/* Prisoner & outcome                                                  */
/* ------------------------------------------------------------------ */

export type PrisonerDecision =
  | "execute"
  | "imprison"
  | "release"
  | "recruit";

export interface PrisonerState {
  commanderName: string;
  captured: boolean;
  /** The prisoner's respect for the player, shaped by how the battle ended. */
  respectForPlayer: number;
  decided: boolean;
  decision: PrisonerDecision | null;
  recruitSucceeded: boolean | null;
}

export type OutcomeKind =
  | "decisive_victory"
  | "tactical_victory"
  | "costly_victory"
  | "pyrrhic_victory"
  | "defeat_castle_lost"
  | "defeat_army_broken"
  | "in_progress";

export interface GameOutcome {
  kind: OutcomeKind;
  title: string;
  summary: string;
  /** Bullet lines shown in the end report. */
  highlights: string[];
}

/* ------------------------------------------------------------------ */
/* Settings, tutorial, log                                             */
/* ------------------------------------------------------------------ */

export interface GameSettings {
  voiceInput: boolean;
  voiceOutput: boolean;
  speechLang: string;
}

export interface TutorialState {
  active: boolean;
  step: number;
  completed: boolean;
}

export interface LogEntry {
  id: string;
  tick: number;
  kind: WorldEventKind | "order" | "system";
  text: string;
  severity: "info" | "notable" | "critical";
}

/* ------------------------------------------------------------------ */
/* Root game state                                                     */
/* ------------------------------------------------------------------ */

export interface Resources {
  food: number;
  kingdomMorale: number;
  castleIntegrity: number;
  villageIntegrity: number;
}

export interface GameState {
  /** Save-schema version; bump when the shape changes incompatibly. */
  version: number;
  scenarioId: string;
  kingdomName: string;
  seed: number;
  /** Current mulberry32 RNG state. Advancing it is the only entropy source. */
  rngState: number;
  /** Elapsed game minutes since scenario start. */
  tick: number;
  /** Game minutes remaining until dawn (win timer). */
  timeUntilDawn: number;
  phase: GamePhase;
  speed: GameSpeed;

  resources: Resources;

  officers: Officer[];
  units: UnitGroup[];
  locations: Location[];
  orders: Order[];
  events: WorldEvent[];
  dialogue: DialogueMessage[];
  battles: Battle[];
  log: LogEntry[];

  enemy: EnemyState;
  prisoner: PrisonerState | null;
  outcome: GameOutcome;

  /** Resolved balance numbers from the scenario, carried for the simulation. */
  balance: BalanceConfig;

  selectedOfficerId: string | null;
  selectedLocationId: string | null;

  /**
   * A partially parsed command waiting on clarification (e.g. the player said
   * "go to the bridge" without a troop count). The next reply is merged in.
   */
  pendingClarification: PendingClarification | null;

  settings: GameSettings;
  tutorial: TutorialState;

  /** Scenario scripting flags. */
  flags: Record<string, boolean | number>;

  /** Monotonic id counter — keeps ids deterministic and save-safe. */
  idCounter: number;
  lastUpdated: number;
}

export interface PendingClarification {
  partial: ParsedCommand;
  officerId: string;
  /** The single field we are asking the player to supply. */
  awaiting: MissingField;
  askedAtTick: number;
}

/* ------------------------------------------------------------------ */
/* Scenario configuration                                              */
/* ------------------------------------------------------------------ */

export interface ScenarioOfficerConfig {
  id: string;
  name: string;
  title: string;
  role: string;
  crestSeed: number;
  accentColor: string;
  bio: string;
  character: string;
  competencies: string[];
  traits: OfficerTraits;
  speechStyle: SpeechStyle;
  startLocationId: string;
  /** Unit groups initially under this officer. */
  units: ScenarioUnitConfig[];
}

export interface ScenarioUnitConfig {
  type: UnitType;
  count: number;
  morale: number;
}

export interface ScenarioConfig {
  id: string;
  name: string;
  kingdomName: string;
  description: string;
  intro: string;
  seed: number;
  /** Total scenario length in game minutes (time until dawn). */
  durationMinutes: number;
  startResources: Resources;
  locations: Location[];
  officers: ScenarioOfficerConfig[];
  enemy: {
    commanderName: string;
    trueStrength: number;
    approachRoute: string[];
    composition: { spearmen: number; archers: number; cavalry: number };
  };
  /** Timed scripted world events (ticks are game minutes). */
  scriptedEvents: ScriptedEvent[];
  balance: BalanceConfig;
}

export interface ScriptedEvent {
  atTick: number;
  id: string;
  kind: WorldEventKind;
  severity: "info" | "notable" | "critical";
  title: string;
  message: string;
  requiresPause: boolean;
}

export interface BalanceConfig {
  /** Base combat power per soldier by unit type. */
  attack: Record<UnitType, number>;
  defense: Record<UnitType, number>;
  /** Base movement minutes per distance unit by type (lower = faster). */
  speed: Record<UnitType, number>;
  /** Supply consumed per soldier per game hour. */
  supplyDrain: number;
  /** Food eaten per 100 soldiers per game hour. */
  foodDrain: number;
  /** Fraction of the strength gap converted to casualties per battle round. */
  casualtyRate: number;
}

/* ------------------------------------------------------------------ */
/* Subsystem interfaces (adapters)                                     */
/* ------------------------------------------------------------------ */

/**
 * Turns natural-language text into a structured ParsedCommand. The local
 * implementation uses dictionaries + regex; a future adapter can call an LLM.
 */
export interface CommandInterpreter {
  parse(text: string, context: InterpreterContext): ParsedCommand;
}

export interface InterpreterContext {
  officers: Officer[];
  locations: Location[];
  units: UnitGroup[];
  /** The officer the player is currently talking to, if any. */
  activeOfficerId: string | null;
  /** The location the player has selected as spatial context ("here"). */
  selectedLocationId: string | null;
  /** A clarification we are waiting on, to merge follow-up answers. */
  pending: PendingClarification | null;
}

/** Produces human dialogue text from a structured game situation. */
export interface DialogueProvider {
  officerAcknowledge(ctx: DialogueContext): string;
  officerWarning(ctx: DialogueContext): string;
  officerQuestion(ctx: DialogueContext, field: MissingField): string;
  officerReport(ctx: DialogueContext): string;
  officerStatus(ctx: DialogueContext): string;
  officerAdvice(ctx: DialogueContext): string;
  officerInitiative(ctx: DialogueContext): string;
}

export interface DialogueContext {
  officer: Officer;
  order?: Order;
  state: GameState;
  extra?: Record<string, string | number>;
}

/** Voice input adapter (browser Web Speech API in v1). */
export interface SpeechInputProvider {
  isSupported(): boolean;
  start(handlers: SpeechInputHandlers): void;
  stop(): void;
}

export interface SpeechInputHandlers {
  onInterim: (text: string) => void;
  onFinal: (text: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

/** Voice output adapter (browser SpeechSynthesis in v1). */
export interface SpeechOutputProvider {
  isSupported(): boolean;
  speak(text: string, lang: string): void;
  cancel(): void;
}
