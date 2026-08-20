import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PlayerStatistic } from '../../../models/statistics.model';

@Component({
  selector: 'app-top-scorers',
  standalone: true,
  templateUrl: './top-scorers.component.html',
  styleUrl: './top-scorers.component.css',
})
export class TopScorersComponent {
  @Input()
  topScorers: PlayerStatistic[] = [];

  getGoals(player: PlayerStatistic): number {
    return player.statistics?.[0]?.goals?.total ?? 0;
  }
}
