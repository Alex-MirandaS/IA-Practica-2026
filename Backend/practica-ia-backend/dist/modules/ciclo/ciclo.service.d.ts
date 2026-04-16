import { Repository } from 'typeorm';
import { Ciclo } from './entities/ciclo.entity';
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';
export declare class CicloService {
    private readonly cicloRepository;
    constructor(cicloRepository: Repository<Ciclo>);
    create(createCicloDto: CreateCicloDto): Promise<Ciclo>;
    findAll(): Promise<Ciclo[]>;
    findOne(id: number): Promise<Ciclo | null>;
    update(id: number, updateCicloDto: UpdateCicloDto): Promise<Ciclo | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
