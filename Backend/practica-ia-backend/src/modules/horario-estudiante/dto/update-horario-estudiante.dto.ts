import { PartialType } from '@nestjs/mapped-types';
import { CreateHorarioEstudianteDto } from './create-horario-estudiante.dto';

export class UpdateHorarioEstudianteDto extends PartialType(CreateHorarioEstudianteDto) {}
