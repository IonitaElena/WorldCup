import { Injectable } from '@angular/core';
import { MapPlayer, MapTeam, TeamDetails } from '../models/map-model';

@Injectable({
  providedIn: 'root',
})
export class MapCacheService {
  teams: MapTeam[] = [];
  teamCache = new Map<string, TeamDetails>();
  playerCache = new Map<number, MapPlayer>();
  selectedTeam: MapTeam | null = null;
  selectedPlayer: MapPlayer | null = null;

  clear(): void {
    this.teams = [];
    this.teamCache.clear();
    this.playerCache.clear();
    this.selectedTeam = null;
    this.selectedPlayer = null;
  }
}
