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
exports.Pensum = void 0;
const typeorm_1 = require("typeorm");
const semestre_entity_1 = require("../../semestre/entities/semestre.entity");
const carrera_entity_1 = require("../../carrera/entities/carrera.entity");
const curso_entity_1 = require("../../curso/entities/curso.entity");
let Pensum = class Pensum {
    id;
    obligatorio;
    creditos;
    semestre;
    carrera;
    curso;
};
exports.Pensum = Pensum;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pensum.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Pensum.prototype, "obligatorio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Pensum.prototype, "creditos", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => semestre_entity_1.Semestre, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_semestre' }),
    __metadata("design:type", semestre_entity_1.Semestre)
], Pensum.prototype, "semestre", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => carrera_entity_1.Carrera, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_carrera' }),
    __metadata("design:type", carrera_entity_1.Carrera)
], Pensum.prototype, "carrera", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => curso_entity_1.Curso, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_curso' }),
    __metadata("design:type", curso_entity_1.Curso)
], Pensum.prototype, "curso", void 0);
exports.Pensum = Pensum = __decorate([
    (0, typeorm_1.Entity)('pensum')
], Pensum);
//# sourceMappingURL=pensum.entity.js.map