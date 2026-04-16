"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCicloDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ciclo_dto_1 = require("./create-ciclo.dto");
class UpdateCicloDto extends (0, mapped_types_1.PartialType)(create_ciclo_dto_1.CreateCicloDto) {
}
exports.UpdateCicloDto = UpdateCicloDto;
//# sourceMappingURL=update-ciclo.dto.js.map