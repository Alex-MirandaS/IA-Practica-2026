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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportCsvController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const import_csv_service_1 = require("./import-csv.service");
const import_result_dto_1 = require("./dto/import-result.dto");
const import_target_dto_1 = require("./dto/import-target.dto");
let ImportCsvController = class ImportCsvController {
    importCsvService;
    constructor(importCsvService) {
        this.importCsvService = importCsvService;
    }
    async import(params, file) {
        if (!file?.buffer) {
            throw new common_1.BadRequestException('No se recibio el archivo CSV');
        }
        return this.importCsvService.importByTarget(params.target, file.buffer);
    }
};
exports.ImportCsvController = ImportCsvController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Importar datos desde CSV',
        description: 'Carga datos de una tabla especifica desde un archivo CSV. Admite delimitador coma o punto y coma.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'target',
        enum: import_target_dto_1.IMPORT_TARGET_ROUTE_VALUES,
        description: 'Tabla destino (admite singular y plural): curso/cursos, carrera/carreras, pensum/pensums, curso_prerrequisito, historial_academico, estudiante/estudiantes',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required: ['file'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: import_result_dto_1.ImportResultDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Archivo CSV invalido o datos inconsistentes' }),
    (0, common_1.Post)(':target'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        fileIsRequired: true,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_target_dto_1.ImportTargetParamDto, Object]),
    __metadata("design:returntype", Promise)
], ImportCsvController.prototype, "import", null);
exports.ImportCsvController = ImportCsvController = __decorate([
    (0, swagger_1.ApiTags)('Import CSV'),
    (0, common_1.Controller)('import-csv'),
    __metadata("design:paramtypes", [import_csv_service_1.ImportCsvService])
], ImportCsvController);
//# sourceMappingURL=import-csv.controller.js.map