import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialAcademico } from './entities/historial-academico.entity';
import { HistorialAcademicoService } from './historial-academico.service';
import { HistorialAcademicoController } from './historial-academico.controller';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Pensum } from '../pensum/entities/pensum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialAcademico, Estudiante, Pensum])],
  controllers: [HistorialAcademicoController],
  providers: [HistorialAcademicoService],
  exports: [HistorialAcademicoService],
})
export class HistorialAcademicoModule {}
