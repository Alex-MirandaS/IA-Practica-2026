import { SeleccionCursosService } from './seleccion-cursos.service';
import { CreateSeleccionCursosDto } from './dto/create-seleccion-cursos.dto';
import { UpdateSeleccionCursosDto } from './dto/update-seleccion-cursos.dto';
export declare class SeleccionCursosController {
    private readonly service;
    constructor(service: SeleccionCursosService);
    create(dto: CreateSeleccionCursosDto): Promise<import("./entities/seleccion-cursos.entity").SeleccionCursos>;
    findAll(): Promise<import("./entities/seleccion-cursos.entity").SeleccionCursos[]>;
    findOne(id: string): Promise<import("./entities/seleccion-cursos.entity").SeleccionCursos | null>;
    update(id: string, dto: UpdateSeleccionCursosDto): Promise<import("./entities/seleccion-cursos.entity").SeleccionCursos | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
