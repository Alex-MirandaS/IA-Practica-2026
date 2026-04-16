import { IsInt, IsOptional } from 'class-validator';

export class CreateCursoPrerrequisitoDto {
  @IsOptional()
  @IsInt()
  id_pensum?: number;

  @IsOptional()
  @IsInt()
  id_prerrequisito?: number;
}
