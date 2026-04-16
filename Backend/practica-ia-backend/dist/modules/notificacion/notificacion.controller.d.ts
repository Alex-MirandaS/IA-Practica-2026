import { NotificacionService } from './notificacion.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
export declare class NotificacionController {
    private readonly service;
    constructor(service: NotificacionService);
    create(dto: CreateNotificacionDto): Promise<import("./entities/notificacion.entity").Notificacion>;
    findAll(): Promise<import("./entities/notificacion.entity").Notificacion[]>;
    findOne(id: string): Promise<import("./entities/notificacion.entity").Notificacion | null>;
    update(id: string, dto: UpdateNotificacionDto): Promise<import("./entities/notificacion.entity").Notificacion | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
