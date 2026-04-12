import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { HorarioEstudiante } from '../../horario-estudiante/entities/horario-estudiante.entity';
import { HorarioGeneral } from '../../horario-general/entities/horario-general.entity';

@Entity('detalle_horario')
export class DetalleHorario {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => HorarioEstudiante, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_horario' })
  horario?: HorarioEstudiante;

  @ManyToOne(() => HorarioGeneral, { nullable: true })
  @JoinColumn({ name: 'id_horario_general' })
  horarioGeneral?: HorarioGeneral;
}
