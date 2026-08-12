export interface PlayerStatistic {
  player: {
    id: number;
    name: string;
    photo?: string;
  };

  team?: {
    id: number;
    name: string;
    logo?: string;
  };

  statistics?: Array<{
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

    shots?: {
      total?: number;
      on?: number;
    };
  }>;
}

export interface Fixture {
  fixture?: {
    id?: number;
    date?: string;

    status?: {
      short?: string;
      long?: string;
    };
  };

  teams?: {
    home?: {
      id?: number;
      name?: string;
      logo?: string;
      winner?: boolean | null;
    };

    away?: {
      id?: number;
      name?: string;
      logo?: string;
      winner?: boolean | null;
    };
  };

  goals?: {
    home?: number;
    away?: number;
  };
}
