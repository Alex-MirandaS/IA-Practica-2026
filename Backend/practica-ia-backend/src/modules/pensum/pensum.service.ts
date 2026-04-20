import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pensum } from './entities/pensum.entity';
import { CreatePensumDto } from './dto/create-pensum.dto';
import { UpdatePensumDto } from './dto/update-pensum.dto';
import { Semestre } from '../semestre/entities/semestre.entity';
import { Carrera } from '../carrera/entities/carrera.entity';
import { Curso } from '../curso/entities/curso.entity';

@Injectable()
export class PensumService {
  constructor(
    @InjectRepository(Pensum)
    private readonly pensumRepository: Repository<Pensum>,
  ) {}

  create(createPensumDto: CreatePensumDto) {
    const pensum = this.pensumRepository.create({
      obligatorio: createPensumDto.obligatorio ?? true,
      creditos: createPensumDto.creditos,
      semestre: createPensumDto.id_semestre ? ({ id: createPensumDto.id_semestre } as Semestre) : undefined,
      carrera: createPensumDto.id_carrera ? ({ id: createPensumDto.id_carrera } as Carrera) : undefined,
      curso: createPensumDto.id_curso ? ({ id: createPensumDto.id_curso } as Curso) : undefined,
    });

    return this.pensumRepository.save(pensum);
  }

  findAll() {
    return this.pensumRepository.find({ relations: ['semestre', 'carrera', 'curso'] });
  }

  findByCarrera(idCarrera: number) {
    return this.pensumRepository.find({
      where: { carrera: { id: idCarrera } },
      relations: ['semestre', 'carrera', 'curso'],
    });
  }

  findOne(id: number) {
    return this.pensumRepository.findOne({ where: { id }, relations: ['semestre', 'carrera', 'curso'] });
  }

  async update(id: number, updatePensumDto: UpdatePensumDto) {
    const entity = await this.pensumRepository.preload({
      id,
      obligatorio: updatePensumDto.obligatorio,
      creditos: updatePensumDto.creditos,
      semestre: updatePensumDto.id_semestre !== undefined ? (updatePensumDto.id_semestre ? ({ id: updatePensumDto.id_semestre } as Semestre) : undefined) : undefined,
      carrera: updatePensumDto.id_carrera !== undefined ? (updatePensumDto.id_carrera ? ({ id: updatePensumDto.id_carrera } as Carrera) : undefined) : undefined,
      curso: updatePensumDto.id_curso !== undefined ? (updatePensumDto.id_curso ? ({ id: updatePensumDto.id_curso } as Curso) : undefined) : undefined,
    });

    if (!entity) return null;
    return this.pensumRepository.save(entity);
  }

  remove(id: number) {
    return this.pensumRepository.delete(id);
  }
}
