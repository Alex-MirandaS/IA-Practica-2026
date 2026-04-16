import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PensumService } from './pensum.service';
import { CreatePensumDto } from './dto/create-pensum.dto';
import { UpdatePensumDto } from './dto/update-pensum.dto';

@ApiTags('pensum')
@Controller('pensum')
export class PensumController {
  constructor(private readonly pensumService: PensumService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro' })
  create(@Body() createPensumDto: CreatePensumDto) {
    return this.pensumService.create(createPensumDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar registros' })
  findAll() {
    return this.pensumService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener registro por id' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.pensumService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar registro por id' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id') id: string, @Body() updatePensumDto: UpdatePensumDto) {
    return this.pensumService.update(+id, updatePensumDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar registro por id' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.pensumService.remove(+id);
  }
}
