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
exports.DetalleHorarioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const detalle_horario_entity_1 = require("./entities/detalle-horario.entity");
let DetalleHorarioService = class DetalleHorarioService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    create(dto) {
        const entity = this.repository.create({
            horario: dto.id_horario ? { id: dto.id_horario } : undefined,
            horarioGeneral: dto.id_horario_general ? { id: dto.id_horario_general } : undefined,
        });
        return this.repository.save(entity);
    }
    findAll() {
        return this.repository.find({ relations: ['horario', 'horarioGeneral'] });
    }
    findOne(id) {
        return this.repository.findOne({ where: { id }, relations: ['horario', 'horarioGeneral'] });
    }
    async update(id, dto) {
        const entity = await this.repository.preload({
            id,
            horario: dto.id_horario !== undefined ? (dto.id_horario ? { id: dto.id_horario } : undefined) : undefined,
            horarioGeneral: dto.id_horario_general !== undefined ? (dto.id_horario_general ? { id: dto.id_horario_general } : undefined) : undefined,
        });
        if (!entity)
            return null;
        return this.repository.save(entity);
    }
    remove(id) {
        return this.repository.delete(id);
    }
};
exports.DetalleHorarioService = DetalleHorarioService;
exports.DetalleHorarioService = DetalleHorarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(detalle_horario_entity_1.DetalleHorario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DetalleHorarioService);
//# sourceMappingURL=detalle-horario.service.js.map