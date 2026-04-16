import { Estudiante } from '../../estudiante/entities/estudiante.entity';
export declare class ResumenEstudiante {
    id: number;
    estudiante?: Estudiante;
    cursos_aprobados?: number;
    cursos_reprobados?: number;
    porcentaje_aprobacion?: number;
    creditos_acumulados?: number;
    promedio_general?: number;
    promedio_limpio?: number;
}
