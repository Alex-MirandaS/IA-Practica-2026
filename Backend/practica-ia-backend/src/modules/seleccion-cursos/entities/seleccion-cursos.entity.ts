import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Curso } from '../../curso/entities/curso.entity';

@Entity('seleccion_cursos')
export class SeleccionCursos {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Estudiante, { nullable: true })
  @JoinColumn({ name: 'id_estudiante' })
  estudiante?: Estudiante;

  @ManyToOne(() => Curso, { nullable: true })
  @JoinColumn({ name: 'id_curso' })
  curso?: Curso;

  @Column({ type: 'boolean', default: true })
  seleccionado!: boolean;
}
