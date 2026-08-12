import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ChartModule } from 'primeng/chart';

import { PlayerStatistic } from '../../../models/statistics.model';

@Component({
  selector: 'app-statistics-charts',

  standalone: true,

  imports: [ChartModule],

  templateUrl: './statistics-charts.component.html',

  styleUrl: './statistics-charts.component.css',
})
export class StatisticsChartsComponent implements OnChanges {
  // ==============================
  // INPUTS
  // ==============================

  @Input()
  topScorers: PlayerStatistic[] = [];

  @Input()
  topYellowCards: PlayerStatistic[] = [];

  @Input()
  totalWins = 0;

  @Input()
  totalDraws = 0;

  @Input()
  totalLosses = 0;

  // ==============================
  // CHART DATA
  // ==============================

  goalsChartData: any = null;

  cardsChartData: any = null;

  resultsChartData: any = null;

  chartOptions: any = {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['topScorers'] ||
      changes['topYellowCards'] ||
      changes['totalWins'] ||
      changes['totalDraws'] ||
      changes['totalLosses']
    ) {
      this.initializeCharts();

      this.cdr.detectChanges();
    }
  }

  initializeCharts(): void {
    // ==============================
    // GOALS
    // ==============================

    const scorers = this.topScorers.slice(0, 10);

    this.goalsChartData = {
      labels: scorers.map((player) => player.player.name),

      datasets: [
        {
          label: 'Goluri',

          data: scorers.map((player) => player.statistics?.[0]?.goals?.total ?? 0),
        },
      ],
    };

    // ==============================
    // CARDS
    // ==============================

    const cards = this.topYellowCards.slice(0, 10);

    this.cardsChartData = {
      labels: cards.map((player) => player.player.name),

      datasets: [
        {
          label: 'Cartonase galbene',

          data: cards.map((player) => player.statistics?.[0]?.cards?.yellow ?? 0),
        },
      ],
    };

    // ==============================
    // RESULTS
    // ==============================

    this.resultsChartData = {
      labels: ['Victorii', 'Egaluri', 'Infrangeri'],

      datasets: [
        {
          data: [this.totalWins, this.totalDraws, this.totalLosses],
        },
      ],
    };

    // ==============================
    // OPTIONS
    // ==============================

    this.chartOptions = {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: true,
        },
      },

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  }
}
