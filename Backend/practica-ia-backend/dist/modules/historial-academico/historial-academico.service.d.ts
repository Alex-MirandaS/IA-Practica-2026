import { Repository } from 'typeorm';
import { HistorialAcademico } from './entities/historial-academico.entity';
import { CreateHistorialAcademicoDto } from './dto/create-historial-academico.dto';
import { UpdateHistorialAcademicoDto } from './dto/update-historial-academico.dto';
export declare class HistorialAcademicoService {
    private readonly repository;
    constructor(repository: Repository<HistorialAcademico>);
    create(dto: CreateHistorialAcademicoDto): Promise<HistorialAcademico>;
    findAll(): Promise<HistorialAcademico[]>;
    findOne(id: number): Promise<HistorialAcademico | null>;
    update(id: number, dto: UpdateHistorialAcademicoDto): Promise<HistorialAcademico | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
