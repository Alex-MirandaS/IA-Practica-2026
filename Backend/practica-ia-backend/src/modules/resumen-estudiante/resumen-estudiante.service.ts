import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResumenEstudiante } from './entities/resumen-estudiante.entity';
import { CreateResumenEstudianteDto } from './dto/create-resumen-estudiante.dto';
import { UpdateResumenEstudianteDto } from './dto/update-resumen-estudiante.dto';
import { Estudiante } from '../estudiante/entities/estudiante.entity';

@Injectable()
export class ResumenEstudianteService {
  constructor(
    @InjectRepository(ResumenEstudiante)
    private readonly repository: Repository<ResumenEstudiante>,
  ) {}

  create(dto: CreateResumenEstudianteDto) {
    const entity = this.repository.create({
      cursos_aprobados: dto.cursos_aprobados,
      cursos_reprobados: dto.cursos_reprobados,
      porcentaje_aprobacion: dto.porcentaje_aprobacion,
      creditos_acumulados: dto.creditos_acumulados,
      promedio_general: dto.promedio_general,
      promedio_limpio: dto.promedio_limpio,
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

  async update(id: number, dto: UpdateResumenEstudianteDto) {
    const entity = await this.repository.preload({
      id,
      cursos_aprobados: dto.cursos_aprobados,
      cursos_reprobados: dto.cursos_reprobados,
      porcentaje_aprobacion: dto.porcentaje_aprobacion,
      creditos_acumulados: dto.creditos_acumulados,
      promedio_general: dto.promedio_general,
      promedio_limpio: dto.promedio_limpio,
      estudiante: dto.id_estudiante !== undefined ? (dto.id_estudiante ? ({ id: dto.id_estudiante } as Estudiante) : undefined) : undefined,
    });
    if (!entity) return null;
    return this.repository.save(entity);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
