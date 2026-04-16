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
exports.HorarioGeneral = void 0;
const typeorm_1 = require("typeorm");
const seccion_entity_1 = require("../../seccion/entities/seccion.entity");
let HorarioGeneral = class HorarioGeneral {
    id;
    id_curso_horario;
    seccion;
    cupo_maximo;
    activo;
    fecha_sincronizacion;
};
exports.HorarioGeneral = HorarioGeneral;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HorarioGeneral.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], HorarioGeneral.prototype, "id_curso_horario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => seccion_entity_1.Seccion, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_seccion' }),
    __metadata("design:type", seccion_entity_1.Seccion)
], HorarioGeneral.prototype, "seccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], HorarioGeneral.prototype, "cupo_maximo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], HorarioGeneral.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_sincronizacion' }),
    __metadata("design:type", Date)
], HorarioGeneral.prototype, "fecha_sincronizacion", void 0);
exports.HorarioGeneral = HorarioGeneral = __decorate([
    (0, typeorm_1.Entity)('horario_general')
], HorarioGeneral);
//# sourceMappingURL=horario-general.entity.js.map