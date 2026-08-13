import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ChartModule } from 'primeng/chart';
import { ChartData, ChartOptions } from 'chart.js';

import { PlayerStatistic } from '../../../models/statistics.model';

@Component({
  selector: 'app-statistics-charts',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './statistics-charts.component.html',
  styleUrl: './statistics-charts.component.css',
})
export class StatisticsChartsComponent implements OnChanges {
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

  goalsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  cardsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  resultsChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [],
  };

  chartOptions: ChartOptions = {};

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

    this.resultsChartData = {
      labels: ['Victorii', 'Egaluri', 'Infrangeri'],
      datasets: [
        {
          data: [this.totalWins, this.totalDraws, this.totalLosses],
        },
      ],
    };

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
