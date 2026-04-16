import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsOptional()
  @IsInt()
  id_externo?: number;
}
