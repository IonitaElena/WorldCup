import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapPlayer, TeamDetails } from '../../../../models/map-model';

@Component({
  selector: 'app-team-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-details.component.html',
  styleUrl: './team-details.component.css',
})
export class TeamDetailsComponent {
  @Input() data: TeamDetails | null = null;

  @Output() playerClick = new EventEmitter<MapPlayer>();

  @Output() close = new EventEmitter<void>();

  openPlayer(player: MapPlayer): void {
    this.playerClick.emit(player);
  }

  closeWindow(): void {
    this.close.emit();
  }
}
