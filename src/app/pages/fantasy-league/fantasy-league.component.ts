import { Component, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { FantasyFootballService } from '../../services/fantasy.service';
import { FantasyCacheService } from '../../services/fantasy-cache.service';

import { PlayerListComponent } from '../../shared/components/player-list/player-list.component';
import { SelectedTeamComponent } from '../../shared/components/selected-team/selected-team.component';
import { TeamFormComponent } from '../../shared/components/team-form/team-form.component';

import { Country } from '../../models/country.models';
import { League } from '../../models/league.models';
import { FantasyPlayer } from '../../models/fantasy-player.models';

@Component({
  selector: 'app-fantasy-league',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PlayerListComponent,
    SelectedTeamComponent,
    TeamFormComponent,
  ],
  templateUrl: './fantasy-league.component.html',
  styleUrl: './fantasy-league.component.css',
})
export class FantasyLeagueComponent implements OnInit {
  constructor(
    private footballService: FantasyFootballService,
    private fantasyCache: FantasyCacheService,
    private destroyRef: DestroyRef,
  ) {}

  team: {
    name: string;
    logo: File | null;
    startDate: string;
    endDate: string;
    players: FantasyPlayer[];
  } = {
    name: '',
    logo: null,
    startDate: '',
    endDate: '',
    players: [],
  };

  countries: Country[] = [];
  allLeagues: League[] = [];
  filteredLeagues: League[] = [];
  selectedCountry = '';
  selectedLeague: League | null = null;
  searchLeague = '';
  players: FantasyPlayer[] = [];
  selectedPlayers: FantasyPlayer[] = [];
  filteredPlayers: FantasyPlayer[] = [];
  selectedType = '';
  searchPlayer = '';

  ngOnInit(): void {
    this.restoreState();
    this.loadCountries();
    this.loadLeagues();
  }

  private restoreState(): void {
    this.team = {
      name: this.fantasyCache.team.name,
      logo: this.fantasyCache.team.logo,
      startDate: this.fantasyCache.team.startDate,
      endDate: this.fantasyCache.team.endDate,
      players: [...this.fantasyCache.team.players],
    };

    this.selectedCountry = this.fantasyCache.selectedCountry;
    this.selectedLeague = this.fantasyCache.selectedLeague;
    this.searchLeague = this.fantasyCache.searchLeague;
    this.selectedType = this.fantasyCache.selectedType;
    this.searchPlayer = this.fantasyCache.searchPlayer;
    this.players = [...this.fantasyCache.players];
    this.selectedPlayers = [...this.fantasyCache.selectedPlayers];
    this.filteredPlayers = [...this.fantasyCache.filteredPlayers];

    if (this.players.length) {
      this.filterPlayers();
    }
  }

  saveTeamState(): void {
    this.fantasyCache.team = {
      name: this.team.name,
      logo: this.team.logo,
      startDate: this.team.startDate,
      endDate: this.team.endDate,
      players: [...this.selectedPlayers],
    };
  }

  loadCountries(): void {
    this.footballService
      .getCountries()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.countries = res.response;
        },
        error: (err) => {
          console.log('COUNTRIES ERROR', err);
        },
      });
  }

  loadLeagues(): void {
    this.footballService
      .getLeagues()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.allLeagues = res.response;
          this.filterLeague();
        },
        error: (err) => {
          console.log('LEAGUES ERROR', err);
        },
      });
  }

  countryChange(): void {
    this.fantasyCache.selectedCountry = this.selectedCountry;
    this.filterLeague();
  }

  filterLeague(): void {
    const text = this.searchLeague.toLowerCase().trim();

    this.filteredLeagues = this.allLeagues.filter((item) => {
      const countryOk = !this.selectedCountry || item.country.name === this.selectedCountry;
      const typeOk = !this.selectedType || item.league.type === this.selectedType;
      const nameOk = !text || item.league.name.toLowerCase().includes(text);
      return countryOk && typeOk && nameOk;
    });

    this.fantasyCache.selectedCountry = this.selectedCountry;
    this.fantasyCache.selectedType = this.selectedType;
    this.fantasyCache.searchLeague = this.searchLeague;
  }

  leagueChange(): void {
    if (!this.selectedLeague) {
      return;
    }

    this.fantasyCache.selectedLeague = this.selectedLeague;

    if (
      this.players.length &&
      this.fantasyCache.selectedLeague?.league.id === this.selectedLeague.league.id
    ) {
      this.filterPlayers();

      return;
    }

    this.footballService
      .getPlayers(this.selectedLeague.league.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.players = res.response.map((item) => ({
            id: item.player.id,
            name: item.player.name,
            photo: item.player.photo,
          }));

          this.filteredPlayers = [...this.players];
          this.fantasyCache.players = [...this.players];
          this.fantasyCache.filteredPlayers = [...this.filteredPlayers];
        },
        error: (err) => {
          console.log('PLAYERS ERROR', err);
        },
      });
  }

  search(): void {
    if (!this.selectedLeague) {
      alert('Selecteaza o competitie.');
      return;
    }

    this.fantasyCache.selectedLeague = this.selectedLeague;
    this.leagueChange();
  }

  filterPlayers(): void {
    const search = this.searchPlayer.toLowerCase().trim();

    if (!search) {
      this.filteredPlayers = [...this.players];
    } else {
      this.filteredPlayers = this.players.filter((player) =>
        player.name.toLowerCase().includes(search),
      );
    }

    this.fantasyCache.searchPlayer = this.searchPlayer;
    this.fantasyCache.filteredPlayers = [...this.filteredPlayers];
  }

  onSearchPlayerChange(event: Event | string): void {
    if (typeof event === 'string') {
      this.searchPlayer = event;
    } else {
      const target = event.target as HTMLInputElement | null;
      this.searchPlayer = target?.value ?? '';
    }
    this.filterPlayers();
  }

  dropPlayer(event: CdkDragDrop<FantasyPlayer[]>): void {
    if (
      event.container.id === 'team' &&
      event.previousContainer.id !== 'team' &&
      this.selectedPlayers.length >= 11
    ) {
      alert('Poti avea maximum 11 jucatori.');
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.fantasyCache.selectedPlayers = [...this.selectedPlayers];
    this.team.players = [...this.selectedPlayers];
    this.fantasyCache.team = { ...this.team };
  }

  saveTeam(): void {
    this.team.players = [...this.selectedPlayers];
    this.fantasyCache.team = { ...this.team };
    localStorage.setItem(
      'fantasy-team',
      JSON.stringify({
        name: this.team.name,
        startDate: this.team.startDate,
        endDate: this.team.endDate,
        players: this.selectedPlayers,
      }),
    );
    alert('Echipa a fost salvata!');
  }
}
