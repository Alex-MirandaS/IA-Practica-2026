import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { HorarioEstudianteService } from './horario-estudiante.service';
import { CreateHorarioEstudianteDto } from './dto/create-horario-estudiante.dto';
import { UpdateHorarioEstudianteDto } from './dto/update-horario-estudiante.dto';
import { GenerateHorarioPersonalizadoDto } from './dto/generate-horario-personalizado.dto';

@ApiTags('horario-estudiante')
@Controller('horario-estudiante')
export class HorarioEstudianteController {
  constructor(private readonly service: HorarioEstudianteService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro' })
  create(@Body() dto: CreateHorarioEstudianteDto) {
    return this.service.create(dto);
  }

  @Get('preview/:idEstudiante')
  @ApiOperation({
    summary: 'Previsualizar cursos para generar horario',
    description:
      'Marca por defecto cursos obligatorios abiertos y muestra elegibilidad por prerrequisitos/creditos acumulados.',
  })
  @ApiParam({ name: 'idEstudiante', type: Number })
  previewCursos(@Param('idEstudiante', ParseIntPipe) idEstudiante: number) {
    return this.service.previewCursosParaSeleccion(idEstudiante);
  }

  @Post('generar')
  @ApiOperation({
    summary: 'Generar horario personalizado con algoritmo genetico',
    description:
      'Genera el mejor horario posible priorizando cursos cuello de botella y evitando traslapes. Si hay conflicto, retorna alternativas.',
  })
  generarHorario(@Body() dto: GenerateHorarioPersonalizadoDto) {
    return this.service.generarHorarioPersonalizado(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar registros' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener registro por id' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar registro por id' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id') id: string, @Body() dto: UpdateHorarioEstudianteDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar registro por id' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
