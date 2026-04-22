import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AcademicApiService } from '../../core/services/academic-api.service';
import { GeneratedSchedule, PreviewCourse, ScheduleGenerationRequest } from '../../core/models/academic.models';

@Component({
  selector: 'app-custom-schedule',
  templateUrl: './custom-schedule.component.html',
  styleUrls: ['./custom-schedule.component.css'],
})
export class CustomScheduleComponent {
  isLoading = false;
  schedule: GeneratedSchedule | null = null;
  previewMessage = 'Ingresa el carnet y carga la previsualización para seleccionar cursos.';
  availableCourses: PreviewCourse[] = [];
  private previewStudentId: number | null = null;

  get selectableCourses(): PreviewCourse[] {
    return this.availableCourses.filter((course) => course.elegible);
  }

  readonly form = this.fb.group({
    carnet: ['', [Validators.required, Validators.minLength(6)]],
    id_estudiante: [null as number | null],
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

  formatDay(day: string): string {
    const normalized = (day || '').toUpperCase();
    const dayMap: Record<string, string> = {
      LU: 'Lunes',
      MA: 'Martes',
      MI: 'Miercoles',
      JU: 'Jueves',
      VI: 'Viernes',
      SA: 'Sabado',
      DO: 'Domingo',
      MON: 'Lunes',
      TUE: 'Martes',
      WED: 'Miercoles',
      THU: 'Jueves',
      FRI: 'Viernes',
      SAT: 'Sabado',
      SUN: 'Domingo',
    };

    return dayMap[normalized] || day;
  }

  formatMinutes(minutes: number): string {
    if (!Number.isFinite(minutes)) {
      return '--:--';
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  getCourseTeacher(course: NonNullable<GeneratedSchedule['cursos']>[number]): string {
    return course.docente?.trim() || 'No asignado';
  }

  getCourseRoom(course: NonNullable<GeneratedSchedule['cursos']>[number]): string {
    const detailedRoom = course.bloques_detallados?.find((item) => !!item.salon?.trim())?.salon?.trim();
    return detailedRoom || course.salon?.trim() || 'No asignado';
  }

  getCourseTimeRanges(course: NonNullable<GeneratedSchedule['cursos']>[number]): string {
    const detailedRanges = (course.bloques_detallados || [])
      .map((item) => {
        const start = item.periodo?.hora_inicio?.slice(0, 5) || '';
        const end = item.periodo?.hora_fin?.slice(0, 5) || '';
        return start && end ? `${start} - ${end}` : '';
      })
      .filter((range) => !!range);

    if (detailedRanges.length > 0) {
      return Array.from(new Set(detailedRanges)).join(', ');
    }

    const blockRanges = (course.bloques || [])
      .map((block) => {
        if (typeof block.start !== 'number' || typeof block.end !== 'number') {
          return '';
        }
        return `${this.formatMinutes(block.start)} - ${this.formatMinutes(block.end)}`;
      })
      .filter((range) => !range.includes('--:--'));

    return blockRanges.length > 0 ? Array.from(new Set(blockRanges)).join(', ') : 'No definido';
  }

  exportResultAsPdf(): void {
    if (!this.schedule) {
      return;
    }

    const doc = new jsPDF();
    const result = this.schedule;
    const courses = result.cursos || [];
    const conflicts = result.conflictos || [];

    doc.setFontSize(16);
    doc.text('Horario Estudiante - Resultado', 14, 16);
    doc.setFontSize(10);
    doc.text(`Estado: ${result.status || 'N/A'}`, 14, 24);
    doc.text(`Estudiante ID: ${result.id_estudiante ?? 'N/A'}`, 14, 30);
    doc.text(`Creditos seleccionados: ${result.creditos_seleccionados ?? 0}`, 14, 36);
    doc.text(`Maximo de creditos: ${result.max_creditos ?? 'N/A'}`, 14, 42);

    if (courses.length > 0) {
      autoTable(doc, {
        startY: 48,
        head: [['Codigo', 'Curso', 'Seccion', 'Docente', 'Salon', 'Horario']],
        body: courses.map((course) => [
          course.codigo,
          course.nombre,
          course.seccion,
          this.getCourseTeacher(course),
          this.getCourseRoom(course),
          this.getCourseTimeRanges(course),
        ]),
        styles: { fontSize: 9 },
      });
    }

    if (conflicts.length > 0) {
      const finalY = (doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY || 48;
      autoTable(doc, {
        startY: finalY + 8,
        head: [['Curso A', 'Bloque A', 'Curso B', 'Bloque B']],
        body: conflicts.map((conflict) => [
          `${conflict.curso_a.codigo} (Sec ${conflict.curso_a.seccion})`,
          `${this.formatDay(conflict.bloque_a.day)} ${this.formatMinutes(conflict.bloque_a.start)}-${this.formatMinutes(conflict.bloque_a.end)}`,
          `${conflict.curso_b.codigo} (Sec ${conflict.curso_b.seccion})`,
          `${this.formatDay(conflict.bloque_b.day)} ${this.formatMinutes(conflict.bloque_b.start)}-${this.formatMinutes(conflict.bloque_b.end)}`,
        ]),
        styles: { fontSize: 9 },
      });
    }

    doc.save(`horario-estudiante-${result.id_estudiante ?? 'sin-id'}.pdf`);
  }

  exportResultAsExcel(): void {
    if (!this.schedule) {
      return;
    }

    const result = this.schedule;
    const csvRows: string[] = [];
    csvRows.push(this.toCsvRow(['Horario Estudiante - Resultado']));
    csvRows.push(this.toCsvRow(['Estado', result.status || 'N/A']));
    csvRows.push(this.toCsvRow(['Estudiante ID', String(result.id_estudiante ?? 'N/A')]));
    csvRows.push(this.toCsvRow(['Creditos seleccionados', String(result.creditos_seleccionados ?? 0)]));
    csvRows.push(this.toCsvRow(['Maximo de creditos', String(result.max_creditos ?? 'N/A')]));
    csvRows.push('');

    csvRows.push(this.toCsvRow(['Cursos']));
    csvRows.push(this.toCsvRow(['Codigo', 'Curso', 'Seccion', 'Docente', 'Salon', 'Horario']));

    (result.cursos || []).forEach((course) => {
      csvRows.push(this.toCsvRow([
        course.codigo,
        course.nombre,
        course.seccion,
        this.getCourseTeacher(course),
        this.getCourseRoom(course),
        this.getCourseTimeRanges(course),
      ]));
    });

    if (result.conflictos?.length) {
      csvRows.push('');
      csvRows.push(this.toCsvRow(['Conflictos']));
      csvRows.push(this.toCsvRow(['Curso A', 'Bloque A', 'Curso B', 'Bloque B']));

      result.conflictos.forEach((conflict) => {
        csvRows.push(this.toCsvRow([
          `${conflict.curso_a.codigo} (Sec ${conflict.curso_a.seccion})`,
          `${this.formatDay(conflict.bloque_a.day)} ${this.formatMinutes(conflict.bloque_a.start)}-${this.formatMinutes(conflict.bloque_a.end)}`,
          `${conflict.curso_b.codigo} (Sec ${conflict.curso_b.seccion})`,
          `${this.formatDay(conflict.bloque_b.day)} ${this.formatMinutes(conflict.bloque_b.start)}-${this.formatMinutes(conflict.bloque_b.end)}`,
        ]));
      });
    }

    const csvContent = `\ufeff${csvRows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `horario-estudiante-${result.id_estudiante ?? 'sin-id'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private toCsvRow(values: Array<string>): string {
    return values
      .map((value) => {
        const safeValue = (value || '').replace(/"/g, '""');
        return `"${safeValue}"`;
      })
      .join(',');
  }

  loadPreview(): void {
    const carnet = this.form.controls.carnet.value?.trim() || '';

    if (!carnet) {
      this.previewMessage = 'Ingresa un carnet de estudiante valido.';
      return;
    }

    this.isLoading = true;
    this.api.previewSchedule(carnet).subscribe({
      next: (preview) => {
        console.log('[PreviewSchedule] Response JSON:', preview);
        this.previewStudentId = preview.id_estudiante;
        this.availableCourses = Array.isArray(preview.cursos) ? preview.cursos : [];

        const selectedCourseIds = this.availableCourses
          .filter((course) => course.seleccionado_por_defecto && course.elegible)
          .map((course) => course.id_curso);

        this.form.patchValue({
          selected_course_ids: selectedCourseIds,
          id_estudiante: preview.id_estudiante,
        });
        this.previewMessage = `Previsualizacion cargada para carnet ${carnet}. Estudiante ID: ${preview.id_estudiante}. Creditos aprobados: ${preview.creditos_aprobados_acumulados}.`;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.availableCourses = [];
        this.previewStudentId = null;
        this.form.patchValue({ selected_course_ids: [], id_estudiante: null });

        const backendMessage = typeof error?.error?.message === 'string' ? error.error.message : '';
        const pensumNotConfigured =
          error.status === 404 ||
          error.status === 400 ||
          /pensum/i.test(backendMessage);

        this.previewMessage = pensumNotConfigured
          ? 'No hay pensum configurado para la carrera del estudiante. Carga primero el pensum para habilitar la previsualizacion.'
          : backendMessage || 'No se pudo cargar la previsualizacion desde el backend.';

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
    const studentId = this.previewStudentId ?? value.id_estudiante ?? 0;
    if (!studentId) {
      this.previewMessage = 'Primero debes cargar la previsualizacion por carnet para obtener el estudiante.';
      return;
    }

    const carnet = this.form.controls.carnet.value?.trim() || '';

    const request: ScheduleGenerationRequest = {
      carnet: carnet,
      id_estudiante: studentId,
      selected_course_ids: value.selected_course_ids ?? [],
    };

    // Agregar campos opcionales solo si tienen valores
    if (typeof value.max_credits === 'number' && value.max_credits > 0) {
      request.max_credits = value.max_credits;
    }
    if (typeof value.population_size === 'number' && value.population_size > 0) {
      request.population_size = value.population_size;
    }
    if (typeof value.generations === 'number' && value.generations > 0) {
      request.generations = value.generations;
    }
    if (typeof value.persist === 'boolean') {
      request.persist = value.persist;
    }

    this.isLoading = true;
    this.schedule = null;

    this.api.generateCustomSchedule(request).subscribe({
      next: (result) => {
        this.schedule = result;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        const backendMessage = typeof error?.error?.message === 'string' ? error.error.message : '';
        console.error('[GenerateSchedule] Error:', error.status, backendMessage, error.error);
        
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
          sugerencia: `Propuesta generada localmente porque el backend respondio con error ${error.status}: ${backendMessage || 'Sin detalles'}`,
        };
        this.isLoading = false;
      },
    });
  }
}
