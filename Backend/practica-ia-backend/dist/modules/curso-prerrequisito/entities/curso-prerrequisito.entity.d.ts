import { Pensum } from '../../pensum/entities/pensum.entity';
import { Curso } from '../../curso/entities/curso.entity';
export declare class CursoPrerrequisito {
    id: number;
    pensum?: Pensum;
    prerrequisito?: Curso;
}
