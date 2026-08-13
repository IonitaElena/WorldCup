import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Fixture, PlayerStatistic } from '../models/statistics.model';

interface StatisticsApiResponse<T> {
  response: T[];
  results: number;
  errors?: unknown[];
}

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private readonly url = 'https://v3.football.api-sports.io';

  private readonly apiKey = environment.apiSportsKey;

  // FIFA World Cup
  private readonly league = 1;

  // FIFA World Cup 2022
  private readonly season = 2022;

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({
      'x-apisports-key': this.apiKey,
    });
  }

  getTopScorers(): Observable<StatisticsApiResponse<PlayerStatistic>> {
    const url = `${this.url}/players/topscorers`;

    console.log(`REQUEST: ${url}?league=${this.league}&season=${this.season}`);

    console.log('API KEY:', this.apiKey ? 'EXISTS' : 'MISSING');

    return this.http
      .get<StatisticsApiResponse<PlayerStatistic>>(url, {
        headers: this.headers(),
        params: {
          league: this.league,
          season: this.season,
        },
      })
      .pipe(
        catchError((error: unknown) => {
          console.error('TOP SCORERS ERROR:', error);

          return of({
            response: [],
            results: 0,
            errors: [error],
          });
        }),
      );
  }

  getTopAssists(): Observable<StatisticsApiResponse<PlayerStatistic>> {
    return this.http
      .get<StatisticsApiResponse<PlayerStatistic>>(`${this.url}/players/topassists`, {
        headers: this.headers(),
        params: {
          league: this.league,
          season: this.season,
        },
      })
      .pipe(
        catchError((error: unknown) => {
          console.error('TOP ASSISTS ERROR:', error);

          return of({
            response: [],
            results: 0,
            errors: [error],
          });
        }),
      );
  }

  getTopYellowCards(): Observable<StatisticsApiResponse<PlayerStatistic>> {
    return this.http
      .get<StatisticsApiResponse<PlayerStatistic>>(`${this.url}/players/topyellowcards`, {
        headers: this.headers(),
        params: {
          league: this.league,
          season: this.season,
        },
      })
      .pipe(
        catchError((error: unknown) => {
          console.error('TOP YELLOW CARDS ERROR:', error);

          return of({
            response: [],
            results: 0,
            errors: [error],
          });
        }),
      );
  }

  getTopRedCards(): Observable<StatisticsApiResponse<PlayerStatistic>> {
    return this.http
      .get<StatisticsApiResponse<PlayerStatistic>>(`${this.url}/players/topredcards`, {
        headers: this.headers(),
        params: {
          league: this.league,
          season: this.season,
        },
      })
      .pipe(
        catchError((error: unknown) => {
          console.error('TOP RED CARDS ERROR:', error);

          return of({
            response: [],
            results: 0,
            errors: [error],
          });
        }),
      );
  }

  getFixtures(): Observable<StatisticsApiResponse<Fixture>> {
    return this.http
      .get<StatisticsApiResponse<Fixture>>(`${this.url}/fixtures`, {
        headers: this.headers(),
        params: {
          league: this.league,
          season: this.season,
        },
      })
      .pipe(
        catchError((error: unknown) => {
          console.error('FIXTURES ERROR:', error);

          return of({
            response: [],
            results: 0,
            errors: [error],
          });
        }),
      );
  }

  getAll() {
    return forkJoin({
      scorers: this.getTopScorers(),
      assists: this.getTopAssists(),
      yellowCards: this.getTopYellowCards(),
      redCards: this.getTopRedCards(),
      fixtures: this.getFixtures(),
    });
  }
}
