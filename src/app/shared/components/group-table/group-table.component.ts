import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { LastFiveComponent } from '../last-five/last-five.component';

import { Group } from '../../../models/group';

@Component({
  selector: 'app-group-table',
  standalone: true,

  imports: [CommonModule, MatCardModule, MatTableModule, LastFiveComponent],

  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.css'],
})
export class GroupTableComponent implements OnChanges {
  @Input()
  group!: Group;
  dataSource: any[] = [];
  columns: string[] = ['rank', 'team', 'mp', 'w', 'd', 'l', 'gf', 'ga', 'gd', 'pts', 'form'];

  ngOnChanges() {
    if (this.group) {
      this.dataSource = this.group.teams;
    }
  }
}
