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
exports.ResumenEstudianteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const resumen_estudiante_entity_1 = require("./entities/resumen-estudiante.entity");
let ResumenEstudianteService = class ResumenEstudianteService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    create(dto) {
        const entity = this.repository.create({
            cursos_aprobados: dto.cursos_aprobados,
            cursos_reprobados: dto.cursos_reprobados,
            porcentaje_aprobacion: dto.porcentaje_aprobacion,
            creditos_acumulados: dto.creditos_acumulados,
            promedio_general: dto.promedio_general,
            promedio_limpio: dto.promedio_limpio,
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
            cursos_aprobados: dto.cursos_aprobados,
            cursos_reprobados: dto.cursos_reprobados,
            porcentaje_aprobacion: dto.porcentaje_aprobacion,
            creditos_acumulados: dto.creditos_acumulados,
            promedio_general: dto.promedio_general,
            promedio_limpio: dto.promedio_limpio,
            estudiante: dto.id_estudiante !== undefined ? (dto.id_estudiante ? { id: dto.id_estudiante } : undefined) : undefined,
        });
        if (!entity)
            return null;
        return this.repository.save(entity);
    }
    remove(id) {
        return this.repository.delete(id);
    }
};
exports.ResumenEstudianteService = ResumenEstudianteService;
exports.ResumenEstudianteService = ResumenEstudianteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(resumen_estudiante_entity_1.ResumenEstudiante)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ResumenEstudianteService);
//# sourceMappingURL=resumen-estudiante.service.js.map