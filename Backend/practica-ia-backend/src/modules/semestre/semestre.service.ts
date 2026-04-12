import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semestre } from './entities/semestre.entity';
import { CreateSemestreDto } from './dto/create-semestre.dto';
import { UpdateSemestreDto } from './dto/update-semestre.dto';

@Injectable()
export class SemestreService {
  constructor(
    @InjectRepository(Semestre)
    private readonly semestreRepository: Repository<Semestre>,
  ) {}

  create(createSemestreDto: CreateSemestreDto) {
    return this.semestreRepository.save(this.semestreRepository.create(createSemestreDto));
  }

  findAll() {
    return this.semestreRepository.find();
  }

  findOne(id: number) {
    return this.semestreRepository.findOne({ where: { id } });
  }

  async update(id: number, updateSemestreDto: UpdateSemestreDto) {
    await this.semestreRepository.update(id, updateSemestreDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.semestreRepository.delete(id);
  }
}
