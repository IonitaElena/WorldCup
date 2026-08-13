export interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;

  home_team_name_en: string;
  away_team_name_en: string;

  home_score: string;
  away_score: string;

  home_scorers?: string;
  away_scorers?: string;

  home_penalty_score?: string;
  away_penalty_score?: string;

  home_penalty_scorers?: string;
  away_penalty_scorers?: string;

  home_penalty_misses?: string;
  away_penalty_misses?: string;

  group: string;
  matchday: string;

  local_date: string;
  type: string;
  finished: string;

  awayFlag?: string;
  stadium_id?: string;
  home_team_label?: string;
  away_team_label?: string;
}

export interface MatchGroup {
  groupName: string;
  matches: Match[];
}

export interface MatchHistoryGroup {
  title: string;
  groups: MatchGroup[];
}
