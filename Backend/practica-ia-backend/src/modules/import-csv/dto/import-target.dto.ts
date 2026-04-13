import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export enum ImportTarget {
  CURSO = 'curso',
  CARRERA = 'carrera',
  PENSUM = 'pensum',
  CURSO_PRERREQUISITO = 'curso_prerrequisito',
  HISTORIAL_ACADEMICO = 'historial_academico',
  ESTUDIANTE = 'estudiante',
}

const IMPORT_TARGET_ALIASES: Readonly<Record<string, ImportTarget>> = {
  curso: ImportTarget.CURSO,
  cursos: ImportTarget.CURSO,
  carrera: ImportTarget.CARRERA,
  carreras: ImportTarget.CARRERA,
  pensum: ImportTarget.PENSUM,
  pensums: ImportTarget.PENSUM,
  curso_prerrequisito: ImportTarget.CURSO_PRERREQUISITO,
  'curso-prerrequisito': ImportTarget.CURSO_PRERREQUISITO,
  curso_prerrequisitos: ImportTarget.CURSO_PRERREQUISITO,
  'curso-prerrequisitos': ImportTarget.CURSO_PRERREQUISITO,
  historial_academico: ImportTarget.HISTORIAL_ACADEMICO,
  'historial-academico': ImportTarget.HISTORIAL_ACADEMICO,
  historial: ImportTarget.HISTORIAL_ACADEMICO,
  estudiante: ImportTarget.ESTUDIANTE,
  estudiantes: ImportTarget.ESTUDIANTE,
};

export const IMPORT_TARGET_ROUTE_VALUES = Object.keys(IMPORT_TARGET_ALIASES);

export function normalizeImportTarget(value: string): ImportTarget | undefined {
  return IMPORT_TARGET_ALIASES[value.trim().toLowerCase()];
}

export class ImportTargetParamDto {
  @ApiProperty({
    enum: IMPORT_TARGET_ROUTE_VALUES,
    description: 'Tabla de destino para la importacion',
    example: ImportTarget.CURSO,
  })
  @IsString()
  target!: string;
}