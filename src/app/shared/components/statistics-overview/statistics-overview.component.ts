import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-statistics-overview',
  standalone: true,
  templateUrl: './statistics-overview.component.html',
  styleUrl: './statistics-overview.component.css',
})
export class StatisticsOverviewComponent {
  @Input() totalGoals = 0;
  @Input() totalMatches = 0;
  @Input() totalYellowCards = 0;
  @Input() totalRedCards = 0;
}
