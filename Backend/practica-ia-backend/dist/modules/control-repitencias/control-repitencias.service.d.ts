import { Repository } from 'typeorm';
import { ControlRepitencias } from './entities/control-repitencias.entity';
import { CreateControlRepitenciasDto } from './dto/create-control-repitencias.dto';
import { UpdateControlRepitenciasDto } from './dto/update-control-repitencias.dto';
export declare class ControlRepitenciasService {
    private readonly repository;
    constructor(repository: Repository<ControlRepitencias>);
    create(dto: CreateControlRepitenciasDto): Promise<ControlRepitencias>;
    findAll(): Promise<ControlRepitencias[]>;
    findOne(id: number): Promise<ControlRepitencias | null>;
    update(id: number, dto: UpdateControlRepitenciasDto): Promise<ControlRepitencias | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
