import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Match } from '../../../models/match';
import { StadiumService } from '../../../services/stadium.service';
import { Stadium } from '../../../models/stadium';

@Component({
  selector: 'app-match-details-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-details-dialog.component.html',
  styleUrl: './match-details-dialog.component.css',
})
export class MatchDetailsDialogComponent implements OnInit {
  stadium?: Stadium;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public match: Match,

    private stadiumService: StadiumService,

    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadStadium();
  }

  loadStadium() {
    if (!this.match.stadium_id) {
      this.stadium = undefined;
      return;
    }

    this.stadiumService.getStadiums().subscribe((data) => {
      this.stadium = data.stadiums.find((s) => Number(s.id) === Number(this.match.stadium_id));

      console.log('STADION:', this.stadium);

      this.cdr.detectChanges();
    });
  }

  parsePlayers(data?: string): string[] {
    if (!data || data === 'null') {
      return [];
    }

    return data
      .replace(/[{}"]/g, '')
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x && x !== 'null');
  }

  hasPenalty(): boolean {
    return (
      this.match.home_penalty_score != null &&
      this.match.away_penalty_score != null &&
      this.match.home_penalty_score !== 'null' &&
      this.match.away_penalty_score !== 'null'
    );
  }
}
