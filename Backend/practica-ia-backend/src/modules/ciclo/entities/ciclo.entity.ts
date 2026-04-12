import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ciclo')
export class Ciclo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  ciclo!: string;
}
