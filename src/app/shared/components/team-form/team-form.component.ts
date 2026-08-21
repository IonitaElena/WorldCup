import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
export class TeamFormComponent implements OnInit, OnDestroy {
  @Input({ required: true })
  team!: TeamForm;

  @Output() teamChange = new EventEmitter<void>();
  logoPreview: string | null = null;

  ngOnInit(): void {
    this.createLogoPreview();
  }

  private createLogoPreview(): void {
    if (!this.team?.logo) {
      return;
    }
    if (this.logoPreview) {
      URL.revokeObjectURL(this.logoPreview);
    }
    this.logoPreview = URL.createObjectURL(this.team.logo);
  }

  onTeamChange(): void {
    this.teamChange.emit();
  }

  upload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.team.logo = file;
    if (this.logoPreview) {
      URL.revokeObjectURL(this.logoPreview);
    }
    this.logoPreview = URL.createObjectURL(file);
    this.teamChange.emit();
  }

  ngOnDestroy(): void {
    if (this.logoPreview) {
      URL.revokeObjectURL(this.logoPreview);
    }
  }
}
