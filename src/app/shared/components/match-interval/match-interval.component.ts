import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-match-interval.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './match-interval.component.html',
  styleUrl: './match-interval.component.css',
})
export class MatchIntervalComponent {
  @Input() team: any;
}
