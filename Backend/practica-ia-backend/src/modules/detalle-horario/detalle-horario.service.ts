import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleHorario } from './entities/detalle-horario.entity';
import { CreateDetalleHorarioDto } from './dto/create-detalle-horario.dto';
import { UpdateDetalleHorarioDto } from './dto/update-detalle-horario.dto';
import { HorarioEstudiante } from '../horario-estudiante/entities/horario-estudiante.entity';
import { HorarioGeneral } from '../horario-general/entities/horario-general.entity';

@Injectable()
export class DetalleHorarioService {
  constructor(
    @InjectRepository(DetalleHorario)
    private readonly repository: Repository<DetalleHorario>,
  ) {}

  create(dto: CreateDetalleHorarioDto) {
    const entity = this.repository.create({
      horario: dto.id_horario ? ({ id: dto.id_horario } as HorarioEstudiante) : undefined,
      horarioGeneral: dto.id_horario_general ? ({ id: dto.id_horario_general } as HorarioGeneral) : undefined,
    });
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find({ relations: ['horario', 'horarioGeneral'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['horario', 'horarioGeneral'] });
  }

  async update(id: number, dto: UpdateDetalleHorarioDto) {
    const entity = await this.repository.preload({
      id,
      horario: dto.id_horario !== undefined ? (dto.id_horario ? ({ id: dto.id_horario } as HorarioEstudiante) : undefined) : undefined,
      horarioGeneral: dto.id_horario_general !== undefined ? (dto.id_horario_general ? ({ id: dto.id_horario_general } as HorarioGeneral) : undefined) : undefined,
    });
    if (!entity) return null;
    return this.repository.save(entity);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
