import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleHorarioDto } from './create-detalle-horario.dto';

export class UpdateDetalleHorarioDto extends PartialType(CreateDetalleHorarioDto) {}
