import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('carrera')
export class Carrera {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;
}
