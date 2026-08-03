import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchCardComponent } from '../match-card/match-card.component';
import { Match } from '../../../models/match';

@Component({
  selector: 'app-matches-history-section',
  standalone: true,
  imports: [CommonModule, MatchCardComponent],
  templateUrl: './matches-history-section.component.html',
  styleUrl: './matches-history-section.component.css',
})
export class MatchesHistorySectionComponent implements OnChanges {
  @Input() matches: Match[] = [];

  groupedMatches: any[] = [];

  ngOnChanges() {
    this.groupMatches();
  }

  groupMatches() {
    this.matches.sort((a, b) => {
      return (
        this.getRomanianDate(a.local_date).getTime() - this.getRomanianDate(b.local_date).getTime()
      );
    });

    const days: any = {};

    this.matches.forEach((match) => {
      const dayTitle =
        match.type === 'group'
          ? `Faza grupelor · ${this.formatDay(match.local_date)}`
          : this.getStageTitle(match.type);

      if (!days[dayTitle]) {
        days[dayTitle] = {
          title: dayTitle,
          groups: {},
        };
      }

      const groupName = match.type === 'group' ? `Grupa ${match.group}` : '';

      const groupKey = groupName || 'default';

      if (!days[dayTitle].groups[groupKey]) {
        days[dayTitle].groups[groupKey] = {
          groupName,
          matches: [],
        };
      }

      days[dayTitle].groups[groupKey].matches.push(match);
    });

    this.groupedMatches = Object.values(days).map((day: any) => ({
      title: day.title,
      groups: Object.values(day.groups),
    }));
  }

  getStageTitle(type: string) {
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

  getRomanianDate(dateString: string) {
    const [datePart, timePart] = dateString.split(' ');

    const [month, day, year] = datePart.split('/').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    const date = new Date(year, month - 1, day, hours, minutes);

    date.setHours(date.getHours() + 6);

    return date;
  }

  formatDay(dateString: string) {
    const date = this.getRomanianDate(dateString);

    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
}
