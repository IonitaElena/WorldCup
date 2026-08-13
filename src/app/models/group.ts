export interface GroupResponse {
  groups: Group[];
}

export interface Group {
  _id: string;
  name: string;
  teams: TeamStanding[];
}

export interface TeamStanding {
  _id: string;
  team_id: string;
  mp: string;
  w: string;
  d: string;
  l: string;
  pts: string;
  gf: string;
  ga: string;
  gd: string;
  teamName?: string;
  countryCode?: string;
  lastFive?: MatchResult[];
}

export type MatchResult = 'WIN' | 'DRAW' | 'LOSE' | 'NONE';

export interface Team {
  id: string | number;
  name_en: string;
  iso2?: string;
  flag?: string;
}

export interface TeamsResponse {
  teams: Team[];
}
