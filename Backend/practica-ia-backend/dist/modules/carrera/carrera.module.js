"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarreraModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const carrera_entity_1 = require("./entities/carrera.entity");
const carrera_service_1 = require("./carrera.service");
const carrera_controller_1 = require("./carrera.controller");
let CarreraModule = class CarreraModule {
};
exports.CarreraModule = CarreraModule;
exports.CarreraModule = CarreraModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([carrera_entity_1.Carrera])],
        controllers: [carrera_controller_1.CarreraController],
        providers: [carrera_service_1.CarreraService],
        exports: [carrera_service_1.CarreraService],
    })
], CarreraModule);
//# sourceMappingURL=carrera.module.js.map