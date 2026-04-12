import { PartialType } from '@nestjs/mapped-types';
import { CreateSeleccionCursosDto } from './create-seleccion-cursos.dto';

export class UpdateSeleccionCursosDto extends PartialType(CreateSeleccionCursosDto) {}
