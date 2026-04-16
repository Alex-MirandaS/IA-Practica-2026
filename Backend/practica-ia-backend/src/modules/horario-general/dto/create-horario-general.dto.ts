import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateHorarioGeneralDto {
  @IsInt()
  id_curso_horario!: number;

  @IsOptional()
  @IsInt()
  id_seccion?: number;

  @IsOptional()
  @IsInt()
  cupo_maximo?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
