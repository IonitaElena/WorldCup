import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';

import {
  OFFLINE_COUNTRIES,
  OFFLINE_FANTASY_PLAYERS,
  OFFLINE_LEAGUES,
} from '../shared/data/offline-world-cup-data';

import { CountriesResponse } from '../models/country.models';
import { LeaguesResponse } from '../models/league.models';
import { PlayersResponse } from '../models/fantasy-player.models';

@Injectable({
  providedIn: 'root',
})
export class FantasyFootballService {
  private url = 'https://v3.football.api-sports.io';
  private apiKey = environment.apiSportsKey;

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({
      'x-apisports-key': this.apiKey,
    });
  }

  getCountries(): Observable<CountriesResponse> {
    return this.http
      .get<CountriesResponse>(`${this.url}/countries`, {
        headers: this.headers(),
      })
      .pipe(catchError(() => of({ response: OFFLINE_COUNTRIES })));
  }

  getLeagues(): Observable<LeaguesResponse> {
    return this.http
      .get<LeaguesResponse>(`${this.url}/leagues`, {
        headers: this.headers(),
      })
      .pipe(catchError(() => of({ response: OFFLINE_LEAGUES })));
  }

  getPlayers(league: number): Observable<PlayersResponse> {
    return this.http
      .get<PlayersResponse>(`${this.url}/players?league=${league}&season=2024`, {
        headers: this.headers(),
      })
      .pipe(catchError(() => of({ response: OFFLINE_FANTASY_PLAYERS })));
  }
}
