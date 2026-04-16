import { DetalleHorarioService } from './detalle-horario.service';
import { CreateDetalleHorarioDto } from './dto/create-detalle-horario.dto';
import { UpdateDetalleHorarioDto } from './dto/update-detalle-horario.dto';
export declare class DetalleHorarioController {
    private readonly service;
    constructor(service: DetalleHorarioService);
    create(dto: CreateDetalleHorarioDto): Promise<import("./entities/detalle-horario.entity").DetalleHorario>;
    findAll(): Promise<import("./entities/detalle-horario.entity").DetalleHorario[]>;
    findOne(id: string): Promise<import("./entities/detalle-horario.entity").DetalleHorario | null>;
    update(id: string, dto: UpdateDetalleHorarioDto): Promise<import("./entities/detalle-horario.entity").DetalleHorario | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
