import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

import { Group, GroupResponse, MatchResult } from '../models/group';
import { OFFLINE_GROUPS, OFFLINE_TEAMS } from '../shared/data/offline-world-cup-data';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  private groupsUrl = 'https://worldcup26.ir/get/groups';

  private teamsUrl = 'https://worldcup26.ir/get/teams';

  private gamesUrl = 'https://worldcup26.ir/get/games';

  constructor(private http: HttpClient) {}

  getTeams(): Observable<any[]> {
    return this.http.get<any>(this.teamsUrl).pipe(
      map((response) => response.teams),
      catchError(() => of(OFFLINE_TEAMS)),
    );
  }

  getGroups(): Observable<Group[]> {
    return forkJoin({
      groups: this.http.get<GroupResponse>(this.groupsUrl),

      teams: this.http.get<any>(this.teamsUrl),

      games: this.http.get<any>(this.gamesUrl),
    }).pipe(
      map(({ groups, teams, games }) => {
        const teamsList = teams.teams;

        return groups.groups

          .sort((a, b) => a.name.localeCompare(b.name))

          .map((group) => ({
            ...group,

            teams: group.teams.map((team) => {
              const teamInfo = teamsList.find((t: any) => String(t.id) === String(team.team_id));

              return {
                ...team,

                teamName: teamInfo?.name_en ?? `Team ${team.team_id}`,

                countryCode: this.getCountryCode(teamInfo),

                flag: teamInfo?.flag,

                lastFive: this.getLastFive(team.team_id, games.games),
              };
            }),
          }));
      }),
      catchError(() => of(OFFLINE_GROUPS)),
    );
  }

  private getCountryCode(team: any): string | undefined {
    if (!team) {
      return undefined;
    }

    const specialCodes: any = {
      England: 'gb-eng',
      Scotland: 'gb-sct',
      Wales: 'gb-wls',
    };

    return specialCodes[team.name_en] ?? team.iso2?.toLowerCase() ?? null;
  }
  private getLastFive(teamId: string, matches: any[]): MatchResult[] {
    const teamMatches = matches

      .filter(
        (m: any) =>
          String(m.home_team_id) === String(teamId) || String(m.away_team_id) === String(teamId),
      )

      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

      .slice(0, 5);

    return teamMatches.map((match: any): MatchResult => {
      const home = String(match.home_team_id) === String(teamId);

      const scored = home ? match.home_score : match.away_score;

      const conceded = home ? match.away_score : match.home_score;

      if (scored > conceded) {
        return 'WIN';
      }

      if (scored < conceded) {
        return 'LOSE';
      }

      return 'DRAW';
    });
  }
}
