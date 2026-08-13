export interface MapPlayer {
  id: number;
  name: string;
  photo?: string;
  number?: number;
  position?: string;
  age?: number;
  stats?: PlayerStats;
}

export interface PlayerStats {
  games?: {
    appearences?: number;
    minutes?: number;
    rating?: string;
  };

  goals?: {
    total?: number;
    assists?: number;
  };

  cards?: {
    yellow?: number;
    red?: number;
  };
}

export interface MapTeam {
  id: string | number;
  team_id?: string;
  name_en: string;
  iso2?: string;
  flag?: string;
  lat: number;
  lng: number;
  code?: string;
}

export interface SquadResponse {
  response: Array<{
    players: MapPlayer[];
  }>;
}

export interface CoachResponse {
  response: Array<{
    name: string;
    photo?: string;
    age?: number;
    nationality?: string;
  }>;
}

export interface TeamDetails {
  team: MapTeam;
  players: SquadResponse;
  coach: CoachResponse;
}
