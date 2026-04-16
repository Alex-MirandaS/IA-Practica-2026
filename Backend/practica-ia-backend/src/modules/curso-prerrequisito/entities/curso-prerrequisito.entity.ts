import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pensum } from '../../pensum/entities/pensum.entity';
import { Curso } from '../../curso/entities/curso.entity';

@Entity('curso_prerrequisito')
export class CursoPrerrequisito {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Pensum, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_pensum' })
  pensum?: Pensum;

  @ManyToOne(() => Curso, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_prerrequisito' })
  prerrequisito?: Curso;
}
