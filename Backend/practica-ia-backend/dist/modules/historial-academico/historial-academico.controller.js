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
exports.HistorialAcademicoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const historial_academico_service_1 = require("./historial-academico.service");
const create_historial_academico_dto_1 = require("./dto/create-historial-academico.dto");
const update_historial_academico_dto_1 = require("./dto/update-historial-academico.dto");
let HistorialAcademicoController = class HistorialAcademicoController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll() {
        return this.service.findAll();
    }
    findByCarnet(carnet) {
        return this.service.findByCarnet(carnet);
    }
    findResumenByCarnet(carnet) {
        return this.service.findResumenByCarnet(carnet);
    }
    findOne(id) {
        return this.service.findOne(+id);
    }
    update(id, dto) {
        return this.service.update(+id, dto);
    }
    remove(id) {
        return this.service.remove(+id);
    }
};
exports.HistorialAcademicoController = HistorialAcademicoController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear registro' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_historial_academico_dto_1.CreateHistorialAcademicoDto]),
    __metadata("design:returntype", void 0)
], HistorialAcademicoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar registros' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HistorialAcademicoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('estudiante/carnet/:carnet'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar historial academico por carnet de estudiante' }),
    (0, swagger_1.ApiParam)({ name: 'carnet', type: String }),
    __param(0, (0, common_1.Param)('carnet')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistorialAcademicoController.prototype, "findByCarnet", null);
__decorate([
    (0, common_1.Get)('resumen/carnet/:carnet'),
    (0, swagger_1.ApiOperation)({ summary: 'Calcular resumen academico por carnet' }),
    (0, swagger_1.ApiParam)({ name: 'carnet', type: String }),
    __param(0, (0, common_1.Param)('carnet')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistorialAcademicoController.prototype, "findResumenByCarnet", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistorialAcademicoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_historial_academico_dto_1.UpdateHistorialAcademicoDto]),
    __metadata("design:returntype", void 0)
], HistorialAcademicoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistorialAcademicoController.prototype, "remove", null);
exports.HistorialAcademicoController = HistorialAcademicoController = __decorate([
    (0, swagger_1.ApiTags)('historial-academico'),
    (0, common_1.Controller)('historial-academico'),
    __metadata("design:paramtypes", [historial_academico_service_1.HistorialAcademicoService])
], HistorialAcademicoController);
//# sourceMappingURL=historial-academico.controller.js.map