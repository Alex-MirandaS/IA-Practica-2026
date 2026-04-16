import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SeccionService } from './seccion.service';
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';

@ApiTags('seccion')
@Controller('seccion')
export class SeccionController {
  constructor(private readonly seccionService: SeccionService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro' })
  create(@Body() createSeccionDto: CreateSeccionDto) {
    return this.seccionService.create(createSeccionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar registros' })
  findAll() {
    return this.seccionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener registro por id' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.seccionService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar registro por id' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id') id: string, @Body() updateSeccionDto: UpdateSeccionDto) {
    return this.seccionService.update(+id, updateSeccionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar registro por id' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.seccionService.remove(+id);
  }
}
