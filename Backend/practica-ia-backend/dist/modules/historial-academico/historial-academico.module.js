"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistorialAcademicoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const historial_academico_entity_1 = require("./entities/historial-academico.entity");
const historial_academico_service_1 = require("./historial-academico.service");
const historial_academico_controller_1 = require("./historial-academico.controller");
const estudiante_entity_1 = require("../estudiante/entities/estudiante.entity");
const pensum_entity_1 = require("../pensum/entities/pensum.entity");
let HistorialAcademicoModule = class HistorialAcademicoModule {
};
exports.HistorialAcademicoModule = HistorialAcademicoModule;
exports.HistorialAcademicoModule = HistorialAcademicoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([historial_academico_entity_1.HistorialAcademico, estudiante_entity_1.Estudiante, pensum_entity_1.Pensum])],
        controllers: [historial_academico_controller_1.HistorialAcademicoController],
        providers: [historial_academico_service_1.HistorialAcademicoService],
        exports: [historial_academico_service_1.HistorialAcademicoService],
    })
], HistorialAcademicoModule);
//# sourceMappingURL=historial-academico.module.js.map