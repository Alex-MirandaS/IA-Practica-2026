import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCicloDto {
  @IsString()
  @IsNotEmpty()
  ciclo!: string;
}
