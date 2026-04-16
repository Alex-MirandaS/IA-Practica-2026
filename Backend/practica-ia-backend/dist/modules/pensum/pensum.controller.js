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
exports.PensumController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pensum_service_1 = require("./pensum.service");
const create_pensum_dto_1 = require("./dto/create-pensum.dto");
const update_pensum_dto_1 = require("./dto/update-pensum.dto");
let PensumController = class PensumController {
    pensumService;
    constructor(pensumService) {
        this.pensumService = pensumService;
    }
    create(createPensumDto) {
        return this.pensumService.create(createPensumDto);
    }
    findAll() {
        return this.pensumService.findAll();
    }
    findOne(id) {
        return this.pensumService.findOne(+id);
    }
    update(id, updatePensumDto) {
        return this.pensumService.update(+id, updatePensumDto);
    }
    remove(id) {
        return this.pensumService.remove(+id);
    }
};
exports.PensumController = PensumController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear registro' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pensum_dto_1.CreatePensumDto]),
    __metadata("design:returntype", void 0)
], PensumController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar registros' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PensumController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PensumController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pensum_dto_1.UpdatePensumDto]),
    __metadata("design:returntype", void 0)
], PensumController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PensumController.prototype, "remove", null);
exports.PensumController = PensumController = __decorate([
    (0, swagger_1.ApiTags)('pensum'),
    (0, common_1.Controller)('pensum'),
    __metadata("design:paramtypes", [pensum_service_1.PensumService])
], PensumController);
//# sourceMappingURL=pensum.controller.js.map