"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_1 = require("./database");
const carrera_module_1 = require("./modules/carrera/carrera.module");
const semestre_module_1 = require("./modules/semestre/semestre.module");
const ciclo_module_1 = require("./modules/ciclo/ciclo.module");
const seccion_module_1 = require("./modules/seccion/seccion.module");
const estudiante_module_1 = require("./modules/estudiante/estudiante.module");
const curso_module_1 = require("./modules/curso/curso.module");
const pensum_module_1 = require("./modules/pensum/pensum.module");
const curso_prerrequisito_module_1 = require("./modules/curso-prerrequisito/curso-prerrequisito.module");
const horario_general_module_1 = require("./modules/horario-general/horario-general.module");
const historial_academico_module_1 = require("./modules/historial-academico/historial-academico.module");
const seleccion_cursos_module_1 = require("./modules/seleccion-cursos/seleccion-cursos.module");
const horario_estudiante_module_1 = require("./modules/horario-estudiante/horario-estudiante.module");
const detalle_horario_module_1 = require("./modules/detalle-horario/detalle-horario.module");
const notificacion_module_1 = require("./modules/notificacion/notificacion.module");
const control_repitencias_module_1 = require("./modules/control-repitencias/control-repitencias.module");
const resumen_estudiante_module_1 = require("./modules/resumen-estudiante/resumen-estudiante.module");
const import_csv_module_1 = require("./modules/import-csv/import-csv.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            database_1.DatabaseModule,
            carrera_module_1.CarreraModule,
            semestre_module_1.SemestreModule,
            ciclo_module_1.CicloModule,
            seccion_module_1.SeccionModule,
            estudiante_module_1.EstudianteModule,
            curso_module_1.CursoModule,
            pensum_module_1.PensumModule,
            curso_prerrequisito_module_1.CursoPrerrequisitoModule,
            horario_general_module_1.HorarioGeneralModule,
            historial_academico_module_1.HistorialAcademicoModule,
            seleccion_cursos_module_1.SeleccionCursosModule,
            horario_estudiante_module_1.HorarioEstudianteModule,
            detalle_horario_module_1.DetalleHorarioModule,
            notificacion_module_1.NotificacionModule,
            control_repitencias_module_1.ControlRepitenciasModule,
            resumen_estudiante_module_1.ResumenEstudianteModule,
            import_csv_module_1.ImportCsvModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map