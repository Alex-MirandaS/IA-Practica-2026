"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportCsvModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const import_csv_controller_1 = require("./import-csv.controller");
const import_csv_service_1 = require("./import-csv.service");
const curso_entity_1 = require("../curso/entities/curso.entity");
const carrera_entity_1 = require("../carrera/entities/carrera.entity");
const pensum_entity_1 = require("../pensum/entities/pensum.entity");
const curso_prerrequisito_entity_1 = require("../curso-prerrequisito/entities/curso-prerrequisito.entity");
const historial_academico_entity_1 = require("../historial-academico/entities/historial-academico.entity");
const estudiante_entity_1 = require("../estudiante/entities/estudiante.entity");
const semestre_entity_1 = require("../semestre/entities/semestre.entity");
const ciclo_entity_1 = require("../ciclo/entities/ciclo.entity");
let ImportCsvModule = class ImportCsvModule {
};
exports.ImportCsvModule = ImportCsvModule;
exports.ImportCsvModule = ImportCsvModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                curso_entity_1.Curso,
                carrera_entity_1.Carrera,
                pensum_entity_1.Pensum,
                curso_prerrequisito_entity_1.CursoPrerrequisito,
                historial_academico_entity_1.HistorialAcademico,
                estudiante_entity_1.Estudiante,
                semestre_entity_1.Semestre,
                ciclo_entity_1.Ciclo,
            ]),
        ],
        controllers: [import_csv_controller_1.ImportCsvController],
        providers: [import_csv_service_1.ImportCsvService],
    })
], ImportCsvModule);
//# sourceMappingURL=import-csv.module.js.map