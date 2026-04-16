"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSemestreDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_semestre_dto_1 = require("./create-semestre.dto");
class UpdateSemestreDto extends (0, mapped_types_1.PartialType)(create_semestre_dto_1.CreateSemestreDto) {
}
exports.UpdateSemestreDto = UpdateSemestreDto;
//# sourceMappingURL=update-semestre.dto.js.map