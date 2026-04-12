import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';

@Entity('horario_estudiante')
export class HorarioEstudiante {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Estudiante, { nullable: true })
  @JoinColumn({ name: 'id_estudiante' })
  estudiante?: Estudiante;

  @CreateDateColumn({ name: 'fecha_generacion' })
  fecha_generacion!: Date;
}
