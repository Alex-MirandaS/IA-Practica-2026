import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';

@Entity('resumen_estudiante')
export class ResumenEstudiante {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Estudiante, { nullable: true })
  @JoinColumn({ name: 'id_estudiante' })
  estudiante?: Estudiante;

  @Column({ type: 'int', nullable: true })
  cursos_aprobados?: number;

  @Column({ type: 'int', nullable: true })
  cursos_reprobados?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  porcentaje_aprobacion?: number;

  @Column({ type: 'int', nullable: true })
  creditos_acumulados?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  promedio_general?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  promedio_limpio?: number;
}
