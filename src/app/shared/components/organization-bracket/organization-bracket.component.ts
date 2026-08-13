import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationChart } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';

import { Match } from '../../../models/match';
import { KnockoutMatchCardComponent } from '../knockout-match-card/knockout-match-card.component';

@Component({
  selector: 'app-organization-bracket',
  standalone: true,
  imports: [CommonModule, OrganizationChart, KnockoutMatchCardComponent],
  templateUrl: './organization-bracket.component.html',
  styleUrl: './organization-bracket.component.css',
})
export class OrganizationBracketComponent implements OnChanges {
  @Input() matches: Match[] = [];

  data: TreeNode<Match>[] = [];

  ngOnChanges(): void {
    if (this.matches.length) {
      this.data = this.convertBracket();
      console.log('TREE', this.data);
    } else {
      this.data = [];
    }
  }

  convertBracket(): TreeNode<Match>[] {
    const r32 = this.matches.filter((x) => x.type === 'r32');
    const r16 = this.matches.filter((x) => x.type === 'r16');
    const qf = this.matches.filter((x) => x.type === 'qf');
    const sf = this.matches.filter((x) => x.type === 'sf');
    const final = this.matches.find((x) => x.type === 'final');

    if (!final) {
      return [];
    }

    return [
      {
        data: final,
        expanded: true,

        children: sf.map((semi) => {
          const qfHome = this.findWinnerMatch(semi.home_team_label, qf);

          const qfAway = this.findWinnerMatch(semi.away_team_label, qf);

          return {
            data: semi,

            children: [this.buildNode(qfHome, r16, r32), this.buildNode(qfAway, r16, r32)].filter(
              (node): node is TreeNode<Match> => node !== null,
            ),
          };
        }),
      },
    ];
  }

  buildNode(
    match: Match | undefined,
    previous: Match[],
    firstRound: Match[],
  ): TreeNode<Match> | null {
    if (!match) {
      return null;
    }

    const homePrevious = this.findWinnerMatch(match.home_team_label, previous);

    const awayPrevious = this.findWinnerMatch(match.away_team_label, previous);

    if (match.type === 'r16') {
      const r32Home = this.findWinnerMatch(match.home_team_label, firstRound);

      const r32Away = this.findWinnerMatch(match.away_team_label, firstRound);

      const children: TreeNode<Match>[] = [];

      if (r32Home) {
        children.push({
          data: r32Home,
        });
      }

      if (r32Away) {
        children.push({
          data: r32Away,
        });
      }

      return {
        data: match,
        children,
      };
    }

    const children: TreeNode<Match>[] = [];

    const homeNode = this.buildNode(
      homePrevious,
      previous === firstRound ? [] : firstRound,
      firstRound,
    );

    const awayNode = this.buildNode(
      awayPrevious,
      previous === firstRound ? [] : firstRound,
      firstRound,
    );

    if (homeNode) {
      children.push(homeNode);
    }

    if (awayNode) {
      children.push(awayNode);
    }

    return {
      data: match,
      children,
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
