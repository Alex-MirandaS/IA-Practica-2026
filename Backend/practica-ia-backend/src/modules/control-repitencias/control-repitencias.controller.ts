import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ControlRepitenciasService } from './control-repitencias.service';
import { CreateControlRepitenciasDto } from './dto/create-control-repitencias.dto';
import { UpdateControlRepitenciasDto } from './dto/update-control-repitencias.dto';

@ApiTags('control-repitencias')
@Controller('control-repitencias')
export class ControlRepitenciasController {
  constructor(private readonly service: ControlRepitenciasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro' })
  create(@Body() dto: CreateControlRepitenciasDto) {
    return this.service.create(dto);
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
  update(@Param('id') id: string, @Body() dto: UpdateControlRepitenciasDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar registro por id' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
