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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorarioGeneralService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const horario_general_entity_1 = require("./entities/horario-general.entity");
const seccion_entity_1 = require("../seccion/entities/seccion.entity");
let HorarioGeneralService = class HorarioGeneralService {
    dataSource;
    repository;
    constructor(dataSource, repository) {
        this.dataSource = dataSource;
        this.repository = repository;
    }
    create(dto) {
        const entity = this.repository.create({
            id_curso_horario: dto.id_curso_horario,
            cupo_maximo: dto.cupo_maximo,
            activo: dto.activo ?? true,
            seccion: dto.id_seccion ? { id: dto.id_seccion } : undefined,
        });
        return this.repository.save(entity);
    }
    findAll() {
        return this.repository.find({ relations: ['seccion'] });
    }
    findOne(id) {
        return this.repository.findOne({ where: { id }, relations: ['seccion'] });
    }
    async update(id, dto) {
        const entity = await this.repository.preload({
            id,
            id_curso_horario: dto.id_curso_horario,
            cupo_maximo: dto.cupo_maximo,
            activo: dto.activo,
            seccion: dto.id_seccion !== undefined ? (dto.id_seccion ? { id: dto.id_seccion } : undefined) : undefined,
        });
        if (!entity)
            return null;
        return this.repository.save(entity);
    }
    remove(id) {
        return this.repository.delete(id);
    }
    async syncLatestFromScheduler() {
        const baseUrl = process.env.SCHEDULER_API_BASE_URL ?? 'http://localhost:3000';
        const horarios = await this.fetchCollectionWithFallback(baseUrl, ['horario', 'horarios']);
        if (horarios.length === 0) {
            throw new common_1.BadRequestException('No se encontraron horarios en el servidor externo');
        }
        const latestHorario = [...horarios].sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))[0];
        const latestHorarioId = Number(latestHorario.id);
        if (!latestHorarioId) {
            throw new common_1.BadRequestException('No se pudo resolver el ultimo id_horario del servidor externo');
        }
        return this.syncFromSchedulerByHorarioId(baseUrl, latestHorarioId, latestHorario.nombre);
    }
    async syncByHorarioId(horarioId) {
        if (!Number.isInteger(horarioId) || horarioId <= 0) {
            throw new common_1.BadRequestException('horarioId debe ser un entero positivo');
        }
        const baseUrl = process.env.SCHEDULER_API_BASE_URL ?? 'http://localhost:3000';
        const horarios = await this.fetchCollectionWithFallback(baseUrl, ['horario', 'horarios']);
        const targetHorario = horarios.find((horario) => Number(horario.id) === horarioId);
        if (!targetHorario) {
            throw new common_1.BadRequestException(`No existe el horario ${horarioId} en el servidor externo`);
        }
        return this.syncFromSchedulerByHorarioId(baseUrl, horarioId, targetHorario.nombre);
    }
    async syncFromSchedulerByHorarioId(baseUrl, horarioId, horarioNombre) {
        const cursoHorarioRows = await this.fetchCollectionWithFallback(baseUrl, [
            'curso-horario',
            'curso_horario',
            'cursohorario',
        ]);
        const rowsForLatest = cursoHorarioRows.filter((row) => this.readNumber(row, ['id_horario', 'idHorario', 'horario_id']) === horarioId ||
            this.readNumber(this.readObject(row, ['horario']), ['id']) === horarioId);
        const warnings = [];
        const created = await this.dataSource.transaction(async (manager) => {
            const horarioGeneralRepository = manager.getRepository(horario_general_entity_1.HorarioGeneral);
            const deactivateResult = await horarioGeneralRepository
                .createQueryBuilder()
                .update(horario_general_entity_1.HorarioGeneral)
                .set({ activo: false })
                .execute();
            let inserted = 0;
            let updated = 0;
            for (let i = 0; i < rowsForLatest.length; i++) {
                const row = rowsForLatest[i];
                const idCursoHorario = this.readNumber(row, ['id']);
                if (!idCursoHorario) {
                    warnings.push(`Fila ${i + 1}: id de curso_horario invalido`);
                    continue;
                }
                const idSeccion = this.readNumber(row, ['id_seccion', 'idSeccion', 'seccion_id']) ||
                    this.readNumber(this.readObject(row, ['seccion']), ['id']);
                const seccionValue = this.readString(this.readObject(row, ['seccion']), ['seccion', 'nombre', 'codigo']);
                const seccion = await this.resolveSeccionForSync(idSeccion, seccionValue, warnings, i, manager.getRepository(seccion_entity_1.Seccion));
                const existing = await horarioGeneralRepository.findOne({ where: { id_curso_horario: idCursoHorario } });
                if (existing) {
                    existing.activo = true;
                    existing.seccion = seccion;
                    await horarioGeneralRepository.save(existing);
                    updated += 1;
                    continue;
                }
                const entity = horarioGeneralRepository.create({
                    id_curso_horario: idCursoHorario,
                    seccion,
                    activo: true,
                });
                await horarioGeneralRepository.save(entity);
                inserted += 1;
            }
            return {
                inserted,
                updated,
                deactivated: deactivateResult.affected ?? 0,
            };
        });
        return {
            horarioId,
            horarioNombre,
            fetchedRows: rowsForLatest.length,
            inserted: created.inserted,
            updated: created.updated,
            deactivated: created.deactivated,
            warnings,
        };
    }
    async resolveSeccionForSync(idSeccion, seccionValue, warnings, index, repository) {
        if (idSeccion) {
            const byId = await repository.findOne({ where: { id: idSeccion } });
            if (byId) {
                return byId;
            }
            if (seccionValue) {
                const byValue = await repository.findOne({ where: { seccion: seccionValue } });
                if (byValue) {
                    return byValue;
                }
                return repository.save(repository.create({ seccion: seccionValue }));
            }
            warnings.push(`Fila ${index + 1}: id_seccion ${idSeccion} no existe y no se pudo inferir valor de seccion`);
            return undefined;
        }
        if (!seccionValue) {
            return undefined;
        }
        const existing = await repository.findOne({ where: { seccion: seccionValue } });
        if (existing) {
            return existing;
        }
        return repository.save(repository.create({ seccion: seccionValue }));
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
        const candidates = [obj.data, obj.horarios, obj.curso_horario, obj.items];
        for (const candidate of candidates) {
            if (Array.isArray(candidate)) {
                return candidate;
            }
        }
        return [];
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
    readObject(source, keys) {
        if (!source || typeof source !== 'object') {
            return {};
        }
        const obj = source;
        for (const key of keys) {
            const value = obj[key];
            if (value && typeof value === 'object') {
                return value;
            }
        }
        return {};
    }
};
exports.HorarioGeneralService = HorarioGeneralService;
exports.HorarioGeneralService = HorarioGeneralService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(horario_general_entity_1.HorarioGeneral)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository])
], HorarioGeneralService);
//# sourceMappingURL=horario-general.service.js.map