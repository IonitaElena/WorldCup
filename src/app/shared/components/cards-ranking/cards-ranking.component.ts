import { Component, Input } from '@angular/core';

import { PlayerStatistic } from '../../../models/statistics.model';

@Component({
  selector: 'app-cards-ranking',

  standalone: true,

  templateUrl: './cards-ranking.component.html',

  styleUrl: './cards-ranking.component.css',
})
export class CardsRankingComponent {
  @Input()
  topYellowCards: PlayerStatistic[] = [];

  getYellowCards(player: PlayerStatistic): number {
    return player.statistics?.[0]?.cards?.yellow ?? 0;
  }

  getRedCards(player: PlayerStatistic): number {
    return player.statistics?.[0]?.cards?.red ?? 0;
  }
}
