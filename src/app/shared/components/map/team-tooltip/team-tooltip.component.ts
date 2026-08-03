import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-team-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './team-tooltip.component.html',
  styleUrl: './team-tooltip.component.css',
})
export class TeamTooltipComponent {
  @Input() team!: any;
}
