import { Repository } from 'typeorm';
import { Seccion } from './entities/seccion.entity';
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';
export declare class SeccionService {
    private readonly seccionRepository;
    constructor(seccionRepository: Repository<Seccion>);
    create(createSeccionDto: CreateSeccionDto): Promise<Seccion>;
    findAll(): Promise<Seccion[]>;
    findOne(id: number): Promise<Seccion | null>;
    update(id: number, updateSeccionDto: UpdateSeccionDto): Promise<Seccion | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
