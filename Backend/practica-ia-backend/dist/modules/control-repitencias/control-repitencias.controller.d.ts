import { ControlRepitenciasService } from './control-repitencias.service';
import { CreateControlRepitenciasDto } from './dto/create-control-repitencias.dto';
import { UpdateControlRepitenciasDto } from './dto/update-control-repitencias.dto';
export declare class ControlRepitenciasController {
    private readonly service;
    constructor(service: ControlRepitenciasService);
    create(dto: CreateControlRepitenciasDto): Promise<import("./entities/control-repitencias.entity").ControlRepitencias>;
    findAll(): Promise<import("./entities/control-repitencias.entity").ControlRepitencias[]>;
    findOne(id: string): Promise<import("./entities/control-repitencias.entity").ControlRepitencias | null>;
    update(id: string, dto: UpdateControlRepitenciasDto): Promise<import("./entities/control-repitencias.entity").ControlRepitencias | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
