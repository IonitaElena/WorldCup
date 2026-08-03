import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-selected-team',
  standalone: true,

  imports: [CommonModule, CdkDrag, CdkDropList],

  templateUrl: './selected-team.component.html',
  styleUrl: './selected-team.component.css',
})
export class SelectedTeamComponent {
  @Input()
  selectedPlayers: any[] = [];

  @Output()
  dropPlayer = new EventEmitter<CdkDragDrop<any[]>>();

  drop(event: CdkDragDrop<any[]>) {
    this.dropPlayer.emit(event);
  }
}
