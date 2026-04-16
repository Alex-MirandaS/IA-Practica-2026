"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorarioEstudianteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const geneticalgorithm_1 = __importDefault(require("geneticalgorithm"));
const typeorm_2 = require("typeorm");
const horario_estudiante_entity_1 = require("./entities/horario-estudiante.entity");
const estudiante_entity_1 = require("../estudiante/entities/estudiante.entity");
const pensum_entity_1 = require("../pensum/entities/pensum.entity");
const seleccion_cursos_entity_1 = require("../seleccion-cursos/entities/seleccion-cursos.entity");
const historial_academico_entity_1 = require("../historial-academico/entities/historial-academico.entity");
const curso_prerrequisito_entity_1 = require("../curso-prerrequisito/entities/curso-prerrequisito.entity");
const horario_general_entity_1 = require("../horario-general/entities/horario-general.entity");
const curso_entity_1 = require("../curso/entities/curso.entity");
const detalle_horario_entity_1 = require("../detalle-horario/entities/detalle-horario.entity");
let HorarioEstudianteService = class HorarioEstudianteService {
    repository;
    estudianteRepository;
    pensumRepository;
    seleccionRepository;
    historialRepository;
    prerrequisitoRepository;
    horarioGeneralRepository;
    cursoRepository;
    detalleHorarioRepository;
    constructor(repository, estudianteRepository, pensumRepository, seleccionRepository, historialRepository, prerrequisitoRepository, horarioGeneralRepository, cursoRepository, detalleHorarioRepository) {
        this.repository = repository;
        this.estudianteRepository = estudianteRepository;
        this.pensumRepository = pensumRepository;
        this.seleccionRepository = seleccionRepository;
        this.historialRepository = historialRepository;
        this.prerrequisitoRepository = prerrequisitoRepository;
        this.horarioGeneralRepository = horarioGeneralRepository;
        this.cursoRepository = cursoRepository;
        this.detalleHorarioRepository = detalleHorarioRepository;
    }
    create(dto) {
        const entity = this.repository.create({
            estudiante: dto.id_estudiante ? { id: dto.id_estudiante } : undefined,
        });
        return this.repository.save(entity);
    }
    findAll() {
        return this.repository.find({ relations: ['estudiante'] });
    }
    findOne(id) {
        return this.repository.findOne({ where: { id }, relations: ['estudiante'] });
    }
    async update(id, dto) {
        const entity = await this.repository.preload({
            id,
            estudiante: dto.id_estudiante !== undefined ? (dto.id_estudiante ? { id: dto.id_estudiante } : undefined) : undefined,
        });
        if (!entity)
            return null;
        return this.repository.save(entity);
    }
    remove(id) {
        return this.repository.delete(id);
    }
    async previewCursosParaSeleccion(idEstudiante) {
        const contexto = await this.buildPlanningContext(idEstudiante);
        const seleccionMap = new Map();
        contexto.selecciones.forEach((row) => {
            if (row.curso?.id) {
                seleccionMap.set(row.curso.id, row.seleccionado);
            }
        });
        return {
            id_estudiante: idEstudiante,
            creditos_aprobados_acumulados: contexto.creditosAprobados,
            cursos: contexto.cursos.map((curso) => {
                const existeSeleccion = seleccionMap.has(curso.idCurso);
                const seleccionadoPorDefecto = existeSeleccion
                    ? Boolean(seleccionMap.get(curso.idCurso))
                    : curso.obligatorio && curso.elegible && curso.variantes.length > 0;
                return {
                    id_curso: curso.idCurso,
                    codigo: curso.codigo,
                    nombre: curso.nombre,
                    creditos: curso.creditos,
                    obligatorio: curso.obligatorio,
                    prioridad_bottleneck: curso.prioridadBottleneck,
                    elegible: curso.elegible,
                    motivo_no_elegible: curso.motivoNoElegible,
                    abierto_en_horario_general: curso.variantes.length > 0,
                    seleccionado_por_defecto: seleccionadoPorDefecto,
                    variantes: curso.variantes.map((variant) => ({
                        id_horario_general: variant.horarioGeneralId,
                        seccion: variant.seccion,
                        bloques: variant.blocks,
                        min_creditos_requeridos: variant.minCreditosRequeridos,
                    })),
                };
            }),
        };
    }
    async generarHorarioPersonalizado(dto) {
        const contexto = await this.buildPlanningContext(dto.id_estudiante);
        const seleccionMap = new Map();
        contexto.selecciones.forEach((row) => {
            if (row.curso?.id) {
                seleccionMap.set(row.curso.id, row.seleccionado);
            }
        });
        const selectedFromInput = new Set(dto.selected_course_ids ?? []);
        const usePayloadSelection = selectedFromInput.size > 0;
        const cursosDeseados = contexto.cursos.filter((curso) => {
            if (usePayloadSelection) {
                return selectedFromInput.has(curso.idCurso);
            }
            if (seleccionMap.has(curso.idCurso)) {
                return Boolean(seleccionMap.get(curso.idCurso));
            }
            return curso.obligatorio;
        });
        if (cursosDeseados.length === 0) {
            throw new common_1.BadRequestException('No hay cursos seleccionados para generar horario');
        }
        const noElegibles = cursosDeseados.filter((curso) => !curso.elegible);
        if (noElegibles.length > 0) {
            throw new common_1.BadRequestException({
                message: 'Existen cursos seleccionados que no cumplen prerrequisitos o creditos acumulados',
                cursos: noElegibles.map((curso) => ({
                    id_curso: curso.idCurso,
                    codigo: curso.codigo,
                    nombre: curso.nombre,
                    motivo: curso.motivoNoElegible ?? 'No elegible',
                })),
            });
        }
        const cerrados = cursosDeseados.filter((curso) => curso.variantes.length === 0);
        if (cerrados.length > 0) {
            throw new common_1.BadRequestException({
                message: 'Existen cursos seleccionados que no estan abiertos en horario general',
                cursos: cerrados.map((curso) => ({
                    id_curso: curso.idCurso,
                    codigo: curso.codigo,
                    nombre: curso.nombre,
                })),
            });
        }
        const maxCreditos = dto.max_credits ?? 24;
        const populationSize = dto.population_size ?? 80;
        const generations = dto.generations ?? 120;
        const persist = dto.persist !== false;
        const bestGene = this.runGeneticSelection(cursosDeseados, populationSize, generations, maxCreditos);
        const seleccion = this.decodeGene(bestGene, cursosDeseados);
        const conflictos = this.detectConflicts(seleccion);
        const creditosSeleccionados = seleccion.reduce((acc, item) => acc + item.curso.creditos, 0);
        if (conflictos.length > 0) {
            return {
                status: 'requiere_seleccion_manual',
                id_estudiante: dto.id_estudiante,
                creditos_seleccionados: creditosSeleccionados,
                max_creditos: maxCreditos,
                conflictos,
                alternativas: this.buildAlternatives(conflictos, cursosDeseados, bestGene),
            };
        }
        if (creditosSeleccionados > maxCreditos) {
            return {
                status: 'requiere_ajuste_creditos',
                id_estudiante: dto.id_estudiante,
                creditos_seleccionados: creditosSeleccionados,
                max_creditos: maxCreditos,
                sugerencia: 'Reduce cursos optativos o aumenta max_credits para continuar',
            };
        }
        let horarioGeneradoId;
        if (persist) {
            const header = await this.repository.save(this.repository.create({ estudiante: { id: dto.id_estudiante } }));
            const detalles = seleccion.map((item) => this.detalleHorarioRepository.create({
                horario: { id: header.id },
                horarioGeneral: { id: item.variante.horarioGeneralId },
            }));
            await this.detalleHorarioRepository.save(detalles);
            horarioGeneradoId = header.id;
        }
        return {
            status: 'generado',
            id_estudiante: dto.id_estudiante,
            id_horario_estudiante: horarioGeneradoId,
            creditos_seleccionados: creditosSeleccionados,
            max_creditos: maxCreditos,
            cursos: seleccion.map((item) => ({
                id_curso: item.curso.idCurso,
                codigo: item.curso.codigo,
                nombre: item.curso.nombre,
                obligatorio: item.curso.obligatorio,
                prioridad_bottleneck: item.curso.prioridadBottleneck,
                id_horario_general: item.variante.horarioGeneralId,
                seccion: item.variante.seccion,
                bloques: item.variante.blocks,
            })),
        };
    }
    runGeneticSelection(cursos, populationSize, generations, maxCreditos) {
        const randomGene = () => cursos.map((curso) => {
            if (curso.variantes.length === 0)
                return -1;
            return Math.floor(Math.random() * curso.variantes.length);
        });
        const population = Array.from({ length: Math.max(populationSize, 20) }, randomGene);
        const ga = (0, geneticalgorithm_1.default)({
            population,
            populationSize: Math.max(populationSize, 20),
            mutationFunction: (gene) => this.mutateGene(gene, cursos),
            crossoverFunction: (a, b) => this.crossoverGene(a, b),
            fitnessFunction: (gene) => this.fitness(gene, cursos, maxCreditos),
        });
        for (let i = 0; i < Math.max(generations, 30); i++) {
            ga.evolve();
        }
        return ga.best();
    }
    mutateGene(gene, cursos) {
        const copy = [...gene];
        const idx = Math.floor(Math.random() * copy.length);
        if (cursos[idx].variantes.length === 0) {
            copy[idx] = -1;
            return copy;
        }
        copy[idx] = Math.floor(Math.random() * cursos[idx].variantes.length);
        return copy;
    }
    crossoverGene(a, b) {
        if (a.length !== b.length || a.length === 0) {
            return [a, b];
        }
        const point = Math.floor(Math.random() * a.length);
        const first = [...a.slice(0, point), ...b.slice(point)];
        const second = [...b.slice(0, point), ...a.slice(point)];
        return [first, second];
    }
    fitness(gene, cursos, maxCreditos) {
        let score = 0;
        const chosen = [];
        for (let i = 0; i < cursos.length; i++) {
            const curso = cursos[i];
            const variantIndex = gene[i] ?? -1;
            const variant = curso.variantes[variantIndex];
            if (!variant) {
                score -= curso.obligatorio ? 250 : 120;
                continue;
            }
            chosen.push({ curso, variante: variant });
            score += curso.prioridadBottleneck * 25;
            score += curso.obligatorio ? 20 : 8;
        }
        const totalCreditos = chosen.reduce((acc, row) => acc + row.curso.creditos, 0);
        if (totalCreditos > maxCreditos) {
            score -= (totalCreditos - maxCreditos) * 45;
        }
        const conflictos = this.detectConflicts(chosen);
        score -= conflictos.length * 400;
        score += this.consecutiveBonus(chosen);
        return score;
    }
    decodeGene(gene, cursos) {
        return cursos
            .map((curso, idx) => {
            const variante = curso.variantes[gene[idx] ?? -1];
            if (!variante) {
                return null;
            }
            return { curso, variante };
        })
            .filter((value) => Boolean(value));
    }
    detectConflicts(chosen) {
        const conflicts = [];
        for (let i = 0; i < chosen.length; i++) {
            for (let j = i + 1; j < chosen.length; j++) {
                const a = chosen[i];
                const b = chosen[j];
                for (const blockA of a.variante.blocks) {
                    for (const blockB of b.variante.blocks) {
                        if (this.blocksOverlap(blockA, blockB)) {
                            conflicts.push({
                                curso_a: {
                                    id_curso: a.curso.idCurso,
                                    codigo: a.curso.codigo,
                                    nombre: a.curso.nombre,
                                    seccion: a.variante.seccion,
                                },
                                curso_b: {
                                    id_curso: b.curso.idCurso,
                                    codigo: b.curso.codigo,
                                    nombre: b.curso.nombre,
                                    seccion: b.variante.seccion,
                                },
                                bloque_a: blockA,
                                bloque_b: blockB,
                            });
                            break;
                        }
                    }
                }
            }
        }
        return conflicts;
    }
    buildAlternatives(conflicts, cursos, gene) {
        const result = [];
        const seen = new Set();
        const byId = new Map(cursos.map((curso) => [curso.idCurso, curso]));
        for (const conflict of conflicts) {
            const pairs = [
                [conflict.curso_a.id_curso, conflict.curso_b.id_curso],
                [conflict.curso_b.id_curso, conflict.curso_a.id_curso],
            ];
            for (const [targetId, againstId] of pairs) {
                if (seen.has(targetId)) {
                    continue;
                }
                const target = byId.get(targetId);
                const against = byId.get(againstId);
                if (!target || !against) {
                    continue;
                }
                const againstIndex = cursos.findIndex((curso) => curso.idCurso === againstId);
                const currentAgainst = against.variantes[gene[againstIndex] ?? -1];
                if (!currentAgainst) {
                    continue;
                }
                const compatibles = target.variantes.filter((variant) => !variant.blocks.some((blockA) => currentAgainst.blocks.some((blockB) => this.blocksOverlap(blockA, blockB))));
                result.push({
                    id_curso: target.idCurso,
                    codigo: target.codigo,
                    nombre: target.nombre,
                    variantes_sin_traslape: compatibles,
                });
                seen.add(targetId);
            }
        }
        return result;
    }
    consecutiveBonus(chosen) {
        const byDay = new Map();
        for (const row of chosen) {
            for (const block of row.variante.blocks) {
                const list = byDay.get(block.day) ?? [];
                list.push({ start: block.start, end: block.end, obligatorio: row.curso.obligatorio });
                byDay.set(block.day, list);
            }
        }
        let score = 0;
        for (const blocks of byDay.values()) {
            blocks.sort((a, b) => a.start - b.start);
            for (let i = 0; i < blocks.length - 1; i++) {
                const gap = blocks[i + 1].start - blocks[i].end;
                if (gap >= 0 && gap <= 30) {
                    score += blocks[i].obligatorio || blocks[i + 1].obligatorio ? 12 : 6;
                }
            }
        }
        return score;
    }
    blocksOverlap(a, b) {
        return a.day === b.day && a.start < b.end && b.start < a.end;
    }
    async buildPlanningContext(idEstudiante) {
        const estudiante = await this.estudianteRepository.findOne({ where: { id: idEstudiante }, relations: ['carrera'] });
        if (!estudiante) {
            throw new common_1.BadRequestException(`No existe el estudiante ${idEstudiante}`);
        }
        if (!estudiante.carrera?.id) {
            throw new common_1.BadRequestException('El estudiante no tiene carrera asignada');
        }
        const pensumRows = await this.pensumRepository.find({
            where: { carrera: { id: estudiante.carrera.id } },
            relations: ['curso'],
        });
        const pensumValidos = pensumRows.filter((row) => row.curso?.id);
        if (pensumValidos.length === 0) {
            throw new common_1.BadRequestException('No hay pensum configurado para la carrera del estudiante');
        }
        const historial = await this.historialRepository.find({
            where: { estudiante: { id: idEstudiante } },
            relations: ['curso'],
        });
        const aprobados = new Set(historial.filter((row) => row.aprobado && row.curso?.id).map((row) => row.curso.id));
        const pensumByCurso = new Map();
        pensumValidos.forEach((row) => {
            if (row.curso?.id) {
                pensumByCurso.set(row.curso.id, row);
            }
        });
        const creditosAprobados = pensumValidos
            .filter((row) => row.curso?.id && aprobados.has(row.curso.id))
            .reduce((acc, row) => acc + row.creditos, 0);
        const prereqRows = await this.prerrequisitoRepository.find({
            where: { pensum: { id: (0, typeorm_2.In)(pensumValidos.map((row) => row.id)) } },
            relations: ['pensum', 'pensum.curso', 'prerrequisito'],
        });
        const prereqByCurso = new Map();
        for (const row of prereqRows) {
            const targetCourseId = row.pensum?.curso?.id;
            const prereqId = row.prerrequisito?.id;
            if (!targetCourseId || !prereqId) {
                continue;
            }
            const list = prereqByCurso.get(targetCourseId) ?? [];
            list.push(prereqId);
            prereqByCurso.set(targetCourseId, list);
        }
        const bottleneckByCurso = new Map();
        for (const [, prereqs] of prereqByCurso.entries()) {
            for (const prereqCourseId of prereqs) {
                bottleneckByCurso.set(prereqCourseId, (bottleneckByCurso.get(prereqCourseId) ?? 0) + 1);
            }
        }
        const horarioGeneralActivo = await this.horarioGeneralRepository.find({ where: { activo: true }, relations: ['seccion'] });
        const externalHorarioRows = await this.fetchCollectionWithFallback(process.env.SCHEDULER_API_BASE_URL ?? 'http://localhost:3000', ['curso-horario', 'curso_horario', 'cursohorario']);
        const externalByCursoHorario = new Map();
        externalHorarioRows.forEach((row) => {
            const id = this.readNumber(row, ['id']);
            if (id) {
                externalByCursoHorario.set(id, row);
            }
        });
        const idExternoSet = Array.from(new Set(horarioGeneralActivo.map((row) => row.id_curso_horario)));
        const cursosByExterno = await this.cursoRepository.find({ where: { id_externo: (0, typeorm_2.In)(idExternoSet) } });
        const cursoInternoByExterno = new Map(cursosByExterno.filter((row) => row.id_externo).map((row) => [row.id_externo, row]));
        const variantesByCurso = new Map();
        for (const row of horarioGeneralActivo) {
            const cursoInterno = cursoInternoByExterno.get(row.id_curso_horario);
            if (!cursoInterno?.id) {
                continue;
            }
            const extRow = externalByCursoHorario.get(row.id_curso_horario);
            const parsedBlocks = this.extractBlocksFromExternalRow(extRow);
            const minCreditos = this.readNumber(extRow, [
                'creditos_requeridos',
                'min_creditos',
                'creditos_minimos',
                'creditosRequeridos',
            ]);
            const variant = {
                horarioGeneralId: row.id,
                idCursoHorario: row.id_curso_horario,
                seccion: row.seccion?.seccion ?? (this.readString(extRow, ['seccion', 'nombre_seccion']) || 'N/A'),
                blocks: parsedBlocks,
                minCreditosRequeridos: minCreditos,
            };
            const bucket = variantesByCurso.get(cursoInterno.id) ?? [];
            bucket.push(variant);
            variantesByCurso.set(cursoInterno.id, bucket);
        }
        const cursos = pensumValidos
            .filter((row) => row.curso?.id && !aprobados.has(row.curso.id))
            .map((row) => {
            const idCurso = row.curso.id;
            const prereqs = prereqByCurso.get(idCurso) ?? [];
            const prereqsPendientes = prereqs.filter((courseId) => !aprobados.has(courseId));
            const variantes = variantesByCurso.get(idCurso) ?? [];
            let motivoNoElegible = '';
            if (prereqsPendientes.length > 0) {
                motivoNoElegible = 'No cumple prerrequisitos';
            }
            else {
                const creditRule = variantes.reduce((max, item) => Math.max(max, item.minCreditosRequeridos), 0);
                if (creditRule > 0 && creditosAprobados < creditRule) {
                    motivoNoElegible = `Requiere ${creditRule} creditos aprobados`;
                }
            }
            return {
                idCurso,
                codigo: row.curso.codigo,
                nombre: row.curso.nombre,
                creditos: row.creditos,
                obligatorio: row.obligatorio,
                prioridadBottleneck: bottleneckByCurso.get(idCurso) ?? 0,
                elegible: motivoNoElegible.length === 0,
                motivoNoElegible: motivoNoElegible || undefined,
                variantes,
            };
        });
        const selecciones = await this.seleccionRepository.find({
            where: { estudiante: { id: idEstudiante } },
            relations: ['curso'],
        });
        return {
            estudiante,
            cursos,
            selecciones,
            creditosAprobados,
        };
    }
    extractBlocksFromExternalRow(row) {
        if (!row) {
            return [];
        }
        const blocks = [];
        const pushBlock = (dayRaw, startRaw, endRaw) => {
            const day = this.normalizeDay(dayRaw);
            const start = this.parseTimeToMinutes(startRaw);
            const end = this.parseTimeToMinutes(endRaw);
            if (!day || start === null || end === null || start >= end) {
                return;
            }
            blocks.push({ day, start, end });
        };
        const nestedArrays = [
            this.readArray(row, ['detalles', 'detalle', 'horarios', 'bloques', 'time_blocks', 'timeBlocks']),
        ].filter((list) => list.length > 0);
        if (nestedArrays.length > 0) {
            for (const list of nestedArrays) {
                for (const item of list) {
                    const dayValue = this.readString(item, ['dia', 'day', 'dias', 'weekday']);
                    const startValue = this.readString(item, ['hora_inicio', 'inicio', 'start', 'start_time']);
                    const endValue = this.readString(item, ['hora_fin', 'fin', 'end', 'end_time']);
                    const days = dayValue.split(',').map((entry) => entry.trim()).filter(Boolean);
                    if (days.length === 0) {
                        pushBlock(dayValue, startValue, endValue);
                        continue;
                    }
                    days.forEach((day) => pushBlock(day, startValue, endValue));
                }
            }
        }
        else {
            const dayValue = this.readString(row, ['dia', 'day', 'dias', 'weekday']);
            const startValue = this.readString(row, ['hora_inicio', 'inicio', 'start', 'start_time']);
            const endValue = this.readString(row, ['hora_fin', 'fin', 'end', 'end_time']);
            const days = dayValue.split(',').map((entry) => entry.trim()).filter(Boolean);
            if (days.length > 0) {
                days.forEach((day) => pushBlock(day, startValue, endValue));
            }
            else {
                pushBlock(dayValue, startValue, endValue);
            }
        }
        return blocks;
    }
    normalizeDay(raw) {
        const value = raw
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        const map = {
            lunes: 'LU',
            lu: 'LU',
            monday: 'LU',
            martes: 'MA',
            ma: 'MA',
            tuesday: 'MA',
            miercoles: 'MI',
            mie: 'MI',
            mi: 'MI',
            wednesday: 'MI',
            jueves: 'JU',
            ju: 'JU',
            thursday: 'JU',
            viernes: 'VI',
            vi: 'VI',
            friday: 'VI',
            sabado: 'SA',
            sa: 'SA',
            saturday: 'SA',
            domingo: 'DO',
            do: 'DO',
            sunday: 'DO',
        };
        return map[value] ?? '';
    }
    parseTimeToMinutes(raw) {
        if (!raw || raw.trim().length === 0) {
            return null;
        }
        const match = raw.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
        if (!match) {
            return null;
        }
        const hours = Number(match[1]);
        const minutes = Number(match[2]);
        if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
            return null;
        }
        return hours * 60 + minutes;
    }
    async fetchCollectionWithFallback(baseUrl, endpoints) {
        for (const endpoint of endpoints) {
            const response = await fetch(`${baseUrl.replace(/\/$/, '')}/${endpoint}`);
            if (!response.ok) {
                continue;
            }
            const data = (await response.json());
            const list = this.normalizeCollection(data);
            if (list.length > 0) {
                return list;
            }
        }
        return [];
    }
    normalizeCollection(data) {
        if (Array.isArray(data)) {
            return data;
        }
        if (!data || typeof data !== 'object') {
            return [];
        }
        const obj = data;
        const candidates = [obj.data, obj.items, obj.curso_horario, obj.cursos_horario, obj.results];
        for (const candidate of candidates) {
            if (Array.isArray(candidate)) {
                return candidate;
            }
        }
        return [];
    }
    readArray(source, keys) {
        if (!source || typeof source !== 'object') {
            return [];
        }
        const obj = source;
        for (const key of keys) {
            const value = obj[key];
            if (Array.isArray(value)) {
                return value.filter((item) => item && typeof item === 'object');
            }
        }
        return [];
    }
    readString(source, keys) {
        if (!source || typeof source !== 'object') {
            return '';
        }
        const obj = source;
        for (const key of keys) {
            const value = obj[key];
            if (typeof value === 'string' && value.trim().length > 0) {
                return value.trim();
            }
        }
        return '';
    }
    readNumber(source, keys) {
        if (!source || typeof source !== 'object') {
            return 0;
        }
        const obj = source;
        for (const key of keys) {
            const value = Number(obj[key]);
            if (Number.isFinite(value) && value > 0) {
                return value;
            }
        }
        return 0;
    }
};
exports.HorarioEstudianteService = HorarioEstudianteService;
exports.HorarioEstudianteService = HorarioEstudianteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(horario_estudiante_entity_1.HorarioEstudiante)),
    __param(1, (0, typeorm_1.InjectRepository)(estudiante_entity_1.Estudiante)),
    __param(2, (0, typeorm_1.InjectRepository)(pensum_entity_1.Pensum)),
    __param(3, (0, typeorm_1.InjectRepository)(seleccion_cursos_entity_1.SeleccionCursos)),
    __param(4, (0, typeorm_1.InjectRepository)(historial_academico_entity_1.HistorialAcademico)),
    __param(5, (0, typeorm_1.InjectRepository)(curso_prerrequisito_entity_1.CursoPrerrequisito)),
    __param(6, (0, typeorm_1.InjectRepository)(horario_general_entity_1.HorarioGeneral)),
    __param(7, (0, typeorm_1.InjectRepository)(curso_entity_1.Curso)),
    __param(8, (0, typeorm_1.InjectRepository)(detalle_horario_entity_1.DetalleHorario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], HorarioEstudianteService);
//# sourceMappingURL=horario-estudiante.service.js.map