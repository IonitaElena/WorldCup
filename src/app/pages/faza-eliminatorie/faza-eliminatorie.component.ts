import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
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
  matches$!: Observable<Match[]>;

  constructor(private football: FootballService) {}

  ngOnInit(): void {
    this.matches$ = this.football
      .getMatches()
      .pipe(
        map((response) =>
          response.games.filter((m) => ['r32', 'r16', 'qf', 'sf', 'final'].includes(m.type)),
        ),
      );
  }
}
