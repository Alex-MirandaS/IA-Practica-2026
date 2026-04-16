import { Repository } from 'typeorm';
import { CursoPrerrequisito } from './entities/curso-prerrequisito.entity';
import { CreateCursoPrerrequisitoDto } from './dto/create-curso-prerrequisito.dto';
import { UpdateCursoPrerrequisitoDto } from './dto/update-curso-prerrequisito.dto';
export declare class CursoPrerrequisitoService {
    private readonly repository;
    constructor(repository: Repository<CursoPrerrequisito>);
    create(dto: CreateCursoPrerrequisitoDto): Promise<CursoPrerrequisito>;
    findAll(): Promise<CursoPrerrequisito[]>;
    findOne(id: number): Promise<CursoPrerrequisito | null>;
    update(id: number, dto: UpdateCursoPrerrequisitoDto): Promise<CursoPrerrequisito | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
