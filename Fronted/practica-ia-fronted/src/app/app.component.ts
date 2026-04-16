import { Component } from '@angular/core';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly title = 'Horario Estudiante';

  readonly navItems: NavItem[] = [
    { label: 'Inicio', route: '/dashboard', icon: 'home' },
    { label: 'Carga masiva', route: '/carga-masiva', icon: 'cloud_upload' },
    { label: 'Pensum', route: '/pensum', icon: 'menu_book' },
    { label: 'Horario', route: '/horario-personalizado', icon: 'schedule' },
    { label: 'Rendimiento', route: '/rendimiento', icon: 'insights' },
    { label: 'Repitencias', route: '/repitencias', icon: 'repeat' },
  ];
}
