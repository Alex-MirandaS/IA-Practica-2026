"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCarreraDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_carrera_dto_1 = require("./create-carrera.dto");
class UpdateCarreraDto extends (0, mapped_types_1.PartialType)(create_carrera_dto_1.CreateCarreraDto) {
}
exports.UpdateCarreraDto = UpdateCarreraDto;
//# sourceMappingURL=update-carrera.dto.js.map