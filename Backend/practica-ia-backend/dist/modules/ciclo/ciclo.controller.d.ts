import { CicloService } from './ciclo.service';
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';
export declare class CicloController {
    private readonly cicloService;
    constructor(cicloService: CicloService);
    create(createCicloDto: CreateCicloDto): Promise<import("./entities/ciclo.entity").Ciclo>;
    findAll(): Promise<import("./entities/ciclo.entity").Ciclo[]>;
    findOne(id: string): Promise<import("./entities/ciclo.entity").Ciclo | null>;
    update(id: string, updateCicloDto: UpdateCicloDto): Promise<import("./entities/ciclo.entity").Ciclo | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
