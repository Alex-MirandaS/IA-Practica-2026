import { Estudiante } from '../../estudiante/entities/estudiante.entity';
export declare class Notificacion {
    id: number;
    estudiante?: Estudiante;
    mensaje?: string;
    leido: boolean;
    fecha: Date;
}
