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
import { MapCacheService } from '../../../services/map-cache.service';

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
    private mapCache: MapCacheService,
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
    this.mapCache.selectedTeam = null;
  }

  openTeam(team: MapTeam): void {
    this.mapCache.selectedTeam = team;
    const cachedTeam = this.mapCache.teamCache.get(team.name_en);

    if (cachedTeam) {
      this.teamDetails = cachedTeam;
      this.cdr.detectChanges();
      return;
    }

    const offlineTeamId = Number(team.id);
    const offlineDetails: TeamDetails = {
      team,
      players: getOfflineSquadResponse(offlineTeamId),
      coach: getOfflineCoachResponse(),
    };

    this.mapCache.teamCache.set(team.name_en, offlineDetails);
    this.teamDetails = offlineDetails;
    this.cdr.detectChanges();
    this.playersService
      .getTeam(team.name_en)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (teamApi: TeamApiResponse) => {
          if (!teamApi.response.length) {
            return;
          }
          const teamId = teamApi.response[0].team.id;

          forkJoin({
            players: this.playersService.getPlayers(teamId),
            coach: this.playersService.getCoach(teamId),
          })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: ({ players, coach }) => {
                const details: TeamDetails = {
                  team,
                  players,
                  coach,
                };
                this.mapCache.teamCache.set(team.name_en, details);
                this.teamDetails = details;
                this.cdr.detectChanges();
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
    const cachedPlayer = this.mapCache.playerCache.get(player.id);
    if (cachedPlayer) {
      this.selectedPlayer = cachedPlayer;
      this.mapCache.selectedPlayer = cachedPlayer;
      this.cdr.detectChanges();
      return;
    }
    const offlineStats = getOfflinePlayerStatsResponse().response[0].statistics[0];

    this.selectedPlayer = {
      ...player,
      stats: offlineStats,
    };

    this.mapCache.selectedPlayer = this.selectedPlayer;
    this.cdr.detectChanges();
    this.playersService
      .getPlayerStats(player.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: PlayerStatsResponse) => {
          if (!res.response.length) {
            console.log('NU ARE STATISTICI');
            if (this.selectedPlayer) {
              this.mapCache.playerCache.set(player.id, this.selectedPlayer);
            }
            return;
          }
          const stats = res.response[0].statistics?.[0];

          if (!stats) {
            console.log('NU AM GASIT STATISTICI PENTRU JUCATOR');
            if (this.selectedPlayer) {
              this.mapCache.playerCache.set(player.id, this.selectedPlayer);
            }
            return;
          }
          const data: MapPlayer = {
            ...player,
            stats,
          };
          this.mapCache.playerCache.set(player.id, data);
          this.selectedPlayer = data;
          this.mapCache.selectedPlayer = data;
          this.cdr.detectChanges();
        },

        error: (err: HttpErrorResponse) => {
          console.log('PLAYER API ERROR', err);
          if (this.selectedPlayer) {
            this.mapCache.playerCache.set(player.id, this.selectedPlayer);
          }
        },
      });
  }

  closePlayer(): void {
    this.selectedPlayer = null;
    this.mapCache.selectedPlayer = null;
  }

  ngOnInit(): void {
    this.selectedTeam = this.mapCache.selectedTeam;
    this.selectedPlayer = this.mapCache.selectedPlayer;

    if (this.selectedTeam) {
      const cachedDetails = this.mapCache.teamCache.get(this.selectedTeam.name_en);
      if (cachedDetails) {
        this.teamDetails = cachedDetails;
      }
    }

    if (this.mapCache.teams.length) {
      this.teams = this.mapCache.teams;
      this.cdr.detectChanges();
      return;
    }

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
            return {
              ...team,
              lat: position.lat,
              lng: position.lng,
              code: team.iso2?.toLowerCase(),
            } as MapTeam;
          })
          .filter((team): team is MapTeam => team !== null);
        this.mapCache.teams = this.teams;
        this.cdr.detectChanges();
      });
  }
}
