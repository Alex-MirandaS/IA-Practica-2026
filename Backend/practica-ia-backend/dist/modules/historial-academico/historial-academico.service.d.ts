import { Repository } from 'typeorm';
import { HistorialAcademico } from './entities/historial-academico.entity';
import { CreateHistorialAcademicoDto } from './dto/create-historial-academico.dto';
import { UpdateHistorialAcademicoDto } from './dto/update-historial-academico.dto';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Pensum } from '../pensum/entities/pensum.entity';
type HistorialAcademicoConRelaciones = {
    id: number;
    nota?: number | null;
    aprobado?: boolean | null;
    anio?: number | null;
    intentos?: number;
    estudiante?: {
        id: number;
        carnet: string;
        nombre?: string | null;
        apellido?: string | null;
        correo?: string | null;
    } | null;
    curso?: {
        id: number;
        codigo: string;
        nombre: string;
    } | null;
    ciclo?: {
        id: number;
        ciclo: string;
    } | null;
};
type CursoRepitenciaAlerta = {
    id_curso: number;
    codigo: string;
    nombre: string;
    reprobados: number;
    alerta: boolean;
};
type HistorialAcademicoResumen = {
    cursos_aprobados: number;
    cursos_reprobados: number;
    porcentaje_aprobacion: number;
    creditos_acumulados: number;
    promedio_general: number | null;
    promedio_limpio: number | null;
    riesgo_repitencia: boolean;
    nivel_riesgo_repitencia: 'bajo' | 'medio' | 'alto';
    porcentaje_riesgo_repitencia: number;
};
type HistorialAcademicoPorCarnetResponse = {
    estudiante: HistorialAcademicoConRelaciones['estudiante'];
    resumen: HistorialAcademicoResumen;
    alertas_repitencia: CursoRepitenciaAlerta[];
    historial: HistorialAcademicoConRelaciones[];
};
export declare class HistorialAcademicoService {
    private readonly repository;
    private readonly estudianteRepository;
    private readonly pensumRepository;
    constructor(repository: Repository<HistorialAcademico>, estudianteRepository: Repository<Estudiante>, pensumRepository: Repository<Pensum>);
    create(dto: CreateHistorialAcademicoDto): Promise<HistorialAcademico>;
    findAll(): Promise<HistorialAcademico[]>;
    findByCarnet(carnet: string): Promise<HistorialAcademicoPorCarnetResponse>;
    findResumenByCarnet(carnet: string): Promise<{
        carnet: string;
        estudiante: {
            id: number;
            carnet: string;
            nombre?: string | null;
            apellido?: string | null;
            correo?: string | null;
        } | null | undefined;
        promedio_general: number | null;
        creditos_aprobados: number;
        riesgo_repitencia_porcentaje: number;
        riesgo_repitencia: boolean;
    }>;
    findOne(id: number): Promise<HistorialAcademico | null>;
    update(id: number, dto: UpdateHistorialAcademicoDto): Promise<HistorialAcademico | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    private buildResumen;
    private buildAlertasRepitencia;
    private mapEstudiante;
    private round2;
}
export {};
