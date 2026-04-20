import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CursoPrerrequisito } from './entities/curso-prerrequisito.entity';
import { CreateCursoPrerrequisitoDto } from './dto/create-curso-prerrequisito.dto';
import { UpdateCursoPrerrequisitoDto } from './dto/update-curso-prerrequisito.dto';
import { Pensum } from '../pensum/entities/pensum.entity';
import { Curso } from '../curso/entities/curso.entity';

@Injectable()
export class CursoPrerrequisitoService {
  constructor(
    @InjectRepository(CursoPrerrequisito)
    private readonly repository: Repository<CursoPrerrequisito>,
  ) {}

  create(dto: CreateCursoPrerrequisitoDto) {
    const entity = this.repository.create({
      pensum: dto.id_pensum ? ({ id: dto.id_pensum } as Pensum) : undefined,
      prerrequisito: dto.id_prerrequisito ? ({ id: dto.id_prerrequisito } as Curso) : undefined,
    });
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find({ relations: ['pensum', 'prerrequisito'] });
  }

  findByPensum(idPensum: number) {
    return this.repository.find({
      where: { pensum: { id: idPensum } },
      relations: ['pensum', 'prerrequisito'],
    });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['pensum', 'prerrequisito'] });
  }

  async update(id: number, dto: UpdateCursoPrerrequisitoDto) {
    const entity = await this.repository.preload({
      id,
      pensum: dto.id_pensum !== undefined ? (dto.id_pensum ? ({ id: dto.id_pensum } as Pensum) : undefined) : undefined,
      prerrequisito: dto.id_prerrequisito !== undefined ? (dto.id_prerrequisito ? ({ id: dto.id_prerrequisito } as Curso) : undefined) : undefined,
    });
    if (!entity) return null;
    return this.repository.save(entity);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
