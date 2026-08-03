import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, of, shareReplay } from 'rxjs';

import {
  getOfflineCoachResponse,
  getOfflinePlayerStatsResponse,
  getOfflineSquadResponse,
  getOfflineTeamResponse,
} from '../shared/data/offline-world-cup-data';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private baseUrl = 'https://v3.football.api-sports.io';

  private headers = new HttpHeaders({
    'x-apisports-key': 'API',
  });

  private teamsCache = new Map<string, any>();
  private playersCache = new Map<number, any>();
  private coachCache = new Map<number, any>();
  private playerStatsCache = new Map<number, any>();

  constructor(private http: HttpClient) {}
  getTeam(name: string) {
    return this.http
      .get(`${this.baseUrl}/teams?search=${name}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ ...getOfflineTeamResponse(name), __source: 'offline' })));
  }

  getPlayers(teamId: number) {
    if (this.playersCache.has(teamId)) {
      return this.playersCache.get(teamId);
    }

    const request = this.http
      .get(`${this.baseUrl}/players/squads?team=${teamId}`, {
        headers: this.headers,
      })
      .pipe(
        catchError(() => of({ ...getOfflineSquadResponse(teamId), __source: 'offline' })),
        shareReplay(1),
      );

    this.playersCache.set(teamId, request);

    return request;
  }

  getCoach(teamId: number) {
    if (this.coachCache.has(teamId)) {
      return this.coachCache.get(teamId);
    }

    const request = this.http
      .get(`${this.baseUrl}/coachs?team=${teamId}`, {
        headers: this.headers,
      })
      .pipe(
        catchError(() => of({ ...getOfflineCoachResponse(), __source: 'offline' })),
        shareReplay(1),
      );

    this.coachCache.set(teamId, request);

    return request;
  }

  getPlayerStats(playerId: number) {
    if (this.playerStatsCache.has(playerId)) {
      return this.playerStatsCache.get(playerId);
    }

    const request = this.http
      .get(`${this.baseUrl}/players?id=${playerId}&season=2024`, {
        headers: this.headers,
      })
      .pipe(
        catchError(() => of({ ...getOfflinePlayerStatsResponse(), __source: 'offline' })),
        shareReplay(1),
      );

    this.playerStatsCache.set(playerId, request);

    return request;
  }
}
