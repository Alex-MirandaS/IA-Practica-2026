import { HistorialAcademicoService } from './historial-academico.service';
import { CreateHistorialAcademicoDto } from './dto/create-historial-academico.dto';
import { UpdateHistorialAcademicoDto } from './dto/update-historial-academico.dto';
export declare class HistorialAcademicoController {
    private readonly service;
    constructor(service: HistorialAcademicoService);
    create(dto: CreateHistorialAcademicoDto): Promise<import("./entities/historial-academico.entity").HistorialAcademico>;
    findAll(): Promise<import("./entities/historial-academico.entity").HistorialAcademico[]>;
    findByCarnet(carnet: string): Promise<{
        estudiante: {
            id: number;
            carnet: string;
            nombre?: string | null;
            apellido?: string | null;
            correo?: string | null;
        } | null | undefined;
        resumen: {
            cursos_aprobados: number;
            cursos_reprobados: number;
            porcentaje_aprobacion: number;
            creditos_acumulados: number;
            promedio_general: number | null;
            promedio_limpio: number | null;
            riesgo_repitencia: boolean;
            nivel_riesgo_repitencia: "bajo" | "medio" | "alto";
            porcentaje_riesgo_repitencia: number;
        };
        alertas_repitencia: {
            id_curso: number;
            codigo: string;
            nombre: string;
            reprobados: number;
            alerta: boolean;
        }[];
        historial: {
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
        }[];
    }>;
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
    findOne(id: string): Promise<import("./entities/historial-academico.entity").HistorialAcademico | null>;
    update(id: string, dto: UpdateHistorialAcademicoDto): Promise<import("./entities/historial-academico.entity").HistorialAcademico | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
