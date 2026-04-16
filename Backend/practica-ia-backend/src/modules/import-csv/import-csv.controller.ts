import {
  BadRequestException,
  Controller,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportCsvService } from './import-csv.service';
import { ImportResultDto } from './dto/import-result.dto';
import { IMPORT_TARGET_ROUTE_VALUES, ImportTargetParamDto } from './dto/import-target.dto';

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
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, type: ImportResultDto })
  @ApiResponse({ status: 400, description: 'Archivo CSV invalido o datos inconsistentes' })
  @Post(':target')
  @UseInterceptors(FileInterceptor('file'))
  async import(
    @Param() params: ImportTargetParamDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: { buffer: Buffer } | undefined,
  ): Promise<ImportResultDto> {
    if (!file?.buffer) {
      throw new BadRequestException('No se recibio el archivo CSV');
    }

    return this.importCsvService.importByTarget(params.target, file.buffer);
  }
}