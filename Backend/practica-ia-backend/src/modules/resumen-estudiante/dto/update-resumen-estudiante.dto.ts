import { PartialType } from '@nestjs/mapped-types';
import { CreateResumenEstudianteDto } from './create-resumen-estudiante.dto';

export class UpdateResumenEstudianteDto extends PartialType(CreateResumenEstudianteDto) {}
