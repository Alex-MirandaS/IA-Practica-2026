import { Repository } from 'typeorm';
import { Pensum } from './entities/pensum.entity';
import { CreatePensumDto } from './dto/create-pensum.dto';
import { UpdatePensumDto } from './dto/update-pensum.dto';
export declare class PensumService {
    private readonly pensumRepository;
    constructor(pensumRepository: Repository<Pensum>);
    create(createPensumDto: CreatePensumDto): Promise<Pensum>;
    findAll(): Promise<Pensum[]>;
    findOne(id: number): Promise<Pensum | null>;
    update(id: number, updatePensumDto: UpdatePensumDto): Promise<Pensum | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
