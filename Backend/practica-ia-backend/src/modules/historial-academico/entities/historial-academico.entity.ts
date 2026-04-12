import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { Ciclo } from '../../ciclo/entities/ciclo.entity';

@Entity('historial_academico')
export class HistorialAcademico {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Estudiante, { nullable: true })
  @JoinColumn({ name: 'id_estudiante' })
  estudiante?: Estudiante;

  @ManyToOne(() => Curso, { nullable: true })
  @JoinColumn({ name: 'id_curso' })
  curso?: Curso;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  nota?: number;

  @Column({ type: 'boolean', nullable: true })
  aprobado?: boolean;

  @Column({ type: 'int', nullable: true })
  anio?: number;

  @ManyToOne(() => Ciclo, { nullable: true })
  @JoinColumn({ name: 'id_ciclo' })
  ciclo?: Ciclo;

  @Column({ type: 'int', default: 1 })
  intentos!: number;
}
