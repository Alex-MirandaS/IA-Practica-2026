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
exports.CicloController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ciclo_service_1 = require("./ciclo.service");
const create_ciclo_dto_1 = require("./dto/create-ciclo.dto");
const update_ciclo_dto_1 = require("./dto/update-ciclo.dto");
let CicloController = class CicloController {
    cicloService;
    constructor(cicloService) {
        this.cicloService = cicloService;
    }
    create(createCicloDto) {
        return this.cicloService.create(createCicloDto);
    }
    findAll() {
        return this.cicloService.findAll();
    }
    findOne(id) {
        return this.cicloService.findOne(+id);
    }
    update(id, updateCicloDto) {
        return this.cicloService.update(+id, updateCicloDto);
    }
    remove(id) {
        return this.cicloService.remove(+id);
    }
};
exports.CicloController = CicloController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear registro' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ciclo_dto_1.CreateCicloDto]),
    __metadata("design:returntype", void 0)
], CicloController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar registros' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CicloController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CicloController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ciclo_dto_1.UpdateCicloDto]),
    __metadata("design:returntype", void 0)
], CicloController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CicloController.prototype, "remove", null);
exports.CicloController = CicloController = __decorate([
    (0, swagger_1.ApiTags)('ciclo'),
    (0, common_1.Controller)('ciclo'),
    __metadata("design:paramtypes", [ciclo_service_1.CicloService])
], CicloController);
//# sourceMappingURL=ciclo.controller.js.map