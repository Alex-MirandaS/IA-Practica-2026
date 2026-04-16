import { Repository } from 'typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
export declare class EstudianteService {
    private readonly estudianteRepository;
    constructor(estudianteRepository: Repository<Estudiante>);
    create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante>;
    findAll(): Promise<Estudiante[]>;
    findOne(id: number): Promise<Estudiante | null>;
    update(id: number, updateEstudianteDto: UpdateEstudianteDto): Promise<Estudiante | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
