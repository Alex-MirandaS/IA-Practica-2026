import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioGeneral } from './entities/horario-general.entity';
import { CreateHorarioGeneralDto } from './dto/create-horario-general.dto';
import { UpdateHorarioGeneralDto } from './dto/update-horario-general.dto';
import { Seccion } from '../seccion/entities/seccion.entity';

@Injectable()
export class HorarioGeneralService {
  constructor(
    @InjectRepository(HorarioGeneral)
    private readonly repository: Repository<HorarioGeneral>,
  ) {}

  create(dto: CreateHorarioGeneralDto) {
    const entity = this.repository.create({
      id_curso_horario: dto.id_curso_horario,
      cupo_maximo: dto.cupo_maximo,
      activo: dto.activo ?? true,
      seccion: dto.id_seccion ? ({ id: dto.id_seccion } as Seccion) : undefined,
    });
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find({ relations: ['seccion'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['seccion'] });
  }

  async update(id: number, dto: UpdateHorarioGeneralDto) {
    const entity = await this.repository.preload({
      id,
      id_curso_horario: dto.id_curso_horario,
      cupo_maximo: dto.cupo_maximo,
      activo: dto.activo,
      seccion: dto.id_seccion !== undefined ? (dto.id_seccion ? ({ id: dto.id_seccion } as Seccion) : undefined) : undefined,
    });
    if (!entity) return null;
    return this.repository.save(entity);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
