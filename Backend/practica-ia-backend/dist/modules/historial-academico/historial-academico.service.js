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
exports.HistorialAcademicoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const historial_academico_entity_1 = require("./entities/historial-academico.entity");
const estudiante_entity_1 = require("../estudiante/entities/estudiante.entity");
const pensum_entity_1 = require("../pensum/entities/pensum.entity");
let HistorialAcademicoService = class HistorialAcademicoService {
    repository;
    estudianteRepository;
    pensumRepository;
    constructor(repository, estudianteRepository, pensumRepository) {
        this.repository = repository;
        this.estudianteRepository = estudianteRepository;
        this.pensumRepository = pensumRepository;
    }
    create(dto) {
        const entity = this.repository.create({
            nota: dto.nota,
            aprobado: dto.aprobado,
            anio: dto.anio,
            intentos: dto.intentos ?? 1,
            estudiante: dto.id_estudiante ? { id: dto.id_estudiante } : undefined,
            curso: dto.id_curso ? { id: dto.id_curso } : undefined,
            ciclo: dto.id_ciclo ? { id: dto.id_ciclo } : undefined,
        });
        return this.repository.save(entity);
    }
    findAll() {
        return this.repository.find({ relations: ['estudiante', 'curso', 'ciclo'] });
    }
    async findByCarnet(carnet) {
        const estudiante = await this.estudianteRepository.findOne({
            where: { carnet },
        });
        if (!estudiante) {
            throw new common_1.NotFoundException(`Estudiante no encontrado para carnet ${carnet}`);
        }
        const historial = (await this.repository.find({
            where: { estudiante: { carnet } },
            relations: ['estudiante', 'curso', 'ciclo'],
            order: { anio: 'DESC', id: 'DESC' },
        }));
        return {
            estudiante: this.mapEstudiante(estudiante),
            resumen: await this.buildResumen(historial),
            alertas_repitencia: this.buildAlertasRepitencia(historial),
            historial,
        };
    }
    async findResumenByCarnet(carnet) {
        const data = await this.findByCarnet(carnet);
        return {
            carnet: data.estudiante?.carnet ?? carnet,
            estudiante: data.estudiante,
            promedio_general: data.resumen.promedio_general,
            creditos_aprobados: data.resumen.creditos_acumulados,
            riesgo_repitencia_porcentaje: data.resumen.porcentaje_riesgo_repitencia,
            riesgo_repitencia: data.resumen.riesgo_repitencia,
        };
    }
    findOne(id) {
        return this.repository.findOne({ where: { id }, relations: ['estudiante', 'curso', 'ciclo'] });
    }
    async update(id, dto) {
        const entity = await this.repository.preload({
            id,
            nota: dto.nota,
            aprobado: dto.aprobado,
            anio: dto.anio,
            intentos: dto.intentos,
            estudiante: dto.id_estudiante !== undefined ? (dto.id_estudiante ? { id: dto.id_estudiante } : undefined) : undefined,
            curso: dto.id_curso !== undefined ? (dto.id_curso ? { id: dto.id_curso } : undefined) : undefined,
            ciclo: dto.id_ciclo !== undefined ? (dto.id_ciclo ? { id: dto.id_ciclo } : undefined) : undefined,
        });
        if (!entity)
            return null;
        return this.repository.save(entity);
    }
    remove(id) {
        return this.repository.delete(id);
    }
    async buildResumen(historial) {
        const total = historial.length;
        const aprobados = historial.filter((row) => row.aprobado === true);
        const reprobados = historial.filter((row) => row.aprobado === false);
        const notasValidas = historial
            .map((row) => (typeof row.nota === 'number' ? Number(row.nota) : null))
            .filter((nota) => nota !== null);
        const sumaNotas = notasValidas.reduce((acc, value) => acc + value, 0);
        const cantidadCursosConNota = notasValidas.length;
        const notasAprobadas = aprobados
            .map((row) => (typeof row.nota === 'number' ? Number(row.nota) : null))
            .filter((nota) => nota !== null);
        const aprobadosIds = new Set(aprobados.map((row) => row.curso?.id).filter((id) => typeof id === 'number'));
        const pensum = aprobadosIds.size
            ? await this.pensumRepository.find({
                where: { curso: { id: (0, typeorm_2.In)([...aprobadosIds]) } },
                relations: ['curso'],
            })
            : [];
        const creditosAcumulados = new Map();
        for (const row of pensum) {
            const cursoId = row.curso?.id;
            if (!cursoId) {
                continue;
            }
            if (!creditosAcumulados.has(cursoId)) {
                creditosAcumulados.set(cursoId, row.creditos ?? 0);
            }
        }
        const totalCreditosAprobados = [...creditosAcumulados.values()].reduce((acc, value) => acc + value, 0);
        const porcentajeAprobacion = total > 0 ? this.round2((aprobados.length / total) * 100) : 0;
        const promedioGeneral = cantidadCursosConNota > 0 ? this.round2(sumaNotas / cantidadCursosConNota) : null;
        const promedioLimpio = notasAprobadas.length > 0 ? this.round2(notasAprobadas.reduce((acc, value) => acc + value, 0) / notasAprobadas.length) : null;
        const alertas = this.buildAlertasRepitencia(historial);
        const porcentajeRiesgo = total > 0 ? this.round2((reprobados.length / total) * 100) : 0;
        return {
            cursos_aprobados: aprobados.length,
            cursos_reprobados: reprobados.length,
            porcentaje_aprobacion: porcentajeAprobacion,
            creditos_acumulados: totalCreditosAprobados,
            promedio_general: promedioGeneral,
            promedio_limpio: promedioLimpio,
            riesgo_repitencia: alertas.length > 0,
            nivel_riesgo_repitencia: alertas.length > 0 || porcentajeRiesgo >= 50 ? 'alto' : porcentajeRiesgo > 0 ? 'medio' : 'bajo',
            porcentaje_riesgo_repitencia: porcentajeRiesgo,
        };
    }
    buildAlertasRepitencia(historial) {
        const reprobadosPorCurso = new Map();
        for (const row of historial) {
            if (row.aprobado !== false || !row.curso?.id) {
                continue;
            }
            const current = reprobadosPorCurso.get(row.curso.id) ?? {
                codigo: row.curso.codigo,
                nombre: row.curso.nombre,
                reprobados: 0,
            };
            current.reprobados += 1;
            reprobadosPorCurso.set(row.curso.id, current);
        }
        return [...reprobadosPorCurso.entries()]
            .filter(([, value]) => value.reprobados >= 2)
            .map(([id_curso, value]) => ({
            id_curso,
            codigo: value.codigo,
            nombre: value.nombre,
            reprobados: value.reprobados,
            alerta: true,
        }));
    }
    mapEstudiante(estudiante) {
        return {
            id: estudiante.id,
            carnet: estudiante.carnet,
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            correo: estudiante.correo,
        };
    }
    round2(value) {
        return Math.round(value * 100) / 100;
    }
};
exports.HistorialAcademicoService = HistorialAcademicoService;
exports.HistorialAcademicoService = HistorialAcademicoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(historial_academico_entity_1.HistorialAcademico)),
    __param(1, (0, typeorm_1.InjectRepository)(estudiante_entity_1.Estudiante)),
    __param(2, (0, typeorm_1.InjectRepository)(pensum_entity_1.Pensum)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], HistorialAcademicoService);
//# sourceMappingURL=historial-academico.service.js.map