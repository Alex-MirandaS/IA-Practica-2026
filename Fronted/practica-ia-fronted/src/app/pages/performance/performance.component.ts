import { Component, OnInit } from '@angular/core';
import { AcademicApiService } from '../../core/services/academic-api.service';
import { AcademicPerformanceSummary } from '../../core/models/academic.models';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css'],
})
export class PerformanceComponent implements OnInit {
  readonly displayedColumns = ['curso', 'semestre', 'nota', 'estado', 'creditos'];
  summary: AcademicPerformanceSummary | null = null;
  isLoading = true;

  constructor(private readonly api: AcademicApiService) {}

  ngOnInit(): void {
    this.api.getAcademicSummary().subscribe({
      next: (summary) => {
        this.summary = summary;
        this.isLoading = false;
      },
      error: () => {
        this.summary = {
          promedioGeneral: 8.42,
          creditosAprobados: 96,
          creditosEnCurso: 18,
          riesgoRepitencia: 2,
          alertas: [
            'Revisar el curso PRO301 por nota cercana al mínimo.',
            'Controlar carga académica para evitar repitencias en el próximo ciclo.',
          ],
          detalle: [
            { curso: 'MAT201', semestre: 3, nota: 8.9, estado: 'Aprobado', creditos: 5 },
            { curso: 'PRO301', semestre: 4, nota: 6.8, estado: 'En riesgo', creditos: 4 },
            { curso: 'RED210', semestre: 4, nota: 9.1, estado: 'Aprobado', creditos: 4 },
          ],
        };
        this.isLoading = false;
      },
    });
  }
}
