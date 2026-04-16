import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AcademicApiService } from '../../core/services/academic-api.service';
import { GeneratedSchedule, ScheduleGenerationRequest } from '../../core/models/academic.models';

@Component({
  selector: 'app-custom-schedule',
  templateUrl: './custom-schedule.component.html',
  styleUrls: ['./custom-schedule.component.css'],
})
export class CustomScheduleComponent {
  isLoading = false;
  schedule: GeneratedSchedule | null = null;
  previewMessage = 'Carga la previsualización del estudiante para seleccionar cursos.';
  availableCourses: Array<{ id_curso: number; codigo: string; nombre: string; creditos: number; obligatorio: boolean; seleccionado_por_defecto: boolean }> = [];

  readonly form = this.fb.group({
    id_estudiante: [1, [Validators.required, Validators.min(1)]],
    max_credits: [24, [Validators.required, Validators.min(1)]],
    population_size: [80, [Validators.required, Validators.min(20)]],
    generations: [120, [Validators.required, Validators.min(30)]],
    persist: [true],
    selected_course_ids: [<number[]>([])],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: AcademicApiService,
  ) {}

  loadPreview(): void {
    const idEstudiante = this.form.controls.id_estudiante.value;

    if (!idEstudiante) {
      this.previewMessage = 'Ingresa un ID de estudiante válido.';
      return;
    }

    this.isLoading = true;
    this.api.previewSchedule(idEstudiante).subscribe({
      next: (preview) => {
        this.availableCourses = preview.cursos.map((curso) => ({
          id_curso: curso.id_curso,
          codigo: curso.codigo,
          nombre: curso.nombre,
          creditos: curso.creditos,
          obligatorio: curso.obligatorio,
          seleccionado_por_defecto: curso.seleccionado_por_defecto,
        }));

        const selectedCourseIds = this.availableCourses
          .filter((course) => course.seleccionado_por_defecto)
          .map((course) => course.id_curso);

        this.form.patchValue({ selected_course_ids: selectedCourseIds });
        this.previewMessage = `Previsualización cargada para el estudiante ${preview.id_estudiante}. Créditos aprobados: ${preview.creditos_aprobados_acumulados}.`;
        this.isLoading = false;
      },
      error: () => {
        this.previewMessage = 'No se pudo cargar la previsualización desde el backend. Usa datos de ejemplo.';
        this.availableCourses = [
          { id_curso: 1, codigo: 'MAT201', nombre: 'Matemática II', creditos: 5, obligatorio: true, seleccionado_por_defecto: true },
          { id_curso: 2, codigo: 'PRO301', nombre: 'Programación III', creditos: 4, obligatorio: true, seleccionado_por_defecto: true },
          { id_curso: 3, codigo: 'RED210', nombre: 'Redes I', creditos: 4, obligatorio: false, seleccionado_por_defecto: false },
        ];
        this.form.patchValue({ selected_course_ids: [1, 2] });
        this.isLoading = false;
      },
    });
  }

  generate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const request: ScheduleGenerationRequest = {
      id_estudiante: value.id_estudiante ?? 0,
      selected_course_ids: value.selected_course_ids ?? [],
      max_credits: value.max_credits ?? undefined,
      population_size: value.population_size ?? undefined,
      generations: value.generations ?? undefined,
      persist: value.persist ?? undefined,
    };

    this.isLoading = true;
    this.schedule = null;

    this.api.generateCustomSchedule(request).subscribe({
      next: (result) => {
        this.schedule = result;
        this.isLoading = false;
      },
      error: () => {
        this.schedule = {
          status: 'generado_localmente',
          id_estudiante: request.id_estudiante,
          creditos_seleccionados: request.selected_course_ids.length,
          max_creditos: request.max_credits,
          cursos: [
            { id_curso: 1, codigo: 'MAT201', nombre: 'Matemática II', obligatorio: true, prioridad_bottleneck: 2, id_horario_general: 10, seccion: '01', bloques: [{ dia: 'LU', start: 420, end: 540 }] },
            { id_curso: 2, codigo: 'PRO301', nombre: 'Programación III', obligatorio: true, prioridad_bottleneck: 1, id_horario_general: 11, seccion: '02', bloques: [{ dia: 'MI', start: 600, end: 720 }] },
            { id_curso: 3, codigo: 'RED210', nombre: 'Redes I', obligatorio: false, prioridad_bottleneck: 1, id_horario_general: 12, seccion: '01', bloques: [{ dia: 'VI', start: 780, end: 900 }] },
          ],
          sugerencia: 'Propuesta generada localmente porque el backend no respondió.',
        };
        this.isLoading = false;
      },
    });
  }
}
