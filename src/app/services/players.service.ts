import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, shareReplay } from 'rxjs';

import { environment } from '../environments/environment';

import {
  getOfflineCoachResponse,
  getOfflinePlayerStatsResponse,
  getOfflineSquadResponse,
  getOfflineTeamResponse,
} from '../shared/data/offline-world-cup-data';

interface TeamResponse {
  response: TeamResponseItem[];
  __source?: 'offline';
}

interface TeamResponseItem {
  team: {
    id: number;
    name: string;
    name_en?: string;
  };
}

interface SquadResponse {
  response: SquadResponseItem[];
  __source?: 'offline';
}

interface SquadResponseItem {
  team: {
    id: number;
    name: string;
  };
  players: SquadPlayer[];
}

interface SquadPlayer {
  id: number;
  name: string;
  photo?: string;
  number?: number;
  position?: string;
  age?: number;
}

interface CoachResponse {
  response: Coach[];
  __source?: 'offline';
}

interface Coach {
  name: string;
  photo?: string;
  age?: number;
  nationality?: string;
}

interface PlayerStatsResponse {
  response: PlayerStats[];
  __source?: 'offline';
}

interface PlayerStats {
  statistics: PlayerStatistics[];
}

interface PlayerStatistics {
  games?: {
    appearences?: number;
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

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private baseUrl = 'https://v3.football.api-sports.io';

  private headers = new HttpHeaders({
    'x-apisports-key': environment.apiSportsKey,
  });

  private teamsCache = new Map<string, Observable<TeamResponse>>();

  private playersCache = new Map<number, Observable<SquadResponse>>();

  private coachCache = new Map<number, Observable<CoachResponse>>();

  private playerStatsCache = new Map<number, Observable<PlayerStatsResponse>>();

  constructor(private http: HttpClient) {}

  getTeam(name: string): Observable<TeamResponse> {
    return this.http
      .get<TeamResponse>(`${this.baseUrl}/teams?search=${name}`, {
        headers: this.headers,
      })
      .pipe(
        catchError(() =>
          of({
            ...getOfflineTeamResponse(name),
            __source: 'offline' as const,
          }),
        ),
      );
  }

  getPlayers(teamId: number): Observable<SquadResponse> {
    const cached = this.playersCache.get(teamId);

    if (cached) {
      return cached;
    }

    const request = this.http
      .get<SquadResponse>(`${this.baseUrl}/players/squads?team=${teamId}`, {
        headers: this.headers,
      })
      .pipe(
        catchError(() =>
          of({
            ...getOfflineSquadResponse(teamId),
            __source: 'offline' as const,
          }),
        ),
        shareReplay(1),
      );

    this.playersCache.set(teamId, request);

    return request;
  }

  getCoach(teamId: number): Observable<CoachResponse> {
    const cached = this.coachCache.get(teamId);

    if (cached) {
      return cached;
    }

    const request = this.http
      .get<CoachResponse>(`${this.baseUrl}/coachs?team=${teamId}`, {
        headers: this.headers,
      })
      .pipe(
        catchError(() =>
          of({
            ...getOfflineCoachResponse(),
            __source: 'offline' as const,
          }),
        ),
        shareReplay(1),
      );

    this.coachCache.set(teamId, request);

    return request;
  }

  getPlayerStats(playerId: number): Observable<PlayerStatsResponse> {
    const cached = this.playerStatsCache.get(playerId);

    if (cached) {
      return cached;
    }

    const request = this.http
      .get<PlayerStatsResponse>(`${this.baseUrl}/players?id=${playerId}&season=2024`, {
        headers: this.headers,
      })
      .pipe(
        catchError(() =>
          of({
            ...getOfflinePlayerStatsResponse(),
            __source: 'offline' as const,
          }),
        ),
        shareReplay(1),
      );

    this.playerStatsCache.set(playerId, request);

    return request;
  }
}
