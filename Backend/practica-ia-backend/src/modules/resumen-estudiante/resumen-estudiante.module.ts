import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumenEstudiante } from './entities/resumen-estudiante.entity';
import { ResumenEstudianteService } from './resumen-estudiante.service';
import { ResumenEstudianteController } from './resumen-estudiante.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ResumenEstudiante])],
  controllers: [ResumenEstudianteController],
  providers: [ResumenEstudianteService],
  exports: [ResumenEstudianteService],
})
export class ResumenEstudianteModule {}
