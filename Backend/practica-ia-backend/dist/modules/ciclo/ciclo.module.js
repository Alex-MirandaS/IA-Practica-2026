"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CicloModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ciclo_entity_1 = require("./entities/ciclo.entity");
const ciclo_service_1 = require("./ciclo.service");
const ciclo_controller_1 = require("./ciclo.controller");
let CicloModule = class CicloModule {
};
exports.CicloModule = CicloModule;
exports.CicloModule = CicloModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ciclo_entity_1.Ciclo])],
        controllers: [ciclo_controller_1.CicloController],
        providers: [ciclo_service_1.CicloService],
        exports: [ciclo_service_1.CicloService],
    })
], CicloModule);
//# sourceMappingURL=ciclo.module.js.map