import { Semestre } from '../../semestre/entities/semestre.entity';
import { Carrera } from '../../carrera/entities/carrera.entity';
import { Curso } from '../../curso/entities/curso.entity';
export declare class Pensum {
    id: number;
    obligatorio: boolean;
    creditos: number;
    semestre?: Semestre;
    carrera?: Carrera;
    curso?: Curso;
}
