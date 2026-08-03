import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { FootballService } from '../../services/football.service';
import { GamesResponse } from '../../models/games-response';
import { MatchesHistorySectionComponent } from '../../shared/components/matches-history-section/matches-history-section.component';

import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-istoric-meciuri',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatchesHistorySectionComponent],
  templateUrl: './istoric-meciuri.component.html',
  styleUrl: './istoric-meciuri.component.css',
})
export class IstoricMeciuriComponent implements OnInit {
  gamesResponse: GamesResponse = {
    games: [],
  };

  constructor(
    private football: FootballService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    this.gamesResponse = await firstValueFrom(this.football.getMatches());

    this.cdr.detectChanges();
  }
}
