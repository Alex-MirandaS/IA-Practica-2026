import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
export declare class CursoController {
    private readonly cursoService;
    constructor(cursoService: CursoService);
    create(createCursoDto: CreateCursoDto): Promise<import("./entities/curso.entity").Curso>;
    findAll(): Promise<import("./entities/curso.entity").Curso[]>;
    findOne(id: string): Promise<import("./entities/curso.entity").Curso | null>;
    update(id: string, updateCursoDto: UpdateCursoDto): Promise<import("./entities/curso.entity").Curso | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
