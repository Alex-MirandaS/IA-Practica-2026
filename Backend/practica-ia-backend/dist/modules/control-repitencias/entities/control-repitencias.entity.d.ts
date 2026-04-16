import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Curso } from '../../curso/entities/curso.entity';
export declare class ControlRepitencias {
    id: number;
    estudiante?: Estudiante;
    curso?: Curso;
    total_intentos: number;
    alerta: boolean;
}
