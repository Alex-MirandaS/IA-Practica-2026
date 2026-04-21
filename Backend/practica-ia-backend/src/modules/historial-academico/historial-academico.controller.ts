import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { HistorialAcademicoService } from './historial-academico.service';
import { CreateHistorialAcademicoDto } from './dto/create-historial-academico.dto';
import { UpdateHistorialAcademicoDto } from './dto/update-historial-academico.dto';

@ApiTags('historial-academico')
@Controller('historial-academico')
export class HistorialAcademicoController {
  constructor(private readonly service: HistorialAcademicoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro' })
  create(@Body() dto: CreateHistorialAcademicoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar registros' })
  findAll() {
    return this.service.findAll();
  }

  @Get('estudiante/carnet/:carnet')
  @ApiOperation({ summary: 'Listar historial academico por carnet de estudiante' })
  @ApiParam({ name: 'carnet', type: String })
  findByCarnet(@Param('carnet') carnet: string) {
    return this.service.findByCarnet(carnet);
  }

  @Get('resumen/carnet/:carnet')
  @ApiOperation({ summary: 'Calcular resumen academico por carnet' })
  @ApiParam({ name: 'carnet', type: String })
  findResumenByCarnet(@Param('carnet') carnet: string) {
    return this.service.findResumenByCarnet(carnet);
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
  update(@Param('id') id: string, @Body() dto: UpdateHistorialAcademicoDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar registro por id' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
