import { Component, Input } from '@angular/core';

import { MapTeam } from '../../../../models/map-model';

@Component({
  selector: 'app-team-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './team-tooltip.component.html',
  styleUrl: './team-tooltip.component.css',
})
export class TeamTooltipComponent {
  @Input() team!: MapTeam;
}
