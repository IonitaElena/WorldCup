import { Component, Input } from '@angular/core';
import { OrganizationChart } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';

import { Match } from '../../../models/match';
import { CommonModule } from '@angular/common';
import { KnockoutMatchCardComponent } from '../knockout-match-card/knockout-match-card.component';

@Component({
  selector: 'app-organization-bracket',
  standalone: true,
  imports: [CommonModule, OrganizationChart, KnockoutMatchCardComponent],
  templateUrl: './organization-bracket.component.html',
  styleUrl: './organization-bracket.component.css',
})
export class OrganizationBracketComponent {
  @Input()
  matches: Match[] = [];

  data: TreeNode<Match>[] = [];

  ngOnChanges() {
    if (this.matches.length) {
      this.data = this.convertBracket();
      console.log('TREE', this.data);
    }
  }

  convertBracket(): TreeNode<Match>[] {
    const r32 = this.matches.filter((x) => x.type === 'r32');
    const r16 = this.matches.filter((x) => x.type === 'r16');
    const qf = this.matches.filter((x) => x.type === 'qf');
    const sf = this.matches.filter((x) => x.type === 'sf');
    const final = this.matches.find((x) => x.type === 'final');

    return [
      {
        data: final!,

        expanded: true,

        children: sf.map((semi) => {
          const qfHome = this.findWinnerMatch(semi.home_team_label, qf);

          const qfAway = this.findWinnerMatch(semi.away_team_label, qf);

          return {
            data: semi,

            children: [this.buildNode(qfHome, r16, r32), this.buildNode(qfAway, r16, r32)],
          };
        }),
      },
    ];
  }

  buildNode(match: Match | undefined, previous: Match[], firstRound: Match[]): TreeNode<Match> {
    if (!match) {
      return {
        data: undefined as any,
      };
    }

    const homePrevious = this.findWinnerMatch(match.home_team_label, previous);

    const awayPrevious = this.findWinnerMatch(match.away_team_label, previous);

    if (match.type === 'r16') {
      const r32Home = this.findWinnerMatch(match.home_team_label, firstRound);

      const r32Away = this.findWinnerMatch(match.away_team_label, firstRound);

      return {
        data: match,

        children: [
          {
            data: r32Home,
          },

          {
            data: r32Away,
          },
        ],
      };
    }

    return {
      data: match,

      children: [
        this.buildNode(homePrevious, previous === firstRound ? [] : firstRound, firstRound),

        this.buildNode(awayPrevious, previous === firstRound ? [] : firstRound, firstRound),
      ].filter((x) => x.data),
    };
  }

  findWinnerMatch(label: string | undefined, matches: Match[]): Match | undefined {
    if (!label) {
      return undefined;
    }

    if (!label.startsWith('Winner Match')) {
      return undefined;
    }

    const id = label.replace('Winner Match ', '');

    return matches.find((x) => x.id === id);
  }
}
