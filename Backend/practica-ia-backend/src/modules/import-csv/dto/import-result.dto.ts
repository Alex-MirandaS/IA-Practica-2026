import { ApiProperty } from '@nestjs/swagger';

export class ImportResultDto {
  @ApiProperty({ example: 'curso' })
  target!: string;

  @ApiProperty({ example: 20 })
  processed!: number;

  @ApiProperty({ example: 12 })
  inserted!: number;

  @ApiProperty({ example: 8 })
  updated!: number;

  @ApiProperty({
    type: [String],
    example: ['Fila 4: codigo ya existe', 'Fila 8: id_carrera no existe (999)'],
  })
  warnings!: string[];
}