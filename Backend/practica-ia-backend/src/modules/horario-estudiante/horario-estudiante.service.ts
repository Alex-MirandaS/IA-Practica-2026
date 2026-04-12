import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioEstudiante } from './entities/horario-estudiante.entity';
import { CreateHorarioEstudianteDto } from './dto/create-horario-estudiante.dto';
import { UpdateHorarioEstudianteDto } from './dto/update-horario-estudiante.dto';
import { Estudiante } from '../estudiante/entities/estudiante.entity';

@Injectable()
export class HorarioEstudianteService {
  constructor(
    @InjectRepository(HorarioEstudiante)
    private readonly repository: Repository<HorarioEstudiante>,
  ) {}

  create(dto: CreateHorarioEstudianteDto) {
    const entity = this.repository.create({
      estudiante: dto.id_estudiante ? ({ id: dto.id_estudiante } as Estudiante) : undefined,
    });
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find({ relations: ['estudiante'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['estudiante'] });
  }

  async update(id: number, dto: UpdateHorarioEstudianteDto) {
    const entity = await this.repository.preload({
      id,
      estudiante: dto.id_estudiante !== undefined ? (dto.id_estudiante ? ({ id: dto.id_estudiante } as Estudiante) : undefined) : undefined,
    });
    if (!entity) return null;
    return this.repository.save(entity);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
