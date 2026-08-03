import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { FootballService } from '../../services/football.service';
import { Match } from '../../models/match';
// import { KnockoutBracketComponent } from '../../shared/components/knockout-bracket/knockout-bracket.component';
import { BracketComponent } from '../../shared/components/bracket/bracket.component';
import { OrganizationBracketComponent } from '../../shared/components/organization-bracket/organization-bracket.component';
@Component({
  selector: 'app-faza-eliminatorie',
  standalone: true,
  // imports: [CommonModule, BracketComponent, KnockoutBracketComponent, OrganizationBracketComponent],
  imports: [CommonModule, OrganizationBracketComponent, BracketComponent],
  templateUrl: './faza-eliminatorie.component.html',
  styleUrl: './faza-eliminatorie.component.css',
})
export class FazaEliminatorieComponent implements OnInit {
  matches: Match[] = [];

  constructor(
    private football: FootballService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    const response = await firstValueFrom(this.football.getMatches());

    this.matches = response.games.filter((m) =>
      ['r32', 'r16', 'qf', 'sf', 'final'].includes(m.type),
    );

    this.cdr.detectChanges();
  }
}
