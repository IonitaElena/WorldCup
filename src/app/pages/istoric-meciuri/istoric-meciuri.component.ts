import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { FootballService } from '../../services/football.service';
import { GamesResponse } from '../../models/games-response';
import { MatchesHistorySectionComponent } from '../../shared/components/matches-history-section/matches-history-section.component';

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

  constructor(private football: FootballService) {}

  ngOnInit(): void {
    this.football.getMatches().subscribe((response) => {
      this.gamesResponse = response;
    });
  }
}
