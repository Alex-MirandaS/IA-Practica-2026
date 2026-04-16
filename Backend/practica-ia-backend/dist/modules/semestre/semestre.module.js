"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemestreModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const semestre_entity_1 = require("./entities/semestre.entity");
const semestre_service_1 = require("./semestre.service");
const semestre_controller_1 = require("./semestre.controller");
let SemestreModule = class SemestreModule {
};
exports.SemestreModule = SemestreModule;
exports.SemestreModule = SemestreModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([semestre_entity_1.Semestre])],
        controllers: [semestre_controller_1.SemestreController],
        providers: [semestre_service_1.SemestreService],
        exports: [semestre_service_1.SemestreService],
    })
], SemestreModule);
//# sourceMappingURL=semestre.module.js.map