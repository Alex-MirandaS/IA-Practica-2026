import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateSeleccionCursosDto {
  @IsOptional()
  @IsInt()
  id_estudiante?: number;

  @IsOptional()
  @IsInt()
  id_curso?: number;

  @IsOptional()
  @IsBoolean()
  seleccionado?: boolean;
}
