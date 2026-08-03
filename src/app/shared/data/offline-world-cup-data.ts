import { Group, MatchResult, TeamStanding } from '../../models/group';
import { Match } from '../../models/match';
import { Stadium } from '../../models/stadium';
import { MOCK_PLAYERS } from './mock-players';

type OfflineTeam = {
  id: string;
  name_en: string;
  iso2: string;
  flag: string;
};

type OfflineStandingInput = {
  mp: string;
  w: string;
  d: string;
  l: string;
  pts: string;
  gf: string;
  ga: string;
  gd: string;
  lastFive?: MatchResult[];
};

const flagPath = (code: string) => `/flags/${code}.png`;

const offlineTeams: OfflineTeam[] = [
  { id: '1', name_en: 'Argentina', iso2: 'ar', flag: flagPath('ar') },
  { id: '2', name_en: 'France', iso2: 'fr', flag: flagPath('fr') },
  { id: '3', name_en: 'Spain', iso2: 'es', flag: flagPath('es') },
  { id: '4', name_en: 'Belgium', iso2: 'be', flag: flagPath('be') },
  { id: '5', name_en: 'England', iso2: 'gb-eng', flag: flagPath('eng') },
  { id: '6', name_en: 'Morocco', iso2: 'ma', flag: flagPath('ma') },
  { id: '7', name_en: 'Norway', iso2: 'no', flag: flagPath('no') },
  { id: '8', name_en: 'Switzerland', iso2: 'ch', flag: flagPath('sw') },
];

const makeMatch = (
  id: string,
  homeTeamId: string,
  awayTeamId: string,
  homeScore: string,
  awayScore: string,
  type: string,
  group: string,
  localDate: string,
  stadiumId?: string,
): Match => {
  const homeTeam = offlineTeams.find((team) => team.id === homeTeamId)!;
  const awayTeam = offlineTeams.find((team) => team.id === awayTeamId)!;

  return {
    id,
    home_team_id: homeTeamId,
    away_team_id: awayTeamId,
    home_team_name_en: homeTeam.name_en,
    away_team_name_en: awayTeam.name_en,
    home_score: homeScore,
    away_score: awayScore,
    group,
    matchday: '1',
    local_date: localDate,
    type,
    finished: 'TRUE',
    stadium_id: stadiumId,
  };
};

const createStanding = (team: OfflineTeam, stats: OfflineStandingInput): TeamStanding => ({
  _id: team.id,
  team_id: team.id,
  mp: stats.mp,
  w: stats.w,
  d: stats.d,
  l: stats.l,
  pts: stats.pts,
  gf: stats.gf,
  ga: stats.ga,
  gd: stats.gd,
  teamName: team.name_en,
  countryCode: team.iso2,
  lastFive: stats.lastFive ?? ['WIN', 'DRAW', 'LOSE', 'NONE', 'NONE'],
});

export const OFFLINE_TEAMS = offlineTeams;

export const OFFLINE_MATCHES: Match[] = [
  // Grupe
  makeMatch('1', '1', '2', '2', '1', 'group', 'A', '01/07/2026 18:00', '1'),
  makeMatch('2', '3', '4', '1', '1', 'group', 'A', '02/07/2026 18:00', '1'),
  makeMatch('3', '5', '6', '3', '0', 'group', 'B', '03/07/2026 18:00', '2'),
  makeMatch('4', '7', '8', '1', '1', 'group', 'B', '04/07/2026 18:00', '2'),

  // Sferturi
  makeMatch('5', '1', '8', '3', '1', 'qf', '', '12/07/2026 20:00', '3'),
  makeMatch('6', '7', '5', '1', '2', 'qf', '', '11/07/2026 20:00', '3'),
  //   makeMatch('7', '2', '3', '0', '2', 'qf', '', '12/07/2026 17:00', '3'),
  //   makeMatch('8', '4', '6', '2', '1', 'qf', '', '11/07/2026 17:00', '3'),

  // Semifinale
  makeMatch('9', '5', '1', '1', '2', 'sf', '', '15/07/2026 20:00', '4'),
  makeMatch('10', '2', '3', '0', '2', 'sf', '', '14/07/2026 20:00', '4'),

  // Finala mică
  makeMatch('11', '2', '5', '4', '6', 'third', '', '18/07/2026 18:00', '5'),

  // Finala
  makeMatch('12', '3', '1', '1', '0', 'final', '', '19/07/2026 20:00', '5'),
];

