import { SeccionService } from './seccion.service';
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';
export declare class SeccionController {
    private readonly seccionService;
    constructor(seccionService: SeccionService);
    create(createSeccionDto: CreateSeccionDto): Promise<import("./entities/seccion.entity").Seccion>;
    findAll(): Promise<import("./entities/seccion.entity").Seccion[]>;
    findOne(id: string): Promise<import("./entities/seccion.entity").Seccion | null>;
    update(id: string, updateSeccionDto: UpdateSeccionDto): Promise<import("./entities/seccion.entity").Seccion | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
