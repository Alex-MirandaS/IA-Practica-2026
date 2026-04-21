export interface ApiMessage {
  message: string;
  detail?: string;
  success?: boolean;
}

export interface PensumCourse {
  id?: number;
  codigo: string;
  nombre: string;
  creditos: number;
  semestre: number;
  idCarrera?: number;
  id_carrera?: number;
  carreraId?: number;
  carrera?: string;
  prerequisitos?: string[];
  area?: string;
  estado?: 'Pendiente' | 'Aprobada' | 'En curso';
}

export interface PensumCareerApiItem {
  id: number;
  obligatorio: boolean;
  creditos: number;
  semestre: {
    id: number;
    semestre: string;
  };
  carrera: {
    id: number;
    nombre: string;
  };
  curso: {
    id: number;
    codigo?: string | null;
    nombre: string;
    id_externo?: number | null;
  };
}

export interface PensumPrerequisiteApiItem {
  id: number;
  pensum: {
    id: number;
    obligatorio: boolean;
    creditos: number;
  };
  prerrequisito: {
    id: number;
    codigo?: string | null;
    nombre: string;
    id_externo?: number | null;
  };
}

export interface CareerOption {
  id: number;
  nombre: string;
  codigo?: string;
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

export interface AcademicHistoryItem {
  id: number;
  estudiante: {
    id: number;
    carnet: string;
    nombre: string;
    apellido: string;
    correo: string;
  };
  curso: {
    id: number;
    codigo?: string | null;
    nombre: string;
    id_externo?: number | null;
  };
  nota: string;
  aprobado: boolean;
  anio: number;
  ciclo: {
    id: number;
    ciclo: string;
  };
  intentos: number;
}

export interface AcademicHistoryAlertApiItem {
  id_curso: number;
  codigo: string;
  nombre: string;
  reprobados: number;
  alerta: boolean;
}

export interface AcademicHistorySummaryApiItem {
  cursos_aprobados: number;
  cursos_reprobados: number;
  porcentaje_aprobacion: number;
  creditos_acumulados: number;
  promedio_general: number | null;
  promedio_limpio: number | null;
  riesgo_repitencia: boolean;
  nivel_riesgo_repitencia: string;
  porcentaje_riesgo_repitencia: number;
}

export interface AcademicHistoryResponse {
  estudiante: {
    id: number;
    carnet: string;
    nombre: string;
    apellido: string;
    correo: string;
  };
  resumen: AcademicHistorySummaryApiItem;
  alertas_repitencia: AcademicHistoryAlertApiItem[];
  historial: AcademicHistoryItem[];
}
