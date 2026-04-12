import { PartialType } from '@nestjs/mapped-types';
import { CreatePensumDto } from './create-pensum.dto';

export class UpdatePensumDto extends PartialType(CreatePensumDto) {}
