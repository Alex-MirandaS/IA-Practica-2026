import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  AcademicHistoryResponse,
  AcademicPerformanceSummary,
  ApiMessage,
  CareerOption,
  GeneratedSchedule,
  PensumCourse,
  PensumCareerApiItem,
  PensumPrerequisiteApiItem,
  PreviewScheduleResponse,
  RepetitionItem,
  ScheduleGenerationRequest,
} from '../models/academic.models';

@Injectable({
  providedIn: 'root',
})
export class AcademicApiService {
  private readonly baseUrl = 'http://localhost:4001/api';

  constructor(private readonly http: HttpClient) {}

  uploadBulkData(target: string, file: File): Observable<ApiMessage> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<ApiMessage>(`${this.baseUrl}/import-csv/${target}`, formData);
  }

  getCareers(): Observable<CareerOption[]> {
    return this.http.get<Array<Record<string, unknown>>>(`${this.baseUrl}/carrera`).pipe(
      map((rows) =>
        (Array.isArray(rows) ? rows : [])
          .map((row) => {
            const idRaw = row['id'] ?? row['id_carrera'] ?? row['carreraId'];
            const nombreRaw = row['nombre'] ?? row['nombre_carrera'] ?? row['carrera'];
            const codigoRaw = row['codigo'] ?? row['codigo_carrera'];

            const id = Number(idRaw);
            const nombre = typeof nombreRaw === 'string' ? nombreRaw.trim() : '';
            const codigo = typeof codigoRaw === 'string' ? codigoRaw.trim() : undefined;

            if (!Number.isFinite(id) || !nombre) {
              return null;
            }

            return { id, nombre, codigo } as CareerOption;
          })
          .filter((row): row is CareerOption => row !== null),
      ),
    );
  }

  getPensum(careerId?: number): Observable<PensumCourse[]> {
    if (!careerId) {
      const params = undefined;
      return this.http.get<PensumCourse[]>(`${this.baseUrl}/pensum`, { params });
    }

    return this.http.get<PensumCareerApiItem[]>(`${this.baseUrl}/pensum/carrera/${careerId}`).pipe(
      map((rows) =>
        (Array.isArray(rows) ? rows : []).map((row) => ({
          id: row.id,
          codigo: String(row.curso?.codigo ?? '').trim(),
          nombre: String(row.curso?.nombre ?? '').trim(),
          creditos: Number(row.creditos) || 0,
          semestre: Number(row.semestre?.id) || 0,
          idCarrera: row.carrera?.id,
          carrera: row.carrera?.nombre,
          area: row.obligatorio ? 'Obligatorio' : 'Optativo',
        })),
      ),
    );
  }

  getPensumPrerequisites(pensumId: number): Observable<PensumPrerequisiteApiItem[]> {
    return this.http.get<PensumPrerequisiteApiItem[]>(`${this.baseUrl}/curso-prerrequisito/pensum/${pensumId}`);
  }

  generateCustomSchedule(request: ScheduleGenerationRequest): Observable<GeneratedSchedule> {
    return this.http.post<GeneratedSchedule>(`${this.baseUrl}/horario-estudiante/generar`, request);
  }

  previewSchedule(carnet: string): Observable<PreviewScheduleResponse> {
    return this.http.get<PreviewScheduleResponse>(`${this.baseUrl}/horario-estudiante/preview/${encodeURIComponent(carnet)}`);
  }

  getAcademicSummary(): Observable<AcademicPerformanceSummary> {
    return this.http.get<AcademicPerformanceSummary>(`${this.baseUrl}/resumen-estudiante`);
  }

  getRepetitions(): Observable<RepetitionItem[]> {
    return this.http.get<RepetitionItem[]>(`${this.baseUrl}/control-repitencias`);
  }

  getAcademicHistory(carnet: string): Observable<AcademicHistoryResponse> {
    return this.http.get<AcademicHistoryResponse>(`${this.baseUrl}/historial-academico/estudiante/carnet/${encodeURIComponent(carnet)}`);
  }
}
