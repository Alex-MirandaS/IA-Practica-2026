import { HorarioEstudiante } from '../../horario-estudiante/entities/horario-estudiante.entity';
import { HorarioGeneral } from '../../horario-general/entities/horario-general.entity';
export declare class DetalleHorario {
    id: number;
    horario?: HorarioEstudiante;
    horarioGeneral?: HorarioGeneral;
}
