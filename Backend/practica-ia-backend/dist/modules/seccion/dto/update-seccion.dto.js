"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSeccionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_seccion_dto_1 = require("./create-seccion.dto");
class UpdateSeccionDto extends (0, mapped_types_1.PartialType)(create_seccion_dto_1.CreateSeccionDto) {
}
exports.UpdateSeccionDto = UpdateSeccionDto;
//# sourceMappingURL=update-seccion.dto.js.map