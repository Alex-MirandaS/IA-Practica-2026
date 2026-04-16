import { Repository } from 'typeorm';
import { SeleccionCursos } from './entities/seleccion-cursos.entity';
import { CreateSeleccionCursosDto } from './dto/create-seleccion-cursos.dto';
import { UpdateSeleccionCursosDto } from './dto/update-seleccion-cursos.dto';
export declare class SeleccionCursosService {
    private readonly repository;
    constructor(repository: Repository<SeleccionCursos>);
    create(dto: CreateSeleccionCursosDto): Promise<SeleccionCursos>;
    findAll(): Promise<SeleccionCursos[]>;
    findOne(id: number): Promise<SeleccionCursos | null>;
    update(id: number, dto: UpdateSeleccionCursosDto): Promise<SeleccionCursos | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
