import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrera } from './entities/carrera.entity';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';

@Injectable()
export class CarreraService {
  constructor(
    @InjectRepository(Carrera)
    private readonly carreraRepository: Repository<Carrera>,
  ) {}

  create(createCarreraDto: CreateCarreraDto) {
    const carrera = this.carreraRepository.create(createCarreraDto);
    return this.carreraRepository.save(carrera);
  }

  findAll() {
    return this.carreraRepository.find();
  }

  findOne(id: number) {
    return this.carreraRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCarreraDto: UpdateCarreraDto) {
    await this.carreraRepository.update(id, updateCarreraDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.carreraRepository.delete(id);
  }
}
