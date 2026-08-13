import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.css',
})
export class PlayerDetailsComponent {
  @Input() player: Player | null = null;

  @Output() close = new EventEmitter<void>();

  closeWindow() {
    this.close.emit();
  }
}
