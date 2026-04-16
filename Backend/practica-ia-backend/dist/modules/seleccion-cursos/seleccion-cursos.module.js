"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeleccionCursosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const seleccion_cursos_entity_1 = require("./entities/seleccion-cursos.entity");
const seleccion_cursos_service_1 = require("./seleccion-cursos.service");
const seleccion_cursos_controller_1 = require("./seleccion-cursos.controller");
let SeleccionCursosModule = class SeleccionCursosModule {
};
exports.SeleccionCursosModule = SeleccionCursosModule;
exports.SeleccionCursosModule = SeleccionCursosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([seleccion_cursos_entity_1.SeleccionCursos])],
        controllers: [seleccion_cursos_controller_1.SeleccionCursosController],
        providers: [seleccion_cursos_service_1.SeleccionCursosService],
        exports: [seleccion_cursos_service_1.SeleccionCursosService],
    })
], SeleccionCursosModule);
//# sourceMappingURL=seleccion-cursos.module.js.map