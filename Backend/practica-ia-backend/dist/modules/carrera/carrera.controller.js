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
exports.CarreraController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const carrera_service_1 = require("./carrera.service");
const create_carrera_dto_1 = require("./dto/create-carrera.dto");
const update_carrera_dto_1 = require("./dto/update-carrera.dto");
let CarreraController = class CarreraController {
    carreraService;
    constructor(carreraService) {
        this.carreraService = carreraService;
    }
    create(createCarreraDto) {
        return this.carreraService.create(createCarreraDto);
    }
    findAll() {
        return this.carreraService.findAll();
    }
    findOne(id) {
        return this.carreraService.findOne(+id);
    }
    update(id, updateCarreraDto) {
        return this.carreraService.update(+id, updateCarreraDto);
    }
    remove(id) {
        return this.carreraService.remove(+id);
    }
};
exports.CarreraController = CarreraController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear registro' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_carrera_dto_1.CreateCarreraDto]),
    __metadata("design:returntype", void 0)
], CarreraController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar registros' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CarreraController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CarreraController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_carrera_dto_1.UpdateCarreraDto]),
    __metadata("design:returntype", void 0)
], CarreraController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CarreraController.prototype, "remove", null);
exports.CarreraController = CarreraController = __decorate([
    (0, swagger_1.ApiTags)('carrera'),
    (0, common_1.Controller)('carrera'),
    __metadata("design:paramtypes", [carrera_service_1.CarreraService])
], CarreraController);
//# sourceMappingURL=carrera.controller.js.map