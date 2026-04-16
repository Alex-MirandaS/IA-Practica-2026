import { Component, OnInit } from '@angular/core';
import { AcademicApiService } from '../../core/services/academic-api.service';
import { RepetitionItem } from '../../core/models/academic.models';

@Component({
  selector: 'app-repetitions',
  templateUrl: './repetitions.component.html',
  styleUrls: ['./repetitions.component.css'],
})
export class RepetitionsComponent implements OnInit {
  readonly displayedColumns = ['curso', 'vecesCursado', 'ultimoEstado', 'recomendacion'];
  items: RepetitionItem[] = [];
  isLoading = true;

  constructor(private readonly api: AcademicApiService) {}

  ngOnInit(): void {
    this.api.getRepetitions().subscribe({
      next: (items) => {
        this.items = items;
        this.isLoading = false;
      },
      error: () => {
        this.items = [
          {
            curso: 'PRO301',
            vecesCursado: 2,
            ultimoEstado: 'En riesgo',
            recomendacion: 'Programar tutoría y reducir carga de créditos.',
          },
          {
            curso: 'MAT201',
            vecesCursado: 1,
            ultimoEstado: 'Aprobado',
            recomendacion: 'Mantener seguimiento regular.',
          },
        ];
        this.isLoading = false;
      },
    });
  }
}
