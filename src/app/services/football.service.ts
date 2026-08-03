import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { GamesResponse } from '../models/games-response';
import { OFFLINE_MATCHES } from '../shared/data/offline-world-cup-data';

@Injectable({
  providedIn: 'root',
})
export class FootballService {
  private api = 'https://worldcup26.ir/get';

  constructor(private http: HttpClient) {}

  getMatches(): Observable<GamesResponse> {
    return this.http.get<GamesResponse>(`${this.api}/games`).pipe(
      catchError(() => {
        return of({ games: OFFLINE_MATCHES });
      }),
    );
  }
}
