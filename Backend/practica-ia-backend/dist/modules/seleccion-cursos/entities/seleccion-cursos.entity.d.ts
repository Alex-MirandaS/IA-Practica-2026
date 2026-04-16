import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Curso } from '../../curso/entities/curso.entity';
export declare class SeleccionCursos {
    id: number;
    estudiante?: Estudiante;
    curso?: Curso;
    seleccionado: boolean;
}
