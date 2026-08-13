import { Component, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { FantasyFootballService } from '../../services/fantasy.service';
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
    this.loadCountries();
    this.loadLeagues();
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
          console.log(err);
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
          this.filteredLeagues = res.response;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  countryChange(): void {
    if (!this.selectedCountry) {
      this.filteredLeagues = this.allLeagues;
      return;
    }

    this.filteredLeagues = this.allLeagues.filter((item) => {
      return item.country.name === this.selectedCountry;
    });
  }

  filterLeague(): void {
    const text = this.searchLeague.toLowerCase();

    this.filteredLeagues = this.allLeagues.filter((item) => {
      const countryOk = !this.selectedCountry || item.country.name === this.selectedCountry;

      const typeOk = !this.selectedType || item.league.type === this.selectedType;

      const nameOk = !text || item.league.name.toLowerCase().includes(text);

      return countryOk && typeOk && nameOk;
    });
  }

  leagueChange(): void {
    if (!this.selectedLeague) {
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
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  filterPlayers(): void {
    const search = this.searchPlayer.toLowerCase().trim();

    if (!search) {
      this.filteredPlayers = [...this.players];
      return;
    }

    this.filteredPlayers = this.players.filter((player) =>
      player.name.toLowerCase().includes(search),
    );
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

  search(): void {
    if (!this.selectedLeague) {
      alert('Selecteaza o competitie.');
      return;
    }

    this.leagueChange();
  }

  saveTeam(): void {
    this.team.players = this.selectedPlayers;

    localStorage.setItem('fantasy-team', JSON.stringify(this.team));

    alert('Echipa a fost salvata!');
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
  }
}
