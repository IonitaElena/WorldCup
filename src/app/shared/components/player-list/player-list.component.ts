import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';

import { MapPlayer } from '../../../models/map-model';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDropList],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css',
})
export class PlayerListComponent {
  @Input() players: MapPlayer[] = [];

  @Output() dropPlayer = new EventEmitter<CdkDragDrop<MapPlayer[]>>();

  drop(event: CdkDragDrop<MapPlayer[]>): void {
    this.dropPlayer.emit(event);
  }
}
