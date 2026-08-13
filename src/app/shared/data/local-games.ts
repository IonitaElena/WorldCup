import { Match } from '../../models/match';
import { LocalMatch } from '../../models/match-data';
import teamMatches from './team.json';

const toStringValue = (value: unknown, fallback = ''): string => {
  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
};

export const LOCAL_GAMES: Match[] = teamMatches.map((match: LocalMatch): Match => ({
  id: toStringValue(match.id),

  home_team_id: toStringValue(match.home_team_id),
  away_team_id: toStringValue(match.away_team_id),

  home_team_name_en: toStringValue(match.home_team_name_en),
  away_team_name_en: toStringValue(match.away_team_name_en),

  home_score: toStringValue(match.home_score),
  away_score: toStringValue(match.away_score),

  home_scorers: match.home_scorers,
  away_scorers: match.away_scorers,

  home_penalty_score: toStringValue(match.home_penalty_score),
  away_penalty_score: toStringValue(match.away_penalty_score),

  home_penalty_scorers: match.home_penalty_scorers,
  away_penalty_scorers: match.away_penalty_scorers,

  home_penalty_misses: match.home_penalty_misses,
  away_penalty_misses: match.away_penalty_misses,

  group: toStringValue(match.group),
  matchday: toStringValue(match.matchday),
  local_date: toStringValue(match.local_date),
  type: toStringValue(match.type),

  finished: toStringValue(match.finished, 'TRUE'),

  stadium_id: match.stadium_id ? toStringValue(match.stadium_id) : undefined,

  home_team_label: match.home_team_label,
  away_team_label: match.away_team_label,
}));