export const OFFLINE_GROUPS: Group[] = [
  {
    _id: 'A',
    name: 'A',
    teams: [
      createStanding(offlineTeams[0], {
        mp: '3',
        w: '2',
        d: '1',
        l: '0',
        pts: '7',
        gf: '5',
        ga: '2',
        gd: '+3',
        lastFive: ['WIN', 'WIN', 'DRAW', 'NONE', 'NONE'],
      }),
      createStanding(offlineTeams[1], {
        mp: '3',
        w: '1',
        d: '1',
        l: '1',
        pts: '4',
        gf: '3',
        ga: '3',
        gd: '0',
        lastFive: ['DRAW', 'LOSE', 'WIN', 'NONE', 'NONE'],
      }),
      createStanding(offlineTeams[2], {
        mp: '3',
        w: '1',
        d: '0',
        l: '2',
        pts: '3',
        gf: '2',
        ga: '4',
        gd: '-2',
        lastFive: ['LOSE', 'WIN', 'LOSE', 'NONE', 'NONE'],
      }),
      createStanding(offlineTeams[3], {
        mp: '3',
        w: '0',
        d: '2',
        l: '1',
        pts: '2',
        gf: '1',
        ga: '2',
        gd: '-1',
        lastFive: ['DRAW', 'LOSE', 'DRAW', 'NONE', 'NONE'],
      }),
    ],
  },
  {
    _id: 'B',
    name: 'B',
    teams: [
      createStanding(offlineTeams[4], {
        mp: '3',
        w: '3',
        d: '0',
        l: '0',
        pts: '9',
        gf: '8',
        ga: '1',
        gd: '+7',
        lastFive: ['WIN', 'WIN', 'WIN', 'NONE', 'NONE'],
      }),
      createStanding(offlineTeams[5], {
        mp: '3',
        w: '1',
        d: '1',
        l: '1',
        pts: '4',
        gf: '3',
        ga: '4',
        gd: '-1',
        lastFive: ['WIN', 'DRAW', 'LOSE', 'NONE', 'NONE'],
      }),
      createStanding(offlineTeams[6], {
        mp: '3',
        w: '1',
        d: '0',
        l: '2',
        pts: '3',
        gf: '2',
        ga: '5',
        gd: '-3',
        lastFive: ['LOSE', 'LOSE', 'WIN', 'NONE', 'NONE'],
      }),
      createStanding(offlineTeams[7], {
        mp: '3',
        w: '0',
        d: '1',
        l: '2',
        pts: '1',
        gf: '1',
        ga: '4',
        gd: '-3',
        lastFive: ['LOSE', 'DRAW', 'LOSE', 'NONE', 'NONE'],
      }),
    ],
  },
];

export const OFFLINE_STADIUMS: Stadium[] = [
  {
    id: '1',
    name_en: 'National Stadium',
    name_fa: 'National Stadium',
    fifa_name: 'National Stadium',
    city_en: 'Doha',
    city_fa: 'Doha',
    country_en: 'Qatar',
    country_fa: 'Qatar',
    capacity: 60000,
    region: 'Asia',
  },
  {
    id: '2',
    name_en: 'City Arena',
    name_fa: 'City Arena',
    fifa_name: 'City Arena',
    city_en: 'Lusail',
    city_fa: 'Lusail',
    country_en: 'Qatar',
    country_fa: 'Qatar',
    capacity: 52000,
    region: 'Asia',
  },
  {
    id: '3',
    name_en: 'Victory Stadium',
    name_fa: 'Victory Stadium',
    fifa_name: 'Victory Stadium',
    city_en: 'Al Wakrah',
    city_fa: 'Al Wakrah',
    country_en: 'Qatar',
    country_fa: 'Qatar',
    capacity: 45000,
    region: 'Asia',
  },
  {
    id: '4',
    name_en: 'Semi Final Park',
    name_fa: 'Semi Final Park',
    fifa_name: 'Semi Final Park',
    city_en: 'Al Rayyan',
    city_fa: 'Al Rayyan',
    country_en: 'Qatar',
    country_fa: 'Qatar',
    capacity: 49000,
    region: 'Asia',
  },
  {
    id: '5',
    name_en: 'Final Stadium',
    name_fa: 'Final Stadium',
    fifa_name: 'Final Stadium',
    city_en: 'Doha',
    city_fa: 'Doha',
    country_en: 'Qatar',
    country_fa: 'Qatar',
    capacity: 88000,
    region: 'Asia',
  },
];

export const OFFLINE_COUNTRIES = [
  { name: 'Argentina' },
  { name: 'England' },
  { name: 'France' },
  { name: 'Belgium' },
  { name: 'Spain' },
  { name: 'Morocco' },
  { name: 'Norway' },
  { name: 'Switzerland' },
];

export const OFFLINE_LEAGUES = [
  {
    league: {
      id: 1,
      name: 'World Cup Demo League',
      type: 'League',
    },
    country: {
      name: 'Argentina',
    },
  },
  {
    league: {
      id: 2,
      name: 'European Demo Cup',
      type: 'Cup',
    },
    country: {
      name: 'England',
    },
  },
  {
    league: {
      id: 3,
      name: 'Iberian Demo League',
      type: 'League',
    },
    country: {
      name: 'Spain',
    },
  },
];

export const OFFLINE_FANTASY_PLAYERS = MOCK_PLAYERS.map((player, index) => ({
  player: {
    id: player.id,
    name: player.name,
    photo: player.photo,
  },
  statistics: [
    {
      games: {
        appearences: 0,
      },
      goals: {
        total: 0,
        assists: 0,
      },
      cards: {
        yellow: 0,
        red: 0,
      },
    },
  ],
  team: {
    id: index + 1,
    name: player.team,
  },
}));

const offlineSquadPlayers = MOCK_PLAYERS.map((player, index) => ({
  id: player.id,
  name: player.name,
  photo: player.photo,
  number: index + 7,
  position: player.position,
  age: player.age,
}));

export const getOfflineTeamResponse = (name: string) => ({
  response: [
    {
      team: {
        id: 1,
        name,
        name_en: name,
      },
    },
  ],
});

export const getOfflineSquadResponse = (teamId: number) => ({
  response: [
    {
      team: {
        id: teamId,
        name: 'Offline Team',
      },
      players: offlineSquadPlayers,
    },
  ],
});

export const getOfflineCoachResponse = () => ({
  response: [
    {
      name: 'Offline Coach',
      photo: 'https://via.placeholder.com/120x120?text=Coach',
      age: 52,
      nationality: 'Offline',
    },
  ],
});

export const getOfflinePlayerStatsResponse = () => ({
  response: [
    {
      statistics: [
        {
          games: {
            appearences: 0,
          },
          goals: {
            total: 0,
            assists: 0,
          },
          cards: {
            yellow: 0,
            red: 0,
          },
        },
      ],
    },
  ],
});
