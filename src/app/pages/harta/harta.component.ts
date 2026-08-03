import { Component } from '@angular/core';
import { MapComponent } from '../../shared/components/map/map-component';

@Component({
  selector: 'app-harta',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './harta.component.html',
  styleUrl: './harta.component.css',
})
export class HartaComponent {
  // tot ce trebuia sa scriu aici e in componenta map, ups:((
}
