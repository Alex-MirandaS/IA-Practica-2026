import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ciclo } from './entities/ciclo.entity';
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';

@Injectable()
export class CicloService {
  constructor(
    @InjectRepository(Ciclo)
    private readonly cicloRepository: Repository<Ciclo>,
  ) {}

  create(createCicloDto: CreateCicloDto) {
    return this.cicloRepository.save(this.cicloRepository.create(createCicloDto));
  }

  findAll() {
    return this.cicloRepository.find();
  }

  findOne(id: number) {
    return this.cicloRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCicloDto: UpdateCicloDto) {
    await this.cicloRepository.update(id, updateCicloDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.cicloRepository.delete(id);
  }
}
