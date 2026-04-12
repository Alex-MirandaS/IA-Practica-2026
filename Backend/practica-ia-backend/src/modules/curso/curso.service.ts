import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  create(createCursoDto: CreateCursoDto) {
    return this.cursoRepository.save(this.cursoRepository.create(createCursoDto));
  }

  findAll() {
    return this.cursoRepository.find();
  }

  findOne(id: number) {
    return this.cursoRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCursoDto: UpdateCursoDto) {
    await this.cursoRepository.update(id, updateCursoDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.cursoRepository.delete(id);
  }
}
