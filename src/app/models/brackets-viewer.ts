export interface BracketParticipant {
  id: number;
  tournament_id: number;
  name: string;
  flag?: string;
}

export interface BracketOpponent {
  id: number | null;
  position: number;
  score?: number;
  source?: number;
}

export interface BracketMatch {
  id: number;
  number: number;
  stage_id: number;
  group_id: number;
  round_id: number;
  child_count: number;
  status: number;
  opponent1: BracketOpponent;
  opponent2: BracketOpponent;
}

export interface BracketStage {
  id: number;
  tournament_id: number;
  name: string;
  type: string;
  number: number;
  settings: {
    size: number;
    skipFirstRound: boolean;
    grandFinal: boolean;
    consolationFinal: boolean;
  };
}

export interface BracketGroup {
  id: number;
  stage_id: number;
  number: number;
  size: number;
}

export interface BracketRound {
  id: number;
  stage_id: number;
  group_id: number;
  number: number;
  name: string;
}

export interface BracketData {
  stages: BracketStage[];
  groups: BracketGroup[];
  rounds: BracketRound[];
  matches: BracketMatch[];
  participants: BracketParticipant[];
  matchGames: unknown[];
}

export interface BracketViewerConfig {
  selector: string;
  clear: boolean;
}

declare global {
  interface Window {
    bracketsViewer: {
      render: (data: BracketData, config: BracketViewerConfig) => void;
    };
  }
}

export {};
