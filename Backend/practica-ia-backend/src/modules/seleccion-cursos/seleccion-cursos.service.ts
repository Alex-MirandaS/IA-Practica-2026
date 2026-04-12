import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeleccionCursos } from './entities/seleccion-cursos.entity';
import { CreateSeleccionCursosDto } from './dto/create-seleccion-cursos.dto';
import { UpdateSeleccionCursosDto } from './dto/update-seleccion-cursos.dto';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Curso } from '../curso/entities/curso.entity';

@Injectable()
export class SeleccionCursosService {
  constructor(
    @InjectRepository(SeleccionCursos)
    private readonly repository: Repository<SeleccionCursos>,
  ) {}

  create(dto: CreateSeleccionCursosDto) {
    const entity = this.repository.create({
      seleccionado: dto.seleccionado ?? true,
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

  async update(id: number, dto: UpdateSeleccionCursosDto) {
    const entity = await this.repository.preload({
      id,
      seleccionado: dto.seleccionado,
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
