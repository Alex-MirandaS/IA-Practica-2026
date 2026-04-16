import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semestre } from './entities/semestre.entity';
import { SemestreService } from './semestre.service';
import { SemestreController } from './semestre.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Semestre])],
  controllers: [SemestreController],
  providers: [SemestreService],
  exports: [SemestreService],
})
export class SemestreModule {}
