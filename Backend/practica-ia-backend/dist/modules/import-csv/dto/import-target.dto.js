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
exports.ImportTargetParamDto = exports.IMPORT_TARGET_ROUTE_VALUES = exports.ImportTarget = void 0;
exports.normalizeImportTarget = normalizeImportTarget;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ImportTarget;
(function (ImportTarget) {
    ImportTarget["CURSO"] = "curso";
    ImportTarget["CARRERA"] = "carrera";
    ImportTarget["PENSUM"] = "pensum";
    ImportTarget["CURSO_PRERREQUISITO"] = "curso_prerrequisito";
    ImportTarget["HISTORIAL_ACADEMICO"] = "historial_academico";
    ImportTarget["ESTUDIANTE"] = "estudiante";
})(ImportTarget || (exports.ImportTarget = ImportTarget = {}));
const IMPORT_TARGET_ALIASES = {
    curso: ImportTarget.CURSO,
    cursos: ImportTarget.CURSO,
    carrera: ImportTarget.CARRERA,
    carreras: ImportTarget.CARRERA,
    pensum: ImportTarget.PENSUM,
    pensums: ImportTarget.PENSUM,
    curso_prerrequisito: ImportTarget.CURSO_PRERREQUISITO,
    'curso-prerrequisito': ImportTarget.CURSO_PRERREQUISITO,
    curso_prerrequisitos: ImportTarget.CURSO_PRERREQUISITO,
    'curso-prerrequisitos': ImportTarget.CURSO_PRERREQUISITO,
    historial_academico: ImportTarget.HISTORIAL_ACADEMICO,
    'historial-academico': ImportTarget.HISTORIAL_ACADEMICO,
    historial: ImportTarget.HISTORIAL_ACADEMICO,
    estudiante: ImportTarget.ESTUDIANTE,
    estudiantes: ImportTarget.ESTUDIANTE,
};
exports.IMPORT_TARGET_ROUTE_VALUES = Object.keys(IMPORT_TARGET_ALIASES);
function normalizeImportTarget(value) {
    return IMPORT_TARGET_ALIASES[value.trim().toLowerCase()];
}
class ImportTargetParamDto {
    target;
}
exports.ImportTargetParamDto = ImportTargetParamDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: exports.IMPORT_TARGET_ROUTE_VALUES,
        description: 'Tabla de destino para la importacion',
        example: ImportTarget.CURSO,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImportTargetParamDto.prototype, "target", void 0);
//# sourceMappingURL=import-target.dto.js.map