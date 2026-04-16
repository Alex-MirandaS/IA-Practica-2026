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
exports.HorarioEstudianteController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const horario_estudiante_service_1 = require("./horario-estudiante.service");
const create_horario_estudiante_dto_1 = require("./dto/create-horario-estudiante.dto");
const update_horario_estudiante_dto_1 = require("./dto/update-horario-estudiante.dto");
const generate_horario_personalizado_dto_1 = require("./dto/generate-horario-personalizado.dto");
let HorarioEstudianteController = class HorarioEstudianteController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    previewCursos(idEstudiante) {
        return this.service.previewCursosParaSeleccion(idEstudiante);
    }
    generarHorario(dto) {
        return this.service.generarHorarioPersonalizado(dto);
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
exports.HorarioEstudianteController = HorarioEstudianteController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear registro' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_horario_estudiante_dto_1.CreateHorarioEstudianteDto]),
    __metadata("design:returntype", void 0)
], HorarioEstudianteController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('preview/:idEstudiante'),
    (0, swagger_1.ApiOperation)({
        summary: 'Previsualizar cursos para generar horario',
        description: 'Marca por defecto cursos obligatorios abiertos y muestra elegibilidad por prerrequisitos/creditos acumulados.',
    }),
    (0, swagger_1.ApiParam)({ name: 'idEstudiante', type: Number }),
    __param(0, (0, common_1.Param)('idEstudiante', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HorarioEstudianteController.prototype, "previewCursos", null);
__decorate([
    (0, common_1.Post)('generar'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generar horario personalizado con algoritmo genetico',
        description: 'Genera el mejor horario posible priorizando cursos cuello de botella y evitando traslapes. Si hay conflicto, retorna alternativas.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_horario_personalizado_dto_1.GenerateHorarioPersonalizadoDto]),
    __metadata("design:returntype", void 0)
], HorarioEstudianteController.prototype, "generarHorario", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar registros' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HorarioEstudianteController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HorarioEstudianteController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_horario_estudiante_dto_1.UpdateHorarioEstudianteDto]),
    __metadata("design:returntype", void 0)
], HorarioEstudianteController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar registro por id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HorarioEstudianteController.prototype, "remove", null);
exports.HorarioEstudianteController = HorarioEstudianteController = __decorate([
    (0, swagger_1.ApiTags)('horario-estudiante'),
    (0, common_1.Controller)('horario-estudiante'),
    __metadata("design:paramtypes", [horario_estudiante_service_1.HorarioEstudianteService])
], HorarioEstudianteController);
//# sourceMappingURL=horario-estudiante.controller.js.map