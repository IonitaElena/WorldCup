import { FantasyPlayer } from './fantasy-player.models';

export interface TeamForm {
  name: string;
  logo: File | null;
  startDate: string;
  endDate: string;
  players: FantasyPlayer[];
}
