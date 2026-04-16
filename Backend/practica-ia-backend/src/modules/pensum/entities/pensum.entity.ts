import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Semestre } from '../../semestre/entities/semestre.entity';
import { Carrera } from '../../carrera/entities/carrera.entity';
import { Curso } from '../../curso/entities/curso.entity';

@Entity('pensum')
export class Pensum {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'boolean', default: true })
  obligatorio!: boolean;

  @Column({ type: 'int' })
  creditos!: number;

  @ManyToOne(() => Semestre, { nullable: true })
  @JoinColumn({ name: 'id_semestre' })
  semestre?: Semestre;

  @ManyToOne(() => Carrera, { nullable: true })
  @JoinColumn({ name: 'id_carrera' })
  carrera?: Carrera;

  @ManyToOne(() => Curso, { nullable: true })
  @JoinColumn({ name: 'id_curso' })
  curso?: Curso;
}
