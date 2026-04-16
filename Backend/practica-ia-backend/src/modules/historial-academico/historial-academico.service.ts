import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialAcademico } from './entities/historial-academico.entity';
import { CreateHistorialAcademicoDto } from './dto/create-historial-academico.dto';
import { UpdateHistorialAcademicoDto } from './dto/update-historial-academico.dto';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Curso } from '../curso/entities/curso.entity';
import { Ciclo } from '../ciclo/entities/ciclo.entity';

@Injectable()
export class HistorialAcademicoService {
  constructor(
    @InjectRepository(HistorialAcademico)
    private readonly repository: Repository<HistorialAcademico>,
  ) {}

  create(dto: CreateHistorialAcademicoDto) {
    const entity = this.repository.create({
      nota: dto.nota,
      aprobado: dto.aprobado,
      anio: dto.anio,
      intentos: dto.intentos ?? 1,
      estudiante: dto.id_estudiante ? ({ id: dto.id_estudiante } as Estudiante) : undefined,
      curso: dto.id_curso ? ({ id: dto.id_curso } as Curso) : undefined,
      ciclo: dto.id_ciclo ? ({ id: dto.id_ciclo } as Ciclo) : undefined,
    });
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find({ relations: ['estudiante', 'curso', 'ciclo'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['estudiante', 'curso', 'ciclo'] });
  }

  async update(id: number, dto: UpdateHistorialAcademicoDto) {
    const entity = await this.repository.preload({
      id,
      nota: dto.nota,
      aprobado: dto.aprobado,
      anio: dto.anio,
      intentos: dto.intentos,
      estudiante: dto.id_estudiante !== undefined ? (dto.id_estudiante ? ({ id: dto.id_estudiante } as Estudiante) : undefined) : undefined,
      curso: dto.id_curso !== undefined ? (dto.id_curso ? ({ id: dto.id_curso } as Curso) : undefined) : undefined,
      ciclo: dto.id_ciclo !== undefined ? (dto.id_ciclo ? ({ id: dto.id_ciclo } as Ciclo) : undefined) : undefined,
    });
    if (!entity) return null;
    return this.repository.save(entity);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
