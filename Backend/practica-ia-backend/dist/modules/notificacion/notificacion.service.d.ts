import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
export declare class NotificacionService {
    private readonly repository;
    constructor(repository: Repository<Notificacion>);
    create(dto: CreateNotificacionDto): Promise<Notificacion>;
    findAll(): Promise<Notificacion[]>;
    findOne(id: number): Promise<Notificacion | null>;
    update(id: number, dto: UpdateNotificacionDto): Promise<Notificacion | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
