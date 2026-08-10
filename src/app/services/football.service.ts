import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GamesResponse } from '../models/games-response';
import { LOCAL_GAMES } from '../shared/data/local-games';

@Injectable({
  providedIn: 'root',
})
export class FootballService {
  constructor() {}

  getMatches(): Observable<GamesResponse> {
    return of({ games: LOCAL_GAMES });
  }
}
