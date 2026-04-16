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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetalleHorario = void 0;
const typeorm_1 = require("typeorm");
const horario_estudiante_entity_1 = require("../../horario-estudiante/entities/horario-estudiante.entity");
const horario_general_entity_1 = require("../../horario-general/entities/horario-general.entity");
let DetalleHorario = class DetalleHorario {
    id;
    horario;
    horarioGeneral;
};
exports.DetalleHorario = DetalleHorario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DetalleHorario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => horario_estudiante_entity_1.HorarioEstudiante, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_horario' }),
    __metadata("design:type", horario_estudiante_entity_1.HorarioEstudiante)
], DetalleHorario.prototype, "horario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => horario_general_entity_1.HorarioGeneral, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_horario_general' }),
    __metadata("design:type", horario_general_entity_1.HorarioGeneral)
], DetalleHorario.prototype, "horarioGeneral", void 0);
exports.DetalleHorario = DetalleHorario = __decorate([
    (0, typeorm_1.Entity)('detalle_horario')
], DetalleHorario);
//# sourceMappingURL=detalle-horario.entity.js.map