import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Match } from '../../../models/match';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './match-card.component.html',
  styleUrl: './match-card.component.css',
})
export class MatchCardComponent {
  @Input() match!: Match;

  formatDate(dateString: string, finished: string) {
    const [datePart, timePart] = dateString.split(' ');
    const [month, day, year] = datePart.split('/').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    const date = new Date(year, month - 1, day, hours, minutes);

    // date.setHours(date.getHours() + 6);

    const time = date.toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const zile = ['Dum.', 'Lun.', 'Mar.', 'Mie.', 'Joi.', 'Vin.', 'Sâm.'];

    let dayText = `${zile[date.getDay()]}, ${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (finished === 'TRUE') {
      return {
        day: dayText,
        time: 'FIN.',
      };
    }

    return {
      day: dayText,
      time: time,
    };
  }

  getStage(type: string): string {
    switch (type) {
      case 'qf':
        return 'Sferturi';

      case 'sf':
        return 'Semifinale';

      case 'third':
        return 'Finala mică';

      case 'final':
        return 'Finală';

      default:
        return type;
    }
  }

  getFlag(team: string): string {
    const flags: Record<string, string> = {
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

    return flags[team] || 'un';
  }
}
