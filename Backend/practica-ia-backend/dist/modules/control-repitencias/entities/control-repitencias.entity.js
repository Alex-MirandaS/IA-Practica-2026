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
exports.ControlRepitencias = void 0;
const typeorm_1 = require("typeorm");
const estudiante_entity_1 = require("../../estudiante/entities/estudiante.entity");
const curso_entity_1 = require("../../curso/entities/curso.entity");
let ControlRepitencias = class ControlRepitencias {
    id;
    estudiante;
    curso;
    total_intentos;
    alerta;
};
exports.ControlRepitencias = ControlRepitencias;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ControlRepitencias.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estudiante_entity_1.Estudiante, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_estudiante' }),
    __metadata("design:type", estudiante_entity_1.Estudiante)
], ControlRepitencias.prototype, "estudiante", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => curso_entity_1.Curso, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_curso' }),
    __metadata("design:type", curso_entity_1.Curso)
], ControlRepitencias.prototype, "curso", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ControlRepitencias.prototype, "total_intentos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ControlRepitencias.prototype, "alerta", void 0);
exports.ControlRepitencias = ControlRepitencias = __decorate([
    (0, typeorm_1.Entity)('control_repitencias')
], ControlRepitencias);
//# sourceMappingURL=control-repitencias.entity.js.map