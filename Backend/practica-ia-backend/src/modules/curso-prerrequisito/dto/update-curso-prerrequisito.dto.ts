import { PartialType } from '@nestjs/mapped-types';
import { CreateCursoPrerrequisitoDto } from './create-curso-prerrequisito.dto';

export class UpdateCursoPrerrequisitoDto extends PartialType(CreateCursoPrerrequisitoDto) {}
