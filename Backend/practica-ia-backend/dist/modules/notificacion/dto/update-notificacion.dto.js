"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificacionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_notificacion_dto_1 = require("./create-notificacion.dto");
class UpdateNotificacionDto extends (0, mapped_types_1.PartialType)(create_notificacion_dto_1.CreateNotificacionDto) {
}
exports.UpdateNotificacionDto = UpdateNotificacionDto;
//# sourceMappingURL=update-notificacion.dto.js.map