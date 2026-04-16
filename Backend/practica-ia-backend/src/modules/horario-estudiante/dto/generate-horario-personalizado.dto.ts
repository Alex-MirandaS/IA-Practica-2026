import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class GenerateHorarioPersonalizadoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_estudiante!: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  selected_course_ids?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  max_credits?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(20)
  population_size?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(30)
  generations?: number;

  @IsOptional()
  @IsBoolean()
  persist?: boolean;
}
