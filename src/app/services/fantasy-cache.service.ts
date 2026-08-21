import { Injectable } from '@angular/core';
import { League } from '../models/league.models';
import { FantasyPlayer } from '../models/fantasy-player.models';

@Injectable({
  providedIn: 'root',
})
export class FantasyCacheService {
  team = {
    name: '',
    logo: null as File | null,
    startDate: '',
    endDate: '',
    players: [] as FantasyPlayer[],
  };

  selectedCountry = '';
  selectedLeague: League | null = null;
  searchLeague = '';
  selectedType = '';
  searchPlayer = '';
  players: FantasyPlayer[] = [];
  selectedPlayers: FantasyPlayer[] = [];
  filteredPlayers: FantasyPlayer[] = [];

  clear(): void {
    this.team = {
      name: '',
      logo: null,
      startDate: '',
      endDate: '',
      players: [],
    };

    this.selectedCountry = '';
    this.selectedLeague = null;
    this.searchLeague = '';
    this.selectedType = '';
    this.searchPlayer = '';
    this.players = [];
    this.selectedPlayers = [];
    this.filteredPlayers = [];
  }
}
