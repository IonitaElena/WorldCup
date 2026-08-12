import { Component, ChangeDetectorRef, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GroupTableComponent } from '../../shared/components/group-table/group-table.component';
import { Group } from '../../models/group';
import { GroupsService } from '../../services/groups.service';
import { LegendComponent } from '../../shared/components/legend/legend.component';

@Component({
  selector: 'app-clasament-grupe',
  standalone: true,
  imports: [CommonModule, GroupTableComponent, LegendComponent],
  templateUrl: './clasament-grupe.component.html',
  styleUrls: ['./clasament-grupe.component.css'],
})
export class ClasamentGrupeComponent implements OnInit {
  groups: Group[] = [];

  constructor(
    private groupsService: GroupsService,
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit() {
    this.groupsService
      .getGroups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          console.log('DATA:', data);

          this.groups = [...data];

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }
}
