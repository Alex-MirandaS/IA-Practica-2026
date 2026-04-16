import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AcademicPerformanceSummary,
  ApiMessage,
  FileUploadRequest,
  GeneratedSchedule,
  PensumCourse,
  RepetitionItem,
  ScheduleGenerationRequest,
} from '../models/academic.models';

@Injectable({
  providedIn: 'root',
})
export class AcademicApiService {
  private readonly baseUrl = 'http://localhost:4001';

  constructor(private readonly http: HttpClient) {}

  uploadBulkData(target: string, payload: FileUploadRequest): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.baseUrl}/import-csv/${target}`, payload);
  }

  getPensum(): Observable<PensumCourse[]> {
    return this.http.get<PensumCourse[]>(`${this.baseUrl}/pensum`);
  }

  generateCustomSchedule(request: ScheduleGenerationRequest): Observable<GeneratedSchedule> {
    return this.http.post<GeneratedSchedule>(`${this.baseUrl}/horario-estudiante/generar`, request);
  }

  previewSchedule(idEstudiante: number): Observable<{ cursos: Array<{ id_curso: number; codigo: string; nombre: string; creditos: number; obligatorio: boolean; seleccionado_por_defecto: boolean; variantes: Array<{ id_horario_general: number; seccion: string; bloques: Array<{ day: string; start: number; end: number }>; min_creditos_requeridos: number; }>; }>; creditos_aprobados_acumulados: number; id_estudiante: number; }> {
    return this.http.get<{ cursos: Array<{ id_curso: number; codigo: string; nombre: string; creditos: number; obligatorio: boolean; seleccionado_por_defecto: boolean; variantes: Array<{ id_horario_general: number; seccion: string; bloques: Array<{ day: string; start: number; end: number }>; min_creditos_requeridos: number; }>; }>; creditos_aprobados_acumulados: number; id_estudiante: number; }>(`${this.baseUrl}/horario-estudiante/preview/${idEstudiante}`);
  }

  getAcademicSummary(): Observable<AcademicPerformanceSummary> {
    return this.http.get<AcademicPerformanceSummary>(`${this.baseUrl}/resumen-estudiante`);
  }

  getRepetitions(): Observable<RepetitionItem[]> {
    return this.http.get<RepetitionItem[]>(`${this.baseUrl}/control-repitencias`);
  }
}
