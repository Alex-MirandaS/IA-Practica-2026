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
exports.CursoPrerrequisito = void 0;
const typeorm_1 = require("typeorm");
const pensum_entity_1 = require("../../pensum/entities/pensum.entity");
const curso_entity_1 = require("../../curso/entities/curso.entity");
let CursoPrerrequisito = class CursoPrerrequisito {
    id;
    pensum;
    prerrequisito;
};
exports.CursoPrerrequisito = CursoPrerrequisito;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CursoPrerrequisito.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pensum_entity_1.Pensum, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_pensum' }),
    __metadata("design:type", pensum_entity_1.Pensum)
], CursoPrerrequisito.prototype, "pensum", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => curso_entity_1.Curso, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_prerrequisito' }),
    __metadata("design:type", curso_entity_1.Curso)
], CursoPrerrequisito.prototype, "prerrequisito", void 0);
exports.CursoPrerrequisito = CursoPrerrequisito = __decorate([
    (0, typeorm_1.Entity)('curso_prerrequisito')
], CursoPrerrequisito);
//# sourceMappingURL=curso-prerrequisito.entity.js.map