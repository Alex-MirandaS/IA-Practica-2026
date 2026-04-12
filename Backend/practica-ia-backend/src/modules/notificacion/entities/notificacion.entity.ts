import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';

@Entity('notificacion')
export class Notificacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Estudiante, { nullable: true })
  @JoinColumn({ name: 'id_estudiante' })
  estudiante?: Estudiante;

  @Column({ type: 'text', nullable: true })
  mensaje?: string;

  @Column({ type: 'boolean', default: false })
  leido!: boolean;

  @CreateDateColumn({ name: 'fecha' })
  fecha!: Date;
}
