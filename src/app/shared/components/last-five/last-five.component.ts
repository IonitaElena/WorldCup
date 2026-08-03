import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatchResult } from '../../../models/group';

@Component({
  selector: 'app-last-five',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './last-five.component.html',
  styleUrls: ['./last-five.component.css'],
})
export class LastFiveComponent {
  @Input()
  matches: MatchResult[] = [];

  getIcon(result: MatchResult) {
    switch (result) {
      case 'WIN':
        return 'check_circle';

      case 'DRAW':
        return 'remove_circle';

      case 'LOSE':
        return 'cancel';

      default:
        return 'radio_button_unchecked';
    }
  }

  getClass(result: MatchResult) {
    return result.toLowerCase();
  }

  get displayMatches(): MatchResult[] {
    const result = [...this.matches];

    while (result.length < 5) {
      result.push('NONE');
    }

    return result;
  }
}
