import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreatePensumDto {
  @IsOptional()
  @IsBoolean()
  obligatorio?: boolean;

  @IsInt()
  creditos!: number;

  @IsOptional()
  @IsInt()
  id_semestre?: number;

  @IsOptional()
  @IsInt()
  id_carrera?: number;

  @IsOptional()
  @IsInt()
  id_curso?: number;
}
