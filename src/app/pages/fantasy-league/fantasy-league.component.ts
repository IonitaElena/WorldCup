import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { FantasyFootballService } from '../../services/fantasy.service';
import { PlayerListComponent } from '../../shared/components/player-list/player-list.component';
import { SelectedTeamComponent } from '../../shared/components/selected-team/selected-team.component';
import { TeamFormComponent } from '../../shared/components/team-form/team-form.component';

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
  constructor(private footballService: FantasyFootballService) {}

  team: {
    name: string;
    logo: File | null;
    startDate: '';
    endDate: '';
    players: any[];
  } = {
    name: '',
    logo: null,
    startDate: '',
    endDate: '',
    players: [],
  };

  countries: any[] = [];
  allLeagues: any[] = [];
  filteredLeagues: any[] = [];
  selectedCountry = '';
  selectedLeague: any = null;
  searchLeague = '';
  players: any[] = [];
  selectedPlayers: any[] = [];
  selectedType = '';
  searchPlayer = '';
  filteredPlayers: any[] = [];

  ngOnInit() {
    this.loadCountries();

    this.loadLeagues();
  }

  loadCountries() {
    this.footballService
      .getCountries()

      .subscribe({
        next: (res) => {
          this.countries = res.response;
        },

        error: (err) => {
          console.log(err);
        },
      });
  }

  loadLeagues() {
    this.footballService
      .getLeagues()

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

  countryChange() {
    if (!this.selectedCountry) {
      this.filteredLeagues = this.allLeagues;

      return;
    }

    this.filteredLeagues = this.allLeagues.filter((item: any) => {
      return item.country.name === this.selectedCountry;
    });
  }

  filterLeague() {
    const text = this.searchLeague ? this.searchLeague.toLowerCase() : '';

    this.filteredLeagues = this.allLeagues.filter((item: any) => {
      const countryOk = !this.selectedCountry || item.country.name === this.selectedCountry;

      const typeOk = !this.selectedType || item.league.type === this.selectedType;

      const nameOk = !text || item.league.name.toLowerCase().includes(text);

      return countryOk && typeOk && nameOk;
    });
  }

  leagueChange() {
    if (!this.selectedLeague) {
      return;
    }

    this.footballService.getPlayers(this.selectedLeague).subscribe({
      next: (res) => {
        console.log(res);

        this.players = res.response.map((item: any) => ({
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

  filterPlayers() {
    const search = this.searchPlayer.toLowerCase().trim();

    if (!search) {
      this.filteredPlayers = [...this.players];
      return;
    }

    this.filteredPlayers = this.players.filter((player) =>
      player.name.toLowerCase().includes(search),
    );
  }

  onSearchPlayerChange(event: Event | string) {
    if (typeof event === 'string') {
      this.searchPlayer = event;
    } else {
      const target = event.target as HTMLInputElement | null;
      this.searchPlayer = target?.value ?? '';
    }
    this.filterPlayers();
  }

  search() {
    if (!this.selectedLeague) {
      alert('Selectează o competiție.');

      return;
    }

    this.leagueChange();
  }

  saveTeam() {
    this.team.players = this.selectedPlayers;

    localStorage.setItem('fantasy-team', JSON.stringify(this.team));

    alert('Echipa a fost salvată!');
  }

  dropPlayer(event: CdkDragDrop<any[]>) {
    if (
      event.container.id === 'team' &&
      event.previousContainer.id !== 'team' &&
      this.selectedPlayers.length >= 11
    ) {
      alert('Poți avea maximum 11 jucători.');

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
