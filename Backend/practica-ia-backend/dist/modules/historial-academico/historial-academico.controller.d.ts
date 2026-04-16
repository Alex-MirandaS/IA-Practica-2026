import { HistorialAcademicoService } from './historial-academico.service';
import { CreateHistorialAcademicoDto } from './dto/create-historial-academico.dto';
import { UpdateHistorialAcademicoDto } from './dto/update-historial-academico.dto';
export declare class HistorialAcademicoController {
    private readonly service;
    constructor(service: HistorialAcademicoService);
    create(dto: CreateHistorialAcademicoDto): Promise<import("./entities/historial-academico.entity").HistorialAcademico>;
    findAll(): Promise<import("./entities/historial-academico.entity").HistorialAcademico[]>;
    findOne(id: string): Promise<import("./entities/historial-academico.entity").HistorialAcademico | null>;
    update(id: string, dto: UpdateHistorialAcademicoDto): Promise<import("./entities/historial-academico.entity").HistorialAcademico | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
