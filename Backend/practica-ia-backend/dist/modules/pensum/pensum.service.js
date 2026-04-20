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
exports.PensumService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pensum_entity_1 = require("./entities/pensum.entity");
let PensumService = class PensumService {
    pensumRepository;
    constructor(pensumRepository) {
        this.pensumRepository = pensumRepository;
    }
    create(createPensumDto) {
        const pensum = this.pensumRepository.create({
            obligatorio: createPensumDto.obligatorio ?? true,
            creditos: createPensumDto.creditos,
            semestre: createPensumDto.id_semestre ? { id: createPensumDto.id_semestre } : undefined,
            carrera: createPensumDto.id_carrera ? { id: createPensumDto.id_carrera } : undefined,
            curso: createPensumDto.id_curso ? { id: createPensumDto.id_curso } : undefined,
        });
        return this.pensumRepository.save(pensum);
    }
    findAll() {
        return this.pensumRepository.find({ relations: ['semestre', 'carrera', 'curso'] });
    }
    findByCarrera(idCarrera) {
        return this.pensumRepository.find({
            where: { carrera: { id: idCarrera } },
            relations: ['semestre', 'carrera', 'curso'],
        });
    }
    findOne(id) {
        return this.pensumRepository.findOne({ where: { id }, relations: ['semestre', 'carrera', 'curso'] });
    }
    async update(id, updatePensumDto) {
        const entity = await this.pensumRepository.preload({
            id,
            obligatorio: updatePensumDto.obligatorio,
            creditos: updatePensumDto.creditos,
            semestre: updatePensumDto.id_semestre !== undefined ? (updatePensumDto.id_semestre ? { id: updatePensumDto.id_semestre } : undefined) : undefined,
            carrera: updatePensumDto.id_carrera !== undefined ? (updatePensumDto.id_carrera ? { id: updatePensumDto.id_carrera } : undefined) : undefined,
            curso: updatePensumDto.id_curso !== undefined ? (updatePensumDto.id_curso ? { id: updatePensumDto.id_curso } : undefined) : undefined,
        });
        if (!entity)
            return null;
        return this.pensumRepository.save(entity);
    }
    remove(id) {
        return this.pensumRepository.delete(id);
    }
};
exports.PensumService = PensumService;
exports.PensumService = PensumService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pensum_entity_1.Pensum)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PensumService);
//# sourceMappingURL=pensum.service.js.map