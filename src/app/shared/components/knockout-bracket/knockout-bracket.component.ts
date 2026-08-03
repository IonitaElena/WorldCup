import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from '../../../models/match';
import { KnockoutColumnComponent } from '../knockout-column/knockout-column.component';

@Component({
  selector: 'app-knockout-bracket',
  standalone: true,
  imports: [CommonModule, KnockoutColumnComponent],
  templateUrl: './knockout-bracket.component.html',
  styleUrl: './knockout-bracket.component.css',
})
export class KnockoutBracketComponent implements OnChanges {
  @Input()
  matches: Match[] = [];

  r32: Match[] = [];
  r16: Match[] = [];
  qf: Match[] = [];
  sf: Match[] = [];
  finals: Match[] = [];

  ngOnChanges() {
    this.r32 = this.sort(this.matches.filter((x) => x.type == 'r32'));
    this.r16 = this.sort(this.matches.filter((x) => x.type == 'r16'));
    this.qf = this.sort(this.matches.filter((x) => x.type == 'qf'));
    this.sf = this.sort(this.matches.filter((x) => x.type == 'sf'));
    this.finals = this.sort(this.matches.filter((x) => x.type == 'final'));
  }

  sort(matches: Match[]) {
    return [...matches].sort((a, b) => {
      return this.toDate(a.local_date).getTime() - this.toDate(b.local_date).getTime();
    });
  }

  toDate(date: string) {
    const [d, t] = date.split(' ');
    const [m, day, y] = d.split('/').map(Number);
    return new Date(y, m - 1, day);
  }
}
