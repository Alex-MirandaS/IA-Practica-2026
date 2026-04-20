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
exports.CursoPrerrequisitoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const curso_prerrequisito_entity_1 = require("./entities/curso-prerrequisito.entity");
let CursoPrerrequisitoService = class CursoPrerrequisitoService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    create(dto) {
        const entity = this.repository.create({
            pensum: dto.id_pensum ? { id: dto.id_pensum } : undefined,
            prerrequisito: dto.id_prerrequisito ? { id: dto.id_prerrequisito } : undefined,
        });
        return this.repository.save(entity);
    }
    findAll() {
        return this.repository.find({ relations: ['pensum', 'prerrequisito'] });
    }
    findByPensum(idPensum) {
        return this.repository.find({
            where: { pensum: { id: idPensum } },
            relations: ['pensum', 'prerrequisito'],
        });
    }
    findOne(id) {
        return this.repository.findOne({ where: { id }, relations: ['pensum', 'prerrequisito'] });
    }
    async update(id, dto) {
        const entity = await this.repository.preload({
            id,
            pensum: dto.id_pensum !== undefined ? (dto.id_pensum ? { id: dto.id_pensum } : undefined) : undefined,
            prerrequisito: dto.id_prerrequisito !== undefined ? (dto.id_prerrequisito ? { id: dto.id_prerrequisito } : undefined) : undefined,
        });
        if (!entity)
            return null;
        return this.repository.save(entity);
    }
    remove(id) {
        return this.repository.delete(id);
    }
};
exports.CursoPrerrequisitoService = CursoPrerrequisitoService;
exports.CursoPrerrequisitoService = CursoPrerrequisitoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(curso_prerrequisito_entity_1.CursoPrerrequisito)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CursoPrerrequisitoService);
//# sourceMappingURL=curso-prerrequisito.service.js.map