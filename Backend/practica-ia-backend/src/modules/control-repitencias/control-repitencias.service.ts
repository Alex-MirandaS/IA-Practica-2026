import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControlRepitencias } from './entities/control-repitencias.entity';
import { CreateControlRepitenciasDto } from './dto/create-control-repitencias.dto';
import { UpdateControlRepitenciasDto } from './dto/update-control-repitencias.dto';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Curso } from '../curso/entities/curso.entity';

@Injectable()
export class ControlRepitenciasService {
  constructor(
    @InjectRepository(ControlRepitencias)
    private readonly repository: Repository<ControlRepitencias>,
  ) {}

  create(dto: CreateControlRepitenciasDto) {
    const entity = this.repository.create({
      total_intentos: dto.total_intentos ?? 0,
      alerta: dto.alerta ?? false,
      estudiante: dto.id_estudiante ? ({ id: dto.id_estudiante } as Estudiante) : undefined,
      curso: dto.id_curso ? ({ id: dto.id_curso } as Curso) : undefined,
    });
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find({ relations: ['estudiante', 'curso'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['estudiante', 'curso'] });
  }

  async update(id: number, dto: UpdateControlRepitenciasDto) {
    const entity = await this.repository.preload({
      id,
      total_intentos: dto.total_intentos,
      alerta: dto.alerta,
      estudiante: dto.id_estudiante !== undefined ? (dto.id_estudiante ? ({ id: dto.id_estudiante } as Estudiante) : undefined) : undefined,
      curso: dto.id_curso !== undefined ? (dto.id_curso ? ({ id: dto.id_curso } as Curso) : undefined) : undefined,
    });
    if (!entity) return null;
    return this.repository.save(entity);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
