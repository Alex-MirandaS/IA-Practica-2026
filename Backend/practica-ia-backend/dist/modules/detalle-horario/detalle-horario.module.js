"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetalleHorarioModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const detalle_horario_entity_1 = require("./entities/detalle-horario.entity");
const detalle_horario_service_1 = require("./detalle-horario.service");
const detalle_horario_controller_1 = require("./detalle-horario.controller");
let DetalleHorarioModule = class DetalleHorarioModule {
};
exports.DetalleHorarioModule = DetalleHorarioModule;
exports.DetalleHorarioModule = DetalleHorarioModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([detalle_horario_entity_1.DetalleHorario])],
        controllers: [detalle_horario_controller_1.DetalleHorarioController],
        providers: [detalle_horario_service_1.DetalleHorarioService],
        exports: [detalle_horario_service_1.DetalleHorarioService],
    })
], DetalleHorarioModule);
//# sourceMappingURL=detalle-horario.module.js.map