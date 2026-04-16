import { IsEmail, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateEstudianteDto {
  @IsString()
  @IsNotEmpty()
  carnet!: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsOptional()
  @IsInt()
  id_carrera?: number;
}
