"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PensumModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pensum_entity_1 = require("./entities/pensum.entity");
const pensum_service_1 = require("./pensum.service");
const pensum_controller_1 = require("./pensum.controller");
let PensumModule = class PensumModule {
};
exports.PensumModule = PensumModule;
exports.PensumModule = PensumModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([pensum_entity_1.Pensum])],
        controllers: [pensum_controller_1.PensumController],
        providers: [pensum_service_1.PensumService],
        exports: [pensum_service_1.PensumService],
    })
], PensumModule);
//# sourceMappingURL=pensum.module.js.map