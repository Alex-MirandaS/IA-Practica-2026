import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { Ciclo } from '../../ciclo/entities/ciclo.entity';
export declare class HistorialAcademico {
    id: number;
    estudiante?: Estudiante;
    curso?: Curso;
    nota?: number;
    aprobado?: boolean;
    anio?: number;
    ciclo?: Ciclo;
    intentos: number;
}
