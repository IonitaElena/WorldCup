import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { FazaEliminatorieComponent } from './pages/faza-eliminatorie/faza-eliminatorie.component';
import { ClasamentGrupeComponent } from './pages/clasament-grupe/clasament-grupe.component';
import { IstoricMeciuriComponent } from './pages/istoric-meciuri/istoric-meciuri.component';
import { HartaComponent } from './pages/harta/harta.component';
import { FantasyLeagueComponent } from './pages/fantasy-league/fantasy-league.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'faza-eliminatorie', component: FazaEliminatorieComponent },
  { path: 'clasament-grupe', component: ClasamentGrupeComponent },
  { path: 'istoric-meciuri', component: IstoricMeciuriComponent },
  { path: 'harta', component: HartaComponent },
  { path: 'fantasy', component: FantasyLeagueComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: '**', redirectTo: '' },
];
