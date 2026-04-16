import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Seccion } from '../../seccion/entities/seccion.entity';

@Entity('horario_general')
export class HorarioGeneral {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  id_curso_horario!: number;

  @ManyToOne(() => Seccion, { nullable: true })
  @JoinColumn({ name: 'id_seccion' })
  seccion?: Seccion;

  @Column({ type: 'int', nullable: true })
  cupo_maximo?: number;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @CreateDateColumn({ name: 'fecha_sincronizacion' })
  fecha_sincronizacion!: Date;
}
