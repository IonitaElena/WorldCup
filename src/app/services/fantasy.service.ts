import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of } from 'rxjs';

import {
  OFFLINE_COUNTRIES,
  OFFLINE_FANTASY_PLAYERS,
  OFFLINE_LEAGUES,
} from '../shared/data/offline-world-cup-data';

@Injectable({
  providedIn: 'root',
})
export class FantasyFootballService {
  private url = 'https://v3.football.api-sports.io';

  private apiKey = 'api';

  constructor(private http: HttpClient) {}

  private headers() {
    return new HttpHeaders({
      'x-apisports-key': this.apiKey,
    });
  }

  getCountries() {
    return this.http
      .get<any>(
        `${this.url}/countries`,

        {
          headers: this.headers(),
        },
      )
      .pipe(catchError(() => of({ response: OFFLINE_COUNTRIES })));
  }

  getLeagues() {
    return this.http
      .get<any>(
        `${this.url}/leagues`,

        {
          headers: this.headers(),
        },
      )
      .pipe(catchError(() => of({ response: OFFLINE_LEAGUES })));
  }

  getPlayers(league: number) {
    return this.http
      .get<any>(
        `${this.url}/players?league=${league}&season=2024`,

        {
          headers: this.headers(),
        },
      )
      .pipe(catchError(() => of({ response: OFFLINE_FANTASY_PLAYERS })));
  }
}
