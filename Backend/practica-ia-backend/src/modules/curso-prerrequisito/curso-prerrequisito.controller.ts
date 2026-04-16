import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CursoPrerrequisitoService } from './curso-prerrequisito.service';
import { CreateCursoPrerrequisitoDto } from './dto/create-curso-prerrequisito.dto';
import { UpdateCursoPrerrequisitoDto } from './dto/update-curso-prerrequisito.dto';

@ApiTags('curso-prerrequisito')
@Controller('curso-prerrequisito')
export class CursoPrerrequisitoController {
  constructor(private readonly service: CursoPrerrequisitoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro' })
  create(@Body() dto: CreateCursoPrerrequisitoDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateCursoPrerrequisitoDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar registro por id' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
