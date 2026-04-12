import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSeccionDto {
  @IsString()
  @IsNotEmpty()
  seccion!: string;
}
