import { Component, OnInit } from '@angular/core';
import { AcademicApiService } from '../../core/services/academic-api.service';
import { PensumCourse } from '../../core/models/academic.models';

@Component({
  selector: 'app-pensum',
  templateUrl: './pensum.component.html',
  styleUrls: ['./pensum.component.css'],
})
export class PensumComponent implements OnInit {
  readonly displayedColumns = ['codigo', 'nombre', 'creditos', 'semestre', 'prerequisitos', 'area', 'estado'];
  courses: PensumCourse[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private readonly api: AcademicApiService) {}

  ngOnInit(): void {
    this.api.getPensum().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.isLoading = false;
      },
      error: () => {
        this.courses = [
          {
            codigo: 'MAT101',
            nombre: 'Matemática I',
            creditos: 5,
            semestre: 1,
            prerequisitos: [],
            area: 'Básica',
            estado: 'Pendiente',
          },
          {
            codigo: 'PRO202',
            nombre: 'Programación II',
            creditos: 4,
            semestre: 2,
            prerequisitos: ['PRO101'],
            area: 'Profesional',
            estado: 'Pendiente',
          },
        ];
        this.errorMessage = 'Se muestran datos de ejemplo porque el backend no respondió en http://localhost:4001.';
        this.isLoading = false;
      },
    });
  }
}
