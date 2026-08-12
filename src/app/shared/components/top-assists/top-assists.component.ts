import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PlayerStatistic } from '../../../models/statistics.model';
@Component({
  selector: 'app-top-assists',

  standalone: true,

  templateUrl: './top-assists.component.html',

  styleUrl: './top-assists.component.css',
})
export class TopAssistsComponent {
  @Input()
  topAssists: PlayerStatistic[] = [];

  getAssists(player: PlayerStatistic): number {
    return player.statistics?.[0]?.goals?.assists ?? 0;
  }
}
