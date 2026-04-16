import { Repository } from 'typeorm';
import { DetalleHorario } from './entities/detalle-horario.entity';
import { CreateDetalleHorarioDto } from './dto/create-detalle-horario.dto';
import { UpdateDetalleHorarioDto } from './dto/update-detalle-horario.dto';
export declare class DetalleHorarioService {
    private readonly repository;
    constructor(repository: Repository<DetalleHorario>);
    create(dto: CreateDetalleHorarioDto): Promise<DetalleHorario>;
    findAll(): Promise<DetalleHorario[]>;
    findOne(id: number): Promise<DetalleHorario | null>;
    update(id: number, dto: UpdateDetalleHorarioDto): Promise<DetalleHorario | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
