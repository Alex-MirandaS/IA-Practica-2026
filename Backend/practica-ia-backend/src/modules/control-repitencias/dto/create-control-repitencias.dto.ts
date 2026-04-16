import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateControlRepitenciasDto {
  @IsOptional()
  @IsInt()
  id_estudiante?: number;

  @IsOptional()
  @IsInt()
  id_curso?: number;

  @IsOptional()
  @IsInt()
  total_intentos?: number;

  @IsOptional()
  @IsBoolean()
  alerta?: boolean;
}
