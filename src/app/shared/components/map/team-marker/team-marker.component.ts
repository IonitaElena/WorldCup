import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-team-marker',
  standalone: true,
  imports: [],
  templateUrl: './team-marker.component.html',
  styleUrl: './team-marker.component.css',
})
export class TeamMarkerComponent {
  @Input() team!: any;

  @Output() hover = new EventEmitter<any>();

  @Output() leave = new EventEmitter<void>();

  @Output() clickTeam = new EventEmitter<any>();

  mouseEnter() {
    this.hover.emit(this.team);
  }

  mouseLeave() {
    this.leave.emit();
  }

  clicked() {
    // console.log('CLICK MARKER', this.team);
    this.clickTeam.emit(this.team);
  }
}
