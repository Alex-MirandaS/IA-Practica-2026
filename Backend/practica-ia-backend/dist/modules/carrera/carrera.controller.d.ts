import { CarreraService } from './carrera.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
export declare class CarreraController {
    private readonly carreraService;
    constructor(carreraService: CarreraService);
    create(createCarreraDto: CreateCarreraDto): Promise<import("./entities/carrera.entity").Carrera>;
    findAll(): Promise<import("./entities/carrera.entity").Carrera[]>;
    findOne(id: string): Promise<import("./entities/carrera.entity").Carrera | null>;
    update(id: string, updateCarreraDto: UpdateCarreraDto): Promise<import("./entities/carrera.entity").Carrera | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
