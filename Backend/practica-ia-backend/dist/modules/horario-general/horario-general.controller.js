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
exports.HorarioGeneralController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const horario_general_service_1 = require("./horario-general.service");
const create_horario_general_dto_1 = require("./dto/create-horario-general.dto");
const update_horario_general_dto_1 = require("./dto/update-horario-general.dto");
let HorarioGeneralController = class HorarioGeneralController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    syncLatest() {
        return this.service.syncLatestFromScheduler();
    }
    syncByHorarioId(horarioId) {
        return this.service.syncByHorarioId(horarioId);
    }
    findAll() {
        return this.service.findAll();
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
exports.HorarioGeneralController = HorarioGeneralController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear registro' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_horario_general_dto_1.CreateHorarioGeneralDto]),
    __metadata("design:returntype", void 0)
], HorarioGeneralController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('sync/latest'),
    (0, swagger_1.ApiOperation)({
        summary: 'Sincronizar desde servidor de horarios',
        description: 'Consulta el backend externo (localhost:3000 por defecto), toma el ultimo horario y reconstruye horario_general con sus curso_horario.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HorarioGeneralController.prototype, "syncLatest", null);
__decorate([
    (0, common_1.Post)('sync/:horarioId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Sincronizar horario especifico desde servidor de horarios',
        description: 'Consulta el backend externo y sincroniza horario_general usando un id_horario especifico.',
    }),
    (0, swagger_1.ApiParam)({ name: 'horarioId', type: Number, description: 'ID del horario a sincronizar desde el servidor externo' }),
    __param(0, (0, common_1.Param)('horarioId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HorarioGeneralController.prototype, "syncByHorarioId", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar registros' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HorarioGeneralController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HorarioGeneralController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_horario_general_dto_1.UpdateHorarioGeneralDto]),
    __metadata("design:returntype", void 0)
], HorarioGeneralController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HorarioGeneralController.prototype, "remove", null);
exports.HorarioGeneralController = HorarioGeneralController = __decorate([
    (0, swagger_1.ApiTags)('horario-general'),
    (0, common_1.Controller)('horario-general'),
    __metadata("design:paramtypes", [horario_general_service_1.HorarioGeneralService])
], HorarioGeneralController);
//# sourceMappingURL=horario-general.controller.js.map