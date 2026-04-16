import { IsInt, IsOptional } from 'class-validator';

export class CreateDetalleHorarioDto {
  @IsOptional()
  @IsInt()
  id_horario?: number;

  @IsOptional()
  @IsInt()
  id_horario_general?: number;
}
