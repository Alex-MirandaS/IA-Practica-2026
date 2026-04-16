import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('curso')
export class Curso {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo!: string;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'int', nullable: true })
  id_externo?: number;
}
