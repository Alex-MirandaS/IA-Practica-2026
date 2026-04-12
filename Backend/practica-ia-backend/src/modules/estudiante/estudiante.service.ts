import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { Carrera } from '../carrera/entities/carrera.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}

  create(createEstudianteDto: CreateEstudianteDto) {
    const estudiante = this.estudianteRepository.create({
      carnet: createEstudianteDto.carnet,
      nombre: createEstudianteDto.nombre,
      apellido: createEstudianteDto.apellido,
      correo: createEstudianteDto.correo,
      carrera: createEstudianteDto.id_carrera
        ? ({ id: createEstudianteDto.id_carrera } as Carrera)
        : undefined,
    });

    return this.estudianteRepository.save(estudiante);
  }

  findAll() {
    return this.estudianteRepository.find({ relations: ['carrera'] });
  }

  findOne(id: number) {
    return this.estudianteRepository.findOne({ where: { id }, relations: ['carrera'] });
  }

  async update(id: number, updateEstudianteDto: UpdateEstudianteDto) {
    const partial: any = { ...updateEstudianteDto };
    if (updateEstudianteDto.id_carrera !== undefined) {
      partial.carrera = updateEstudianteDto.id_carrera
        ? ({ id: updateEstudianteDto.id_carrera } as Carrera)
        : null;
      delete partial.id_carrera;
    }
    await this.estudianteRepository.update(id, partial);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.estudianteRepository.delete(id);
  }
}
