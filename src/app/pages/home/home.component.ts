import { Component, OnInit } from '@angular/core';
import { DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FootballService } from '../../services/football.service';
import { Match } from '../../models/match';
import { MatchesSectionComponent } from '../../shared/components/matches-section/matches-section.component';
import { ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatchesSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  matches: Match[] = [];
  finals: Match[] = [];
  third: Match[] = [];
  semifinals: Match[] = [];
  quarterFinals: Match[] = [];

  constructor(
    private football: FootballService,
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.football
      .getMatches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.matches = response.games;

        this.finals = this.matches.filter((m) => m.type === 'final');

        this.third = this.matches.filter((m) => m.type === 'third');

        this.semifinals = this.matches.filter((m) => m.type === 'sf');

        this.quarterFinals = this.matches.filter((m) => m.type === 'qf');

        this.matches = [...this.finals, ...this.third, ...this.semifinals, ...this.quarterFinals];

        this.cdr.detectChanges();
      });
  }
}
