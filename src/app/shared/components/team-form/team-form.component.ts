import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamForm } from '../../../models/team-form.model';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.css',
})
export class TeamFormComponent {
  @Input({ required: true })
  team!: TeamForm;

  upload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.team.logo = file;
  }
}
