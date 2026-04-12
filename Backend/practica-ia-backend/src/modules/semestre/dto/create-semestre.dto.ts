import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSemestreDto {
  @IsString()
  @IsNotEmpty()
  semestre!: string;
}
