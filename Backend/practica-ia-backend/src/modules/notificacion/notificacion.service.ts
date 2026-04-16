import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { Estudiante } from '../estudiante/entities/estudiante.entity';

@Injectable()
export class NotificacionService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly repository: Repository<Notificacion>,
  ) {}

  create(dto: CreateNotificacionDto) {
    const entity = this.repository.create({
      mensaje: dto.mensaje,
      leido: dto.leido ?? false,
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

  async update(id: number, dto: UpdateNotificacionDto) {
    const entity = await this.repository.preload({
      id,
      mensaje: dto.mensaje,
      leido: dto.leido,
      estudiante: dto.id_estudiante !== undefined ? (dto.id_estudiante ? ({ id: dto.id_estudiante } as Estudiante) : undefined) : undefined,
    });
    if (!entity) return null;
    return this.repository.save(entity);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
