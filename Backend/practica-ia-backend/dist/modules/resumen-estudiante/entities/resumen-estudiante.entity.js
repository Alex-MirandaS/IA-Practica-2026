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
exports.ResumenEstudiante = void 0;
const typeorm_1 = require("typeorm");
const estudiante_entity_1 = require("../../estudiante/entities/estudiante.entity");
let ResumenEstudiante = class ResumenEstudiante {
    id;
    estudiante;
    cursos_aprobados;
    cursos_reprobados;
    porcentaje_aprobacion;
    creditos_acumulados;
    promedio_general;
    promedio_limpio;
};
exports.ResumenEstudiante = ResumenEstudiante;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ResumenEstudiante.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estudiante_entity_1.Estudiante, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_estudiante' }),
    __metadata("design:type", estudiante_entity_1.Estudiante)
], ResumenEstudiante.prototype, "estudiante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ResumenEstudiante.prototype, "cursos_aprobados", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ResumenEstudiante.prototype, "cursos_reprobados", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ResumenEstudiante.prototype, "porcentaje_aprobacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ResumenEstudiante.prototype, "creditos_acumulados", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ResumenEstudiante.prototype, "promedio_general", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ResumenEstudiante.prototype, "promedio_limpio", void 0);
exports.ResumenEstudiante = ResumenEstudiante = __decorate([
    (0, typeorm_1.Entity)('resumen_estudiante')
], ResumenEstudiante);
//# sourceMappingURL=resumen-estudiante.entity.js.map