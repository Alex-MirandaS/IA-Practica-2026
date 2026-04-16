import { SemestreService } from './semestre.service';
import { CreateSemestreDto } from './dto/create-semestre.dto';
import { UpdateSemestreDto } from './dto/update-semestre.dto';
export declare class SemestreController {
    private readonly semestreService;
    constructor(semestreService: SemestreService);
    create(createSemestreDto: CreateSemestreDto): Promise<import("./entities/semestre.entity").Semestre>;
    findAll(): Promise<import("./entities/semestre.entity").Semestre[]>;
    findOne(id: string): Promise<import("./entities/semestre.entity").Semestre | null>;
    update(id: string, updateSemestreDto: UpdateSemestreDto): Promise<import("./entities/semestre.entity").Semestre | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
