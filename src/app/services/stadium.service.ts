import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Stadium } from '../models/stadium';
import { OFFLINE_STADIUMS } from '../shared/data/offline-world-cup-data';

@Injectable({
  providedIn: 'root',
})
export class StadiumService {
  private url = 'https://worldcup26.ir/get/stadiums';

  constructor(private http: HttpClient) {}

  getStadiums(): Observable<{ stadiums: Stadium[] }> {
    return this.http
      .get<{ stadiums: Stadium[] }>(this.url)
      .pipe(catchError(() => of({ stadiums: OFFLINE_STADIUMS })));
  }
}
