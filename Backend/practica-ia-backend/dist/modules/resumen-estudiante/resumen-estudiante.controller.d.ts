import { ResumenEstudianteService } from './resumen-estudiante.service';
import { CreateResumenEstudianteDto } from './dto/create-resumen-estudiante.dto';
import { UpdateResumenEstudianteDto } from './dto/update-resumen-estudiante.dto';
export declare class ResumenEstudianteController {
    private readonly service;
    constructor(service: ResumenEstudianteService);
    create(dto: CreateResumenEstudianteDto): Promise<import("./entities/resumen-estudiante.entity").ResumenEstudiante>;
    findAll(): Promise<import("./entities/resumen-estudiante.entity").ResumenEstudiante[]>;
    findOne(id: string): Promise<import("./entities/resumen-estudiante.entity").ResumenEstudiante | null>;
    update(id: string, dto: UpdateResumenEstudianteDto): Promise<import("./entities/resumen-estudiante.entity").ResumenEstudiante | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
