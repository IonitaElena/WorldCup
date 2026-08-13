import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';

import { FantasyPlayer } from '../../../models/fantasy-player.models';

@Component({
  selector: 'app-selected-team',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDropList],
  templateUrl: './selected-team.component.html',
  styleUrl: './selected-team.component.css',
})
export class SelectedTeamComponent {
  @Input()
  selectedPlayers: FantasyPlayer[] = [];

  @Output()
  dropPlayer = new EventEmitter<CdkDragDrop<FantasyPlayer[]>>();

  drop(event: CdkDragDrop<FantasyPlayer[]>): void {
    this.dropPlayer.emit(event);
  }
}
