import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Match, MatchHistoryGroup, MatchGroup } from '../../../models/match';
import { MatchCardComponent } from '../match-card/match-card.component';

@Component({
  selector: 'app-matches-history-section',
  standalone: true,
  imports: [CommonModule, MatchCardComponent],
  templateUrl: './matches-history-section.component.html',
  styleUrl: './matches-history-section.component.css',
})
export class MatchesHistorySectionComponent implements OnChanges {
  @Input() matches: Match[] = [];

  groupedMatches: MatchHistoryGroup[] = [];

  ngOnChanges(): void {
    this.groupMatches();
  }

  groupMatches(): void {
    const days: Record<string, MatchHistoryGroup> = {};

    const sortedMatches = [...this.matches].sort((a, b) => {
      return (
        this.getRomanianDate(a.local_date).getTime() - this.getRomanianDate(b.local_date).getTime()
      );
    });

    sortedMatches.forEach((match) => {
      const dayTitle =
        match.type === 'group'
          ? `Faza grupelor · ${this.formatDay(match.local_date)}`
          : this.getStageTitle(match.type);

      if (!days[dayTitle]) {
        days[dayTitle] = {
          title: dayTitle,
          groups: [],
        };
      }

      const groupName = match.type === 'group' ? `Grupa ${match.group}` : '';

      const groupKey = groupName || 'default';

      let group = days[dayTitle].groups.find((item) => item.groupName === groupKey);

      if (!group) {
        group = {
          groupName,
          matches: [],
        };

        days[dayTitle].groups.push(group);
      }

      group.matches.push(match);
    });

    this.groupedMatches = Object.values(days);
  }

  getStageTitle(type: string): string {
    switch (type) {
      case 'r32':
        return 'Turul 2';

      case 'r16':
        return 'Optimi de finala';

      case 'qf':
        return 'Sferturi de finala';

      case 'sf':
        return 'Semifinale';

      case 'third':
        return 'Finala mica';

      case 'final':
        return 'Finala';

      default:
        return '';
    }
  }

  getRomanianDate(dateString: string): Date {
    const [datePart, timePart] = dateString.split(' ');

    const [month, day, year] = datePart.split('/').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    const date = new Date(year, month - 1, day, hours, minutes);

    date.setHours(date.getHours() + 6);

    return date;
  }

  formatDay(dateString: string): string {
    const date = this.getRomanianDate(dateString);

    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}`;
  }
}
