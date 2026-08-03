import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-player-list',
  standalone: true,

  imports: [CommonModule, CdkDrag, CdkDropList],

  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css',
})
export class PlayerListComponent {
  @Input() players: any[] = [];

  @Output() dropPlayer = new EventEmitter<CdkDragDrop<any[]>>();

  drop(event: CdkDragDrop<any[]>) {
    this.dropPlayer.emit(event);
  }
}
