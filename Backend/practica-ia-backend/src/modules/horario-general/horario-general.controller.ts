import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { HorarioGeneralService } from './horario-general.service';
import { CreateHorarioGeneralDto } from './dto/create-horario-general.dto';
import { UpdateHorarioGeneralDto } from './dto/update-horario-general.dto';

@ApiTags('horario-general')
@Controller('horario-general')
export class HorarioGeneralController {
  constructor(private readonly service: HorarioGeneralService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro' })
  create(@Body() dto: CreateHorarioGeneralDto) {
    return this.service.create(dto);
  }

  @Post('sync/latest')
  @ApiOperation({
    summary: 'Sincronizar desde servidor de horarios',
    description:
      'Consulta el backend externo (localhost:3000 por defecto), toma el ultimo horario y reconstruye horario_general con sus curso_horario.',
  })
  syncLatest() {
    return this.service.syncLatestFromScheduler();
  }

  @Post('sync/:horarioId')
  @ApiOperation({
    summary: 'Sincronizar horario especifico desde servidor de horarios',
    description:
      'Consulta el backend externo y sincroniza horario_general usando un id_horario especifico.',
  })
  @ApiParam({ name: 'horarioId', type: Number, description: 'ID del horario a sincronizar desde el servidor externo' })
  syncByHorarioId(@Param('horarioId', ParseIntPipe) horarioId: number) {
    return this.service.syncByHorarioId(horarioId);
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
  update(@Param('id') id: string, @Body() dto: UpdateHorarioGeneralDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar registro por id' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
