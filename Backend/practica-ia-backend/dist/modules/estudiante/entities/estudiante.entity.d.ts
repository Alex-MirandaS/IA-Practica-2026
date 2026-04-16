import { Carrera } from '../../carrera/entities/carrera.entity';
export declare class Estudiante {
    id: number;
    carnet: string;
    nombre?: string;
    apellido?: string;
    correo?: string;
    carrera?: Carrera;
}
