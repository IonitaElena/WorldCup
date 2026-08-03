import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Match } from '../../../models/match';
import { MatDialog } from '@angular/material/dialog';
import { MatchDetailsDialogComponent } from '../match-details-dialog/match-details-dialog.component';

@Component({
  selector: 'app-knockout-match-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './knockout-match-card.component.html',
  styleUrl: './knockout-match-card.component.css',
})
export class KnockoutMatchCardComponent implements OnChanges {
  @Input()
  match!: Match;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['match']) {
      this.match = changes['match'].currentValue;
    }
  }

  formatDate(date: string) {
    const [d, time] = date.split(' ');
    const [month, day, year] = d.split('/').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const local = new Date(year, month - 1, day, hour, minute);

    local.setHours(local.getHours() + 6);

    const zile = ['Dum.', 'Lun.', 'Mar.', 'Mie.', 'Joi.', 'Vin.', 'Sâm.'];

    const zi = zile[local.getDay()];

    const dd = String(local.getDate()).padStart(2, '0');
    const mm = String(local.getMonth() + 1).padStart(2, '0');

    return `${zi}, ${dd}.${mm}`;
  }

  getStatus() {
    if (this.match.home_penalty_score && this.match.home_penalty_score !== 'null') {
      return 'F (D)';
    }
    return 'FIN.';
  }

  getFlag(team: string): string {
    const flags: any = {
      Canada: 'ca',
      Mexico: 'mx',
      USA: 'us',
      'United States': 'us',
      UnitedStates: 'us',
      Australia: 'au',
      Iraq: 'iq',
      Iran: 'ir',
      'IR Iran': 'ir',
      Japan: 'jp',
      Jordan: 'jo',
      'South Korea': 'kr',
      'Korea Republic': 'kr',
      Qatar: 'qa',
      'Saudi Arabia': 'sa',
      Uzbekistan: 'uz',
      Algeria: 'dz',
      'Cape Verde': 'cv',
      'Cabo Verde': 'cv',
      Congo: 'cg',
      'Congo DR': 'cd',
      'Democratic Republic of the Congo': 'cd',
      Egypt: 'eg',
      Ghana: 'gh',
      'Ivory Coast': 'ci',
      'Côte d’Ivoire': 'ci',
      Morocco: 'ma',
      Senegal: 'sn',
      'South Africa': 'za',
      Tunisia: 'tn',
      Curaçao: 'cw',
      Curacao: 'cw',
      Haiti: 'ht',
      Panama: 'pa',
      Argentina: 'ar',
      Brazil: 'br',
      Colombia: 'co',
      Ecuador: 'ec',
      Paraguay: 'py',
      Uruguay: 'uy',
      'New Zealand': 'nz',
      Austria: 'at',
      Belgium: 'be',
      'Bosnia and Herzegovina': 'ba',
      Bosnia: 'ba',
      Croatia: 'hr',
      Czechia: 'cz',
      'Czech Republic': 'cz',
      England: 'gb-eng',
      France: 'fr',
      Germany: 'de',
      Netherlands: 'nl',
      Norway: 'no',
      Portugal: 'pt',
      Scotland: 'gb-sct',
      Spain: 'es',
      Sweden: 'se',
      Switzerland: 'ch',
      Türkiye: 'tr',
      Turkey: 'tr',
    };

    return flags[team] ?? 'un';
  }

  isHomeWinner(): boolean {
    const homeScore = Number(this.match.home_score);
    const awayScore = Number(this.match.away_score);

    if (homeScore !== awayScore) {
      return homeScore > awayScore;
    }

    return Number(this.match.home_penalty_score) > Number(this.match.away_penalty_score);
  }

  isAwayWinner(): boolean {
    const homeScore = Number(this.match.home_score);
    const awayScore = Number(this.match.away_score);

    if (homeScore !== awayScore) {
      return awayScore > homeScore;
    }

    return Number(this.match.away_penalty_score) > Number(this.match.home_penalty_score);
  }

  constructor(private dialog: MatDialog) {}
  openDialog() {
    this.dialog.open(MatchDetailsDialogComponent, {
      width: '500px',
      maxHeight: '90vh',
      panelClass: 'match-dialog',
      data: this.match,
    });
  }
}
