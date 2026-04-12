import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('semestre')
export class Semestre {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  semestre!: string;
}
