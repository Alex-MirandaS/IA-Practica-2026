import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Carrera } from '../../carrera/entities/carrera.entity';

@Entity('estudiante')
export class Estudiante {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  carnet!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellido?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  correo?: string;

  @ManyToOne(() => Carrera, { nullable: true })
  @JoinColumn({ name: 'id_carrera' })
  carrera?: Carrera;
}
