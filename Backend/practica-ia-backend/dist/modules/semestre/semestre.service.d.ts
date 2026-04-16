import { Repository } from 'typeorm';
import { Semestre } from './entities/semestre.entity';
import { CreateSemestreDto } from './dto/create-semestre.dto';
import { UpdateSemestreDto } from './dto/update-semestre.dto';
export declare class SemestreService {
    private readonly semestreRepository;
    constructor(semestreRepository: Repository<Semestre>);
    create(createSemestreDto: CreateSemestreDto): Promise<Semestre>;
    findAll(): Promise<Semestre[]>;
    findOne(id: number): Promise<Semestre | null>;
    update(id: number, updateSemestreDto: UpdateSemestreDto): Promise<Semestre | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
