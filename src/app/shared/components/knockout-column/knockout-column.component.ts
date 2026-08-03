import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from '../../../models/match';
import { KnockoutMatchCardComponent } from '../knockout-match-card/knockout-match-card.component';

@Component({
  selector: 'app-knockout-column',
  standalone: true,
  imports: [CommonModule, KnockoutMatchCardComponent],
  templateUrl: './knockout-column.component.html',
  styleUrl: './knockout-column.component.css',
})
export class KnockoutColumnComponent {
  @Input() title = '';

  @Input() matches: Match[] = [];
}
