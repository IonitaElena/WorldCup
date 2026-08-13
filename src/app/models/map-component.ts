interface MapTeam {
  id: string | number;
  team_id?: string;
  name_en: string;
  iso2?: string;
  flag?: string;
  lat: number;
  lng: number;

  code?: string;
}

interface Player {
  id: number;
  name: string;
  photo?: string;
  number?: number;
  position?: string;
  age?: number;
  stats?: PlayerStats;
}

interface PlayerStats {
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

interface TeamDetails {
  team: MapTeam;
  players: unknown;
  coach: unknown;
}

interface PlayerStatsResponse {
  response: Array<{
    statistics?: PlayerStats[];
  }>;
}

interface TeamApiResponse {
  response: Array<{
    team: {
      id: number;
      name: string;
    };
  }>;
}
