import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seccion } from './entities/seccion.entity';
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';

@Injectable()
export class SeccionService {
  constructor(
    @InjectRepository(Seccion)
    private readonly seccionRepository: Repository<Seccion>,
  ) {}

  create(createSeccionDto: CreateSeccionDto) {
    return this.seccionRepository.save(this.seccionRepository.create(createSeccionDto));
  }

  findAll() {
    return this.seccionRepository.find();
  }

  findOne(id: number) {
    return this.seccionRepository.findOne({ where: { id } });
  }

  async update(id: number, updateSeccionDto: UpdateSeccionDto) {
    await this.seccionRepository.update(id, updateSeccionDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.seccionRepository.delete(id);
  }
}
