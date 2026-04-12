import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateResumenEstudianteDto {
  @IsOptional()
  @IsInt()
  id_estudiante?: number;

  @IsOptional()
  @IsInt()
  cursos_aprobados?: number;

  @IsOptional()
  @IsInt()
  cursos_reprobados?: number;

  @IsOptional()
  @IsNumber()
  porcentaje_aprobacion?: number;

  @IsOptional()
  @IsInt()
  creditos_acumulados?: number;

  @IsOptional()
  @IsNumber()
  promedio_general?: number;

  @IsOptional()
  @IsNumber()
  promedio_limpio?: number;
}
