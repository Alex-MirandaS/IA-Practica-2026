import {
  BadRequestException,
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ImportCsvService } from './import-csv.service';
import { ImportResultDto } from './dto/import-result.dto';
import { IMPORT_TARGET_ROUTE_VALUES, ImportTargetParamDto } from './dto/import-target.dto';

type UploadedCsvFields = {
  file?: Array<{ buffer: Buffer }>;
  archivo?: Array<{ buffer: Buffer }>;
  csv?: Array<{ buffer: Buffer }>;
};

@ApiTags('Import CSV')
@Controller('import-csv')
export class ImportCsvController {
  constructor(private readonly importCsvService: ImportCsvService) {}

  @ApiOperation({
    summary: 'Importar datos desde CSV',
    description:
      'Carga datos de una tabla especifica desde un archivo CSV. Admite delimitador coma o punto y coma.',
  })
  @ApiParam({
    name: 'target',
    enum: IMPORT_TARGET_ROUTE_VALUES,
    description:
      'Tabla destino (admite singular y plural): curso/cursos, carrera/carreras, pensum/pensums, curso_prerrequisito, historial_academico, estudiante/estudiantes',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        archivo: {
          type: 'string',
          format: 'binary',
        },
        csv: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: ImportResultDto })
  @ApiResponse({ status: 400, description: 'Archivo CSV invalido o datos inconsistentes' })
  @Post(':target')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'archivo', maxCount: 1 },
      { name: 'csv', maxCount: 1 },
    ]),
  )
  async import(
    @Param() params: ImportTargetParamDto,
    @UploadedFiles() files: UploadedCsvFields,
  ): Promise<ImportResultDto> {
    const file = files?.file?.[0] ?? files?.archivo?.[0] ?? files?.csv?.[0];

    if (!file?.buffer) {
      throw new BadRequestException(
        'Debe enviar un archivo CSV en multipart/form-data (campo: file, archivo o csv)',
      );
    }

    return this.importCsvService.importByTarget(params.target, file.buffer);
  }
}