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
import { GroupsService } from '../../../services/groups.service';
import { countryCoordinates } from '../../data/country-coordinates';
import {
  getOfflineCoachResponse,
  getOfflinePlayerStatsResponse,
  getOfflineSquadResponse,
} from '../../data/offline-world-cup-data';
import { TeamMarkerComponent } from './team-marker/team-marker.component';
import { PlayersService } from '../../../services/players.service';
import { forkJoin } from 'rxjs';
import { TeamDetailsComponent } from './team-details/team-details.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  hoveredTeam: any = null;
  selectedTeam: any = null;
  teamDetails: any = null;
  selectedPlayer: any = null;
  teamCache = new Map<string, any>();
  playerCache = new Map<number, any>();

  showTooltip(team: any) {
    this.hoveredTeam = team;
  }

  hideTooltip() {
    this.hoveredTeam = null;
  }
  closeDetails() {
    this.teamDetails = null;
  }

  openPlayer(player: any) {
    console.log('CLICK PLAYER', player);

    const offlineStats = getOfflinePlayerStatsResponse().response[0].statistics[0];

    this.selectedPlayer = {
      ...player,
      stats: offlineStats,
    };

    this.cdr.detectChanges();

    if (this.playerCache.has(player.id)) {
      this.selectedPlayer = this.playerCache.get(player.id);

      this.cdr.detectChanges();

      return;
    }

    this.playersService
      .getPlayerStats(player.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          if (!res.response?.length) {
            console.log('NU ARE STATISTICI');

            this.playerCache.set(player.id, this.selectedPlayer);

            return;
          }

          const data = {
            ...player,
            stats: res.response[0].statistics[0],
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

  closePlayer() {
    this.selectedPlayer = null;
  }

  openTeam(team: any) {
    // console.log('CLICK TEAM', team);

    const offlineTeamId = Number(team?.id ?? team?.team_id ?? 1);

    this.teamDetails = {
      team,
      players: getOfflineSquadResponse(offlineTeamId),
      coach: getOfflineCoachResponse(),
    };

    this.cdr.detectChanges();

    this.playersService
      .getTeam(team.name_en)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (teamApi: any) => {
          console.log('TEAM API', teamApi);

          if (!teamApi.response?.length) {
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

              error: (err) => {
                console.log('PLAYERS/COACH ERROR', err);
              },
            });
        },

        error: (err: any) => {
          console.log('TEAM ERROR', err);
        },
      });
  }

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

  center: [number, number] = [15, 50];

  zoom: [number] = [2];

  teams: any[] = [];
  ngOnInit() {
    this.groupsService
      .getTeams()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((teams: any[]) => {
        this.teams = teams.map((team: any) => {
          const position = countryCoordinates[team.name_en];

          return {
            ...team,
            lat: position?.lat,
            lng: position?.lng,
            code: team.iso2?.toLowerCase(),
          };
        });

        this.cdr.detectChanges();
      });
  }
}
