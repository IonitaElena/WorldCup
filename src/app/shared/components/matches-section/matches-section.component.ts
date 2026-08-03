import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatchCardComponent } from '../match-card/match-card.component';
import { Match } from '../../../models/match';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-matches-section',
  standalone: true,
  imports: [CommonModule, MatchCardComponent, RouterLink, MatButtonModule],
  templateUrl: './matches-section.component.html',
  styleUrl: './matches-section.component.css',
})
export class MatchesSectionComponent implements OnChanges {
  @Input() title = '';
  @Input() matches: Match[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    console.log('SECTION UPDATE:', this.matches);
  }
}
