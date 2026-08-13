export interface LocalMatch {
  id?: string | number;
  home_team_id?: string | number;
  away_team_id?: string | number;

  home_team_name_en?: string;
  away_team_name_en?: string;

  home_score?: string | number;
  away_score?: string | number;

  home_scorers?: string;
  away_scorers?: string;

  home_penalty_score?: string | number;
  away_penalty_score?: string | number;

  home_penalty_scorers?: string;
  away_penalty_scorers?: string;

  home_penalty_misses?: string;
  away_penalty_misses?: string;

  group?: string | number;
  matchday?: string | number;
  local_date?: string;

  type?: string;
  finished?: string | boolean;

  stadium_id?: string | number;

  home_team_label?: string;
  away_team_label?: string;
}
