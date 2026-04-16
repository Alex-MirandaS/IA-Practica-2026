import { Repository } from 'typeorm';
import { ResumenEstudiante } from './entities/resumen-estudiante.entity';
import { CreateResumenEstudianteDto } from './dto/create-resumen-estudiante.dto';
import { UpdateResumenEstudianteDto } from './dto/update-resumen-estudiante.dto';
export declare class ResumenEstudianteService {
    private readonly repository;
    constructor(repository: Repository<ResumenEstudiante>);
    create(dto: CreateResumenEstudianteDto): Promise<ResumenEstudiante>;
    findAll(): Promise<ResumenEstudiante[]>;
    findOne(id: number): Promise<ResumenEstudiante | null>;
    update(id: number, dto: UpdateResumenEstudianteDto): Promise<ResumenEstudiante | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
