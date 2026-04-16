"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCursoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_curso_dto_1 = require("./create-curso.dto");
class UpdateCursoDto extends (0, mapped_types_1.PartialType)(create_curso_dto_1.CreateCursoDto) {
}
exports.UpdateCursoDto = UpdateCursoDto;
//# sourceMappingURL=update-curso.dto.js.map