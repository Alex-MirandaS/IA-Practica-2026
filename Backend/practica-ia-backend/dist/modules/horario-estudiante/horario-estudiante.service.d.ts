import { Repository } from 'typeorm';
import { HorarioEstudiante } from './entities/horario-estudiante.entity';
import { CreateHorarioEstudianteDto } from './dto/create-horario-estudiante.dto';
import { UpdateHorarioEstudianteDto } from './dto/update-horario-estudiante.dto';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Pensum } from '../pensum/entities/pensum.entity';
import { SeleccionCursos } from '../seleccion-cursos/entities/seleccion-cursos.entity';
import { HistorialAcademico } from '../historial-academico/entities/historial-academico.entity';
import { CursoPrerrequisito } from '../curso-prerrequisito/entities/curso-prerrequisito.entity';
import { HorarioGeneral } from '../horario-general/entities/horario-general.entity';
import { Curso } from '../curso/entities/curso.entity';
import { DetalleHorario } from '../detalle-horario/entities/detalle-horario.entity';
import { GenerateHorarioPersonalizadoDto } from './dto/generate-horario-personalizado.dto';
type TimeBlock = {
    day: string;
    start: number;
    end: number;
};
type HorarioVariant = {
    horarioGeneralId: number;
    idCursoHorario: number;
    seccion: string;
    blocks: TimeBlock[];
    minCreditosRequeridos: number;
};
export declare class HorarioEstudianteService {
    private readonly repository;
    private readonly estudianteRepository;
    private readonly pensumRepository;
    private readonly seleccionRepository;
    private readonly historialRepository;
    private readonly prerrequisitoRepository;
    private readonly horarioGeneralRepository;
    private readonly cursoRepository;
    private readonly detalleHorarioRepository;
    constructor(repository: Repository<HorarioEstudiante>, estudianteRepository: Repository<Estudiante>, pensumRepository: Repository<Pensum>, seleccionRepository: Repository<SeleccionCursos>, historialRepository: Repository<HistorialAcademico>, prerrequisitoRepository: Repository<CursoPrerrequisito>, horarioGeneralRepository: Repository<HorarioGeneral>, cursoRepository: Repository<Curso>, detalleHorarioRepository: Repository<DetalleHorario>);
    create(dto: CreateHorarioEstudianteDto): Promise<HorarioEstudiante>;
    findAll(): Promise<HorarioEstudiante[]>;
    findOne(id: number): Promise<HorarioEstudiante | null>;
    update(id: number, dto: UpdateHorarioEstudianteDto): Promise<HorarioEstudiante | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    previewCursosParaSeleccion(idEstudiante: number): Promise<{
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
                seccion: string;
                bloques: TimeBlock[];
                min_creditos_requeridos: number;
            }[];
        }[];
    }>;
    generarHorarioPersonalizado(dto: GenerateHorarioPersonalizadoDto): Promise<{
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
            bloque_a: TimeBlock;
            bloque_b: TimeBlock;
        }[];
        alternativas: {
            id_curso: number;
            codigo: string;
            nombre: string;
            variantes_sin_traslape: HorarioVariant[];
        }[];
        sugerencia?: undefined;
        id_horario_estudiante?: undefined;
        cursos?: undefined;
    } | {
        status: string;
        id_estudiante: number;
        creditos_seleccionados: number;
        max_creditos: number;
        sugerencia: string;
        conflictos?: undefined;
        alternativas?: undefined;
        id_horario_estudiante?: undefined;
        cursos?: undefined;
    } | {
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
            seccion: string;
            bloques: TimeBlock[];
        }[];
        conflictos?: undefined;
        alternativas?: undefined;
        sugerencia?: undefined;
    }>;
    private runGeneticSelection;
    private mutateGene;
    private crossoverGene;
    private fitness;
    private decodeGene;
    private detectConflicts;
    private buildAlternatives;
    private consecutiveBonus;
    private blocksOverlap;
    private buildPlanningContext;
    private extractBlocksFromExternalRow;
    private normalizeDay;
    private parseTimeToMinutes;
    private fetchCollectionWithFallback;
    private normalizeCollection;
    private readArray;
    private readString;
    private readNumber;
}
export {};
