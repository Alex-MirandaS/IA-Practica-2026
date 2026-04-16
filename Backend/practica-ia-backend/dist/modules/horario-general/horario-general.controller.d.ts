import { HorarioGeneralService } from './horario-general.service';
import { CreateHorarioGeneralDto } from './dto/create-horario-general.dto';
import { UpdateHorarioGeneralDto } from './dto/update-horario-general.dto';
export declare class HorarioGeneralController {
    private readonly service;
    constructor(service: HorarioGeneralService);
    create(dto: CreateHorarioGeneralDto): Promise<import("./entities/horario-general.entity").HorarioGeneral>;
    syncLatest(): Promise<{
        horarioId: number;
        horarioNombre?: string;
        fetchedRows: number;
        inserted: number;
        updated: number;
        deactivated: number;
        warnings: string[];
    }>;
    syncByHorarioId(horarioId: number): Promise<{
        horarioId: number;
        horarioNombre?: string;
        fetchedRows: number;
        inserted: number;
        updated: number;
        deactivated: number;
        warnings: string[];
    }>;
    findAll(): Promise<import("./entities/horario-general.entity").HorarioGeneral[]>;
    findOne(id: string): Promise<import("./entities/horario-general.entity").HorarioGeneral | null>;
    update(id: string, dto: UpdateHorarioGeneralDto): Promise<import("./entities/horario-general.entity").HorarioGeneral | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
