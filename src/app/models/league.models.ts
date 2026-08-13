export interface League {
  country: {
    name: string;
  };

  league: {
    id: number;
    name: string;
    type: string;
  };
}

export interface LeaguesResponse {
  response: League[];
}
