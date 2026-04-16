export interface ApiMessage {
  message: string;
  detail?: string;
  success?: boolean;
}

export interface PensumCourse {
  codigo: string;
  nombre: string;
  creditos: number;
  semestre: number;
  prerequisitos?: string[];
  area?: string;
  estado?: 'Pendiente' | 'Aprobada' | 'En curso';
}

export interface FileUploadRequest {
  fileName: string;
  payloadBase64: string;
  type: string;
}

export interface StudentProfile {
  id?: string;
  carne?: string;
  nombre?: string;
  carrera?: string;
  correo?: string;
  creditosAprobados?: number;
  promedio?: number;
}

export interface ScheduleGenerationRequest {
  id_estudiante: number;
  selected_course_ids: number[];
  max_credits?: number;
  population_size?: number;
  generations?: number;
  persist?: boolean;
}

export interface ScheduleBlock {
  dia: string;
  horaInicio?: string;
  horaFin?: string;
  start?: number;
  end?: number;
  curso?: string;
  aula?: string;
  seccion?: string;
}

export interface GeneratedSchedule {
  id?: string;
  status?: string;
  id_estudiante?: number;
  id_horario_estudiante?: number;
  creditos_seleccionados?: number;
  max_creditos?: number;
  cursos?: Array<{
    id_curso: number;
    codigo: string;
    nombre: string;
    obligatorio?: boolean;
    prioridad_bottleneck?: number;
    id_horario_general: number;
    seccion: string;
    bloques: ScheduleBlock[];
  }>;
  conflictos?: Array<{
    curso_a: { id_curso: number; codigo: string; nombre: string; seccion: string };
    curso_b: { id_curso: number; codigo: string; nombre: string; seccion: string };
    bloque_a: { day: string; start: number; end: number };
    bloque_b: { day: string; start: number; end: number };
  }>;
  alternativas?: Array<{
    id_curso: number;
    codigo: string;
    nombre: string;
    variantes_sin_traslape: Array<{
      horarioGeneralId: number;
      idCursoHorario: number;
      seccion: string;
      blocks: { day: string; start: number; end: number }[];
      minCreditosRequeridos: number;
    }>;
  }>;
  sugerencia?: string;
}

export interface AcademicPerformanceItem {
  curso: string;
  semestre: number;
  nota: number;
  estado: string;
  creditos: number;
}

export interface AcademicPerformanceSummary {
  promedioGeneral: number;
  creditosAprobados: number;
  creditosEnCurso: number;
  riesgoRepitencia: number;
  alertas: string[];
  detalle: AcademicPerformanceItem[];
}

export interface RepetitionItem {
  curso: string;
  vecesCursado: number;
  ultimoEstado: string;
  recomendacion: string;
}
