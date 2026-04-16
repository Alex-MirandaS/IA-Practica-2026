"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePensumDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_pensum_dto_1 = require("./create-pensum.dto");
class UpdatePensumDto extends (0, mapped_types_1.PartialType)(create_pensum_dto_1.CreatePensumDto) {
}
exports.UpdatePensumDto = UpdatePensumDto;
//# sourceMappingURL=update-pensum.dto.js.map