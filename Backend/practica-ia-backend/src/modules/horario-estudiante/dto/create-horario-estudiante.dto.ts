import { IsInt, IsOptional } from 'class-validator';

export class CreateHorarioEstudianteDto {
  @IsOptional()
  @IsInt()
  id_estudiante?: number;
}
