export interface FantasyPlayer {
  id: number;
  name: string;
  photo?: string;
  team?: string;
  position?: string;
  age?: number;
  number?: number;
}

export interface ApiPlayer {
  player: {
    id: number;
    name: string;
    photo: string;
  };
}

export interface PlayersResponse {
  response: ApiPlayer[];
}
