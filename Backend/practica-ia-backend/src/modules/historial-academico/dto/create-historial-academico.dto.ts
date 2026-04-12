import { IsBoolean, IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateHistorialAcademicoDto {
  @IsOptional()
  @IsInt()
  id_estudiante?: number;

  @IsOptional()
  @IsInt()
  id_curso?: number;

  @IsOptional()
  @IsNumber()
  nota?: number;

  @IsOptional()
  @IsBoolean()
  aprobado?: boolean;

  @IsOptional()
  @IsInt()
  anio?: number;

  @IsOptional()
  @IsInt()
  id_ciclo?: number;

  @IsOptional()
  @IsInt()
  intentos?: number;
}
