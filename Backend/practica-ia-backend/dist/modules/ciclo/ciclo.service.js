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
exports.CicloService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ciclo_entity_1 = require("./entities/ciclo.entity");
let CicloService = class CicloService {
    cicloRepository;
    constructor(cicloRepository) {
        this.cicloRepository = cicloRepository;
    }
    create(createCicloDto) {
        return this.cicloRepository.save(this.cicloRepository.create(createCicloDto));
    }
    findAll() {
        return this.cicloRepository.find();
    }
    findOne(id) {
        return this.cicloRepository.findOne({ where: { id } });
    }
    async update(id, updateCicloDto) {
        await this.cicloRepository.update(id, updateCicloDto);
        return this.findOne(id);
    }
    remove(id) {
        return this.cicloRepository.delete(id);
    }
};
exports.CicloService = CicloService;
exports.CicloService = CicloService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ciclo_entity_1.Ciclo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CicloService);
//# sourceMappingURL=ciclo.service.js.map