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
exports.EstudianteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const estudiante_entity_1 = require("./entities/estudiante.entity");
let EstudianteService = class EstudianteService {
    estudianteRepository;
    constructor(estudianteRepository) {
        this.estudianteRepository = estudianteRepository;
    }
    create(createEstudianteDto) {
        const estudiante = this.estudianteRepository.create({
            carnet: createEstudianteDto.carnet,
            nombre: createEstudianteDto.nombre,
            apellido: createEstudianteDto.apellido,
            correo: createEstudianteDto.correo,
            carrera: createEstudianteDto.id_carrera
                ? { id: createEstudianteDto.id_carrera }
                : undefined,
        });
        return this.estudianteRepository.save(estudiante);
    }
    findAll() {
        return this.estudianteRepository.find({ relations: ['carrera'] });
    }
    findOne(id) {
        return this.estudianteRepository.findOne({ where: { id }, relations: ['carrera'] });
    }
    async update(id, updateEstudianteDto) {
        const partial = { ...updateEstudianteDto };
        if (updateEstudianteDto.id_carrera !== undefined) {
            partial.carrera = updateEstudianteDto.id_carrera
                ? { id: updateEstudianteDto.id_carrera }
                : null;
            delete partial.id_carrera;
        }
        await this.estudianteRepository.update(id, partial);
        return this.findOne(id);
    }
    remove(id) {
        return this.estudianteRepository.delete(id);
    }
};
exports.EstudianteService = EstudianteService;
exports.EstudianteService = EstudianteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(estudiante_entity_1.Estudiante)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EstudianteService);
//# sourceMappingURL=estudiante.service.js.map