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
exports.HistorialAcademico = void 0;
const typeorm_1 = require("typeorm");
const estudiante_entity_1 = require("../../estudiante/entities/estudiante.entity");
const curso_entity_1 = require("../../curso/entities/curso.entity");
const ciclo_entity_1 = require("../../ciclo/entities/ciclo.entity");
let HistorialAcademico = class HistorialAcademico {
    id;
    estudiante;
    curso;
    nota;
    aprobado;
    anio;
    ciclo;
    intentos;
};
exports.HistorialAcademico = HistorialAcademico;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HistorialAcademico.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estudiante_entity_1.Estudiante, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_estudiante' }),
    __metadata("design:type", estudiante_entity_1.Estudiante)
], HistorialAcademico.prototype, "estudiante", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => curso_entity_1.Curso, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_curso' }),
    __metadata("design:type", curso_entity_1.Curso)
], HistorialAcademico.prototype, "curso", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], HistorialAcademico.prototype, "nota", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], HistorialAcademico.prototype, "aprobado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], HistorialAcademico.prototype, "anio", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ciclo_entity_1.Ciclo, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_ciclo' }),
    __metadata("design:type", ciclo_entity_1.Ciclo)
], HistorialAcademico.prototype, "ciclo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], HistorialAcademico.prototype, "intentos", void 0);
exports.HistorialAcademico = HistorialAcademico = __decorate([
    (0, typeorm_1.Entity)('historial_academico')
], HistorialAcademico);
//# sourceMappingURL=historial-academico.entity.js.map