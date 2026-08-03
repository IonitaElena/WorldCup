import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.css',
})
export class TeamFormComponent {
  @Input() team: any;

  upload(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.team.logo = URL.createObjectURL(file);
    }
  }
}
