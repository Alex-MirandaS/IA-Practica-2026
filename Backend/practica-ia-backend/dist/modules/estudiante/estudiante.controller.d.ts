import { EstudianteService } from './estudiante.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
export declare class EstudianteController {
    private readonly estudianteService;
    constructor(estudianteService: EstudianteService);
    create(createEstudianteDto: CreateEstudianteDto): Promise<import("./entities/estudiante.entity").Estudiante>;
    findAll(): Promise<import("./entities/estudiante.entity").Estudiante[]>;
    findOne(id: string): Promise<import("./entities/estudiante.entity").Estudiante | null>;
    update(id: string, updateEstudianteDto: UpdateEstudianteDto): Promise<import("./entities/estudiante.entity").Estudiante | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
