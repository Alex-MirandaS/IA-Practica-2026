"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorarioEstudianteModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const horario_estudiante_entity_1 = require("./entities/horario-estudiante.entity");
const horario_estudiante_service_1 = require("./horario-estudiante.service");
const horario_estudiante_controller_1 = require("./horario-estudiante.controller");
const estudiante_entity_1 = require("../estudiante/entities/estudiante.entity");
const pensum_entity_1 = require("../pensum/entities/pensum.entity");
const seleccion_cursos_entity_1 = require("../seleccion-cursos/entities/seleccion-cursos.entity");
const historial_academico_entity_1 = require("../historial-academico/entities/historial-academico.entity");
const curso_prerrequisito_entity_1 = require("../curso-prerrequisito/entities/curso-prerrequisito.entity");
const horario_general_entity_1 = require("../horario-general/entities/horario-general.entity");
const curso_entity_1 = require("../curso/entities/curso.entity");
const detalle_horario_entity_1 = require("../detalle-horario/entities/detalle-horario.entity");
let HorarioEstudianteModule = class HorarioEstudianteModule {
};
exports.HorarioEstudianteModule = HorarioEstudianteModule;
exports.HorarioEstudianteModule = HorarioEstudianteModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                horario_estudiante_entity_1.HorarioEstudiante,
                estudiante_entity_1.Estudiante,
                pensum_entity_1.Pensum,
                seleccion_cursos_entity_1.SeleccionCursos,
                historial_academico_entity_1.HistorialAcademico,
                curso_prerrequisito_entity_1.CursoPrerrequisito,
                horario_general_entity_1.HorarioGeneral,
                curso_entity_1.Curso,
                detalle_horario_entity_1.DetalleHorario,
            ]),
        ],
        controllers: [horario_estudiante_controller_1.HorarioEstudianteController],
        providers: [horario_estudiante_service_1.HorarioEstudianteService],
        exports: [horario_estudiante_service_1.HorarioEstudianteService],
    })
], HorarioEstudianteModule);
//# sourceMappingURL=horario-estudiante.module.js.map