"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursoPrerrequisitoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const curso_prerrequisito_entity_1 = require("./entities/curso-prerrequisito.entity");
const curso_prerrequisito_service_1 = require("./curso-prerrequisito.service");
const curso_prerrequisito_controller_1 = require("./curso-prerrequisito.controller");
let CursoPrerrequisitoModule = class CursoPrerrequisitoModule {
};
exports.CursoPrerrequisitoModule = CursoPrerrequisitoModule;
exports.CursoPrerrequisitoModule = CursoPrerrequisitoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([curso_prerrequisito_entity_1.CursoPrerrequisito])],
        controllers: [curso_prerrequisito_controller_1.CursoPrerrequisitoController],
        providers: [curso_prerrequisito_service_1.CursoPrerrequisitoService],
        exports: [curso_prerrequisito_service_1.CursoPrerrequisitoService],
    })
], CursoPrerrequisitoModule);
//# sourceMappingURL=curso-prerrequisito.module.js.map