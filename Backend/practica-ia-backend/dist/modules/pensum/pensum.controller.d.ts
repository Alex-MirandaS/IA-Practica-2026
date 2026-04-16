import { PensumService } from './pensum.service';
import { CreatePensumDto } from './dto/create-pensum.dto';
import { UpdatePensumDto } from './dto/update-pensum.dto';
export declare class PensumController {
    private readonly pensumService;
    constructor(pensumService: PensumService);
    create(createPensumDto: CreatePensumDto): Promise<import("./entities/pensum.entity").Pensum>;
    findAll(): Promise<import("./entities/pensum.entity").Pensum[]>;
    findOne(id: string): Promise<import("./entities/pensum.entity").Pensum | null>;
    update(id: string, updatePensumDto: UpdatePensumDto): Promise<import("./entities/pensum.entity").Pensum | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
