import { PartialType } from '@nestjs/mapped-types';
import { CreateHorarioGeneralDto } from './create-horario-general.dto';

export class UpdateHorarioGeneralDto extends PartialType(CreateHorarioGeneralDto) {}
