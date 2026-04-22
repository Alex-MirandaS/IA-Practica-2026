import { HorarioEstudianteService } from './horario-estudiante.service';
import { CreateHorarioEstudianteDto } from './dto/create-horario-estudiante.dto';
import { UpdateHorarioEstudianteDto } from './dto/update-horario-estudiante.dto';
import { GenerateHorarioPersonalizadoDto } from './dto/generate-horario-personalizado.dto';
export declare class HorarioEstudianteController {
    private readonly service;
    constructor(service: HorarioEstudianteService);
    create(dto: CreateHorarioEstudianteDto): Promise<import("./entities/horario-estudiante.entity").HorarioEstudiante>;
    previewCursos(carnet: string): Promise<{
        id_estudiante: number;
        creditos_aprobados_acumulados: number;
        cursos: {
            id_curso: number;
            codigo: string;
            nombre: string;
            creditos: number;
            obligatorio: boolean;
            prioridad_bottleneck: number;
            elegible: boolean;
            motivo_no_elegible: string | undefined;
            abierto_en_horario_general: boolean;
            seleccionado_por_defecto: boolean;
            variantes: {
                id_horario_general: number;
                id_curso_horario: number;
                seccion: string;
                semestre: string | undefined;
                docente: string | undefined;
                salon: string | undefined;
                bloques: {
                    day: string;
                    start: number;
                    end: number;
                }[];
                min_creditos_requeridos: number;
            }[];
        }[];
    }>;
    generarHorario(dto: GenerateHorarioPersonalizadoDto): Promise<{
        cursos_omitidos?: {
            id_curso: number;
            codigo: string;
            nombre: string;
            razon: string;
        }[] | undefined;
        status: string;
        id_estudiante: number;
        creditos_seleccionados: number;
        max_creditos: number;
        conflictos: {
            curso_a: {
                id_curso: number;
                codigo: string;
                nombre: string;
                seccion: string;
            };
            curso_b: {
                id_curso: number;
                codigo: string;
                nombre: string;
                seccion: string;
            };
            bloque_a: {
                day: string;
                start: number;
                end: number;
            };
            bloque_b: {
                day: string;
                start: number;
                end: number;
            };
        }[];
        alternativas: {
            id_curso: number;
            codigo: string;
            nombre: string;
            variantes_sin_traslape: {
                horarioGeneralId: number;
                idCursoHorario: number;
                seccion: string;
                blocks: {
                    day: string;
                    start: number;
                    end: number;
                }[];
                detailedBlocks: {
                    day: string;
                    start: number;
                    end: number;
                    periodo: {
                        id: number;
                        hora_inicio: string;
                        hora_fin: string;
                    };
                    salon: string;
                    tipo_jornada: string;
                }[];
                minCreditosRequeridos: number;
                docente?: string;
                semestre?: string;
                salon?: string;
            }[];
        }[];
    } | {
        cursos_omitidos?: {
            id_curso: number;
            codigo: string;
            nombre: string;
            razon: string;
        }[] | undefined;
        status: string;
        id_estudiante: number;
        creditos_seleccionados: number;
        max_creditos: number;
        sugerencia: string;
    } | {
        cursos_omitidos?: {
            id_curso: number;
            codigo: string;
            nombre: string;
            razon: string;
        }[] | undefined;
        status: string;
        id_estudiante: number;
        id_horario_estudiante: number | undefined;
        creditos_seleccionados: number;
        max_creditos: number;
        cursos: {
            id_curso: number;
            codigo: string;
            nombre: string;
            obligatorio: boolean;
            prioridad_bottleneck: number;
            id_horario_general: number;
            id_curso_horario: number;
            seccion: string;
            semestre: string | undefined;
            docente: string | undefined;
            salon: string | undefined;
            bloques: {
                day: string;
                start: number;
                end: number;
            }[];
            bloques_detallados: {
                periodo: {
                    id: number;
                    hora_inicio: string;
                    hora_fin: string;
                };
                salon: string;
                tipo_jornada: string;
            }[];
        }[];
    }>;
    findAll(): Promise<import("./entities/horario-estudiante.entity").HorarioEstudiante[]>;
    findOne(id: string): Promise<import("./entities/horario-estudiante.entity").HorarioEstudiante | null>;
    update(id: string, dto: UpdateHorarioEstudianteDto): Promise<import("./entities/horario-estudiante.entity").HorarioEstudiante | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
