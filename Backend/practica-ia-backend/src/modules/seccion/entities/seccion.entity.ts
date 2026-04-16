import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('seccion')
export class Seccion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 10 })
  seccion!: string;
}
