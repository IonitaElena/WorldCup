import { ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import {
  MapComponent as MglMap,
  MarkerComponent as MglMarker,
  PopupComponent as MglPopup,
  ControlComponent as MglControl,
  NavigationControlDirective,
} from '@maplibre/ngx-maplibre-gl';

import { StyleSpecification } from 'maplibre-gl';

import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GroupsService } from '../../../services/groups.service';
import { PlayersService } from '../../../services/players.service';

import { countryCoordinates } from '../../data/country-coordinates';

import {
  getOfflineCoachResponse,
  getOfflinePlayerStatsResponse,
  getOfflineSquadResponse,
} from '../../data/offline-world-cup-data';

import { TeamMarkerComponent } from './team-marker/team-marker.component';
import { TeamDetailsComponent } from './team-details/team-details.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';

import { MapTeam, MapPlayer, TeamDetails } from '../../../models/map-model';

@Component({
  selector: 'app-map-component',
  standalone: true,

  imports: [
    CommonModule,
    MglMap,
    MglMarker,
    MglPopup,
    MglControl,
    NavigationControlDirective,
    TeamMarkerComponent,
    TeamDetailsComponent,
    PlayerDetailsComponent,
  ],

  templateUrl: './map-component.html',
  styleUrl: './map-component.css',
})
export class MapComponent implements OnInit {
  constructor(
    private groupsService: GroupsService,
    private playersService: PlayersService,
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef,
  ) {}

  hoveredTeam: MapTeam | null = null;

  selectedTeam: MapTeam | null = null;

  teamDetails: TeamDetails | null = null;

  selectedPlayer: MapPlayer | null = null;

  teamCache = new Map<string, MapTeam>();

  playerCache = new Map<number, MapPlayer>();

  teams: MapTeam[] = [];

  center: [number, number] = [15, 50];

  zoom: [number] = [2];

  mapStyle: StyleSpecification = {
    version: 8,

    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
      },
    },

    layers: [
      {
        id: 'osm',
        type: 'raster',
        source: 'osm',
      },
    ],
  };

  showTooltip(team: MapTeam): void {
    this.hoveredTeam = team;
  }

  hideTooltip(): void {
    this.hoveredTeam = null;
  }

  closeDetails(): void {
    this.teamDetails = null;
  }

  openTeam(team: MapTeam): void {
    const offlineTeamId = Number(team.id);

    // Afisam imediat datele offline
    this.teamDetails = {
      team,
      players: getOfflineSquadResponse(offlineTeamId),
      coach: getOfflineCoachResponse(),
    };

    this.cdr.detectChanges();

    // Incercam sa luam datele reale
    this.playersService
      .getTeam(team.name_en)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (teamApi: TeamApiResponse) => {
          console.log('TEAM API', teamApi);

          if (!teamApi.response.length) {
            console.log('Nu am gasit echipa');
            return;
          }

          const teamId = teamApi.response[0].team.id;

          console.log('TEAM ID', teamId);

          forkJoin({
            players: this.playersService.getPlayers(teamId),
            coach: this.playersService.getCoach(teamId),
          })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: ({ players, coach }) => {
                this.teamDetails = {
                  team,
                  players,
                  coach,
                };

                this.cdr.detectChanges();

                console.log('TEAM DETAILS', this.teamDetails);
              },

              error: (err: unknown) => {
                console.log('PLAYERS/COACH ERROR', err);
              },
            });
        },

        error: (err: HttpErrorResponse) => {
          console.log('TEAM ERROR', err);
        },
      });
  }

  openPlayer(player: MapPlayer): void {
    console.log('CLICK PLAYER', player);

    const offlineStats = getOfflinePlayerStatsResponse().response[0].statistics[0];

    this.selectedPlayer = {
      ...player,
      stats: offlineStats,
    };

    this.cdr.detectChanges();

    const cachedPlayer = this.playerCache.get(player.id);

    if (cachedPlayer) {
      this.selectedPlayer = cachedPlayer;

      this.cdr.detectChanges();

      return;
    }

    this.playersService
      .getPlayerStats(player.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: PlayerStatsResponse) => {
          if (!res.response.length) {
            console.log('NU ARE STATISTICI');

            if (this.selectedPlayer) {
              this.playerCache.set(player.id, this.selectedPlayer);
            }

            return;
          }

          const stats = res.response[0].statistics?.[0];

          if (!stats) {
            console.log('NU AM GASIT STATISTICI PENTRU JUCATOR');

            if (this.selectedPlayer) {
              this.playerCache.set(player.id, this.selectedPlayer);
            }

            return;
          }

          const data: MapPlayer = {
            ...player,
            stats,
          };

          this.playerCache.set(player.id, data);

          this.selectedPlayer = data;

          this.cdr.detectChanges();
        },

        error: (err: HttpErrorResponse) => {
          console.log('PLAYER API ERROR', err);
        },
      });
  }

  closePlayer(): void {
    this.selectedPlayer = null;
  }

  ngOnInit(): void {
    this.groupsService
      .getTeams()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((teams) => {
        this.teams = teams
          .map((team) => {
            const position = countryCoordinates[team.name_en];

            if (!position) {
              return null;
            }

            const mapTeam: MapTeam = {
              ...team,

              lat: position.lat,
              lng: position.lng,

              code: team.iso2?.toLowerCase(),
            };

            return mapTeam;
          })
          .filter((team): team is MapTeam => team !== null);

        this.cdr.detectChanges();
      });
  }
}
