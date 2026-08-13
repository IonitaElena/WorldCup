import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-team-marker',
  standalone: true,
  imports: [],
  templateUrl: './team-marker.component.html',
  styleUrl: './team-marker.component.css',
})
export class TeamMarkerComponent {
  @Input() team!: MapTeam;

  @Output() hover = new EventEmitter<MapTeam>();

  @Output() leave = new EventEmitter<void>();

  @Output() clickTeam = new EventEmitter<MapTeam>();

  mouseEnter() {
    this.hover.emit(this.team);
  }

  mouseLeave() {
    this.leave.emit();
  }

  clicked() {
    this.clickTeam.emit(this.team);
  }
}
