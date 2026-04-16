import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateNotificacionDto {
  @IsOptional()
  @IsInt()
  id_estudiante?: number;

  @IsOptional()
  @IsString()
  mensaje?: string;

  @IsOptional()
  @IsBoolean()
  leido?: boolean;
}
