import { PartialType } from '@nestjs/mapped-types';
import { CreateControlRepitenciasDto } from './create-control-repitencias.dto';

export class UpdateControlRepitenciasDto extends PartialType(CreateControlRepitenciasDto) {}
