import { Seccion } from '../../seccion/entities/seccion.entity';
export declare class HorarioGeneral {
    id: number;
    id_curso_horario: number;
    seccion?: Seccion;
    cupo_maximo?: number;
    activo: boolean;
    fecha_sincronizacion: Date;
}
