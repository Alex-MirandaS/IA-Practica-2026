import { Component } from '@angular/core';

interface FeatureCard {
  title: string;
  description: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  readonly featureCards: FeatureCard[] = [
    {
      title: 'Carga Masiva de Datos',
      description: 'Importa información académica y actualiza el sistema desde el backend.',
      route: '/carga-masiva',
      icon: 'cloud_upload',
    },
    {
      title: 'Visualización del Pensum',
      description: 'Consulta los cursos, créditos y requisitos del plan de estudios.',
      route: '/pensum',
      icon: 'menu_book',
    },
    {
      title: 'Horario Personalizado',
      description: 'Genera una propuesta de horario basada en tus preferencias.',
      route: '/horario-personalizado',
      icon: 'schedule',
    },
    {
      title: 'Rendimiento y Repitencias',
      description: 'Monitorea promedio, alertas académicas y materias repetidas.',
      route: '/rendimiento',
      icon: 'insights',
    },
  ];
}
