import { CursoPrerrequisitoService } from './curso-prerrequisito.service';
import { CreateCursoPrerrequisitoDto } from './dto/create-curso-prerrequisito.dto';
import { UpdateCursoPrerrequisitoDto } from './dto/update-curso-prerrequisito.dto';
export declare class CursoPrerrequisitoController {
    private readonly service;
    constructor(service: CursoPrerrequisitoService);
    create(dto: CreateCursoPrerrequisitoDto): Promise<import("./entities/curso-prerrequisito.entity").CursoPrerrequisito>;
    findAll(): Promise<import("./entities/curso-prerrequisito.entity").CursoPrerrequisito[]>;
    findByPensum(idPensum: string): Promise<import("./entities/curso-prerrequisito.entity").CursoPrerrequisito[]>;
    findOne(id: string): Promise<import("./entities/curso-prerrequisito.entity").CursoPrerrequisito | null>;
    update(id: string, dto: UpdateCursoPrerrequisitoDto): Promise<import("./entities/curso-prerrequisito.entity").CursoPrerrequisito | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
