import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-details.component.html',
  styleUrl: './team-details.component.css',
})
export class TeamDetailsComponent {
  @Input() data: any;
  @Output() playerClick = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  openPlayer(player: any) {
    // console.log('PLAYER CLICK', player);

    this.playerClick.emit(player);
  }

  closeWindow() {
    this.close.emit();
  }
}
