import { DataSource, Repository } from 'typeorm';
import { HorarioGeneral } from './entities/horario-general.entity';
import { CreateHorarioGeneralDto } from './dto/create-horario-general.dto';
import { UpdateHorarioGeneralDto } from './dto/update-horario-general.dto';
type SyncHorarioGeneralResult = {
    horarioId: number;
    horarioNombre?: string;
    fetchedRows: number;
    inserted: number;
    updated: number;
    deactivated: number;
    warnings: string[];
};
export declare class HorarioGeneralService {
    private readonly dataSource;
    private readonly repository;
    constructor(dataSource: DataSource, repository: Repository<HorarioGeneral>);
    create(dto: CreateHorarioGeneralDto): Promise<HorarioGeneral>;
    findAll(): Promise<HorarioGeneral[]>;
    findOne(id: number): Promise<HorarioGeneral | null>;
    update(id: number, dto: UpdateHorarioGeneralDto): Promise<HorarioGeneral | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    syncLatestFromScheduler(): Promise<SyncHorarioGeneralResult>;
    syncByHorarioId(horarioId: number): Promise<SyncHorarioGeneralResult>;
    private syncFromSchedulerByHorarioId;
    private resolveSeccionForSync;
    private fetchCollectionWithFallback;
    private normalizeCollection;
    private readNumber;
    private readString;
    private readObject;
}
export {};
