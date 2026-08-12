import { ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { StatisticsService } from '../../services/statistics.service';

import { Fixture, PlayerStatistic } from '../../models/statistics.model';

import { StatisticsOverviewComponent } from '../../shared/components/statistics-overview/statistics-overview.component';

import { TopScorersComponent } from '../../shared/components/top-scorers/top-scorers.component';

import { TopAssistsComponent } from '../../shared/components/top-assists/top-assists.component';

import { StatisticsChartsComponent } from '../../shared/components/statistics-charts/statistics-charts.component';

import { CardsRankingComponent } from '../../shared/components/cards-ranking/cards-ranking.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-statistics',
  standalone: true,

  imports: [
    CommonModule,
    StatisticsOverviewComponent,
    TopScorersComponent,
    TopAssistsComponent,
    StatisticsChartsComponent,
    CardsRankingComponent,
  ],

  templateUrl: './statistics.component.html',

  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  loading = true;

  topScorers: PlayerStatistic[] = [];

  topAssists: PlayerStatistic[] = [];

  topYellowCards: PlayerStatistic[] = [];

  topRedCards: PlayerStatistic[] = [];

  totalGoals = 0;

  totalMatches = 0;

  totalYellowCards = 0;

  totalRedCards = 0;

  totalWins = 0;

  totalDraws = 0;

  totalLosses = 0;

  constructor(
    private statisticsService: StatisticsService,
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;

    console.log('STATISTICS: request started');

    this.statisticsService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any) => {
          console.log('STATISTICS: API RESPONSE', data);

          this.topScorers = data.scorers?.response ?? [];

          this.topAssists = data.assists?.response ?? [];

          this.topYellowCards = data.yellowCards?.response ?? [];

          this.topRedCards = data.redCards?.response ?? [];

          const fixtures: Fixture[] = data.fixtures?.response ?? [];

          this.totalMatches = data.fixtures?.results ?? fixtures.length;

          this.calculateOverview(fixtures);

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('STATISTICS API ERROR:', error);

          this.loading = false;

          this.cdr.detectChanges();
        },
      });
  }

  calculateOverview(fixtures: Fixture[]): void {
    this.totalGoals = fixtures.reduce(
      (total, fixture) => {
        const homeGoals = fixture.goals?.home ?? 0;

        const awayGoals = fixture.goals?.away ?? 0;

        return total + homeGoals + awayGoals;
      },

      0,
    );

    this.totalYellowCards = this.topYellowCards.reduce(
      (total, player) => total + this.getYellowCards(player),

      0,
    );

    this.totalRedCards = this.topRedCards.reduce(
      (total, player) => total + this.getRedCards(player),

      0,
    );

    this.totalWins = 0;

    this.totalDraws = 0;

    this.totalLosses = 0;

    fixtures.forEach((fixture) => {
      const homeGoals = fixture.goals?.home;

      const awayGoals = fixture.goals?.away;

      if (homeGoals === undefined || awayGoals === undefined) {
        return;
      }

      if (homeGoals > awayGoals) {
        this.totalWins++;
      } else if (homeGoals < awayGoals) {
        this.totalLosses++;
      } else {
        this.totalDraws++;
      }
    });

    console.log('OVERVIEW:', {
      totalGoals: this.totalGoals,
      totalMatches: this.totalMatches,
      totalYellowCards: this.totalYellowCards,
      totalRedCards: this.totalRedCards,
      totalWins: this.totalWins,
      totalDraws: this.totalDraws,
      totalLosses: this.totalLosses,
    });
  }

  getGoals(player: PlayerStatistic): number {
    return player.statistics?.[0]?.goals?.total ?? 0;
  }

  getAssists(player: PlayerStatistic): number {
    return player.statistics?.[0]?.goals?.assists ?? 0;
  }

  getYellowCards(player: PlayerStatistic): number {
    return player.statistics?.[0]?.cards?.yellow ?? 0;
  }

  getRedCards(player: PlayerStatistic): number {
    return player.statistics?.[0]?.cards?.red ?? 0;
  }
}
