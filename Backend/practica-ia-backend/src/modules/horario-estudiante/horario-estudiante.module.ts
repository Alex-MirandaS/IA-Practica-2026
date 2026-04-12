import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioEstudiante } from './entities/horario-estudiante.entity';
import { HorarioEstudianteService } from './horario-estudiante.service';
import { HorarioEstudianteController } from './horario-estudiante.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioEstudiante])],
  controllers: [HorarioEstudianteController],
  providers: [HorarioEstudianteService],
  exports: [HorarioEstudianteService],
})
export class HorarioEstudianteModule {}
