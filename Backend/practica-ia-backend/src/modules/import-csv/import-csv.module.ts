import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportCsvController } from './import-csv.controller';
import { ImportCsvService } from './import-csv.service';
import { Curso } from '../curso/entities/curso.entity';
import { Carrera } from '../carrera/entities/carrera.entity';
import { Pensum } from '../pensum/entities/pensum.entity';
import { CursoPrerrequisito } from '../curso-prerrequisito/entities/curso-prerrequisito.entity';
import { HistorialAcademico } from '../historial-academico/entities/historial-academico.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Semestre } from '../semestre/entities/semestre.entity';
import { Ciclo } from '../ciclo/entities/ciclo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Curso,
      Carrera, 
      Pensum,
      CursoPrerrequisito,
      HistorialAcademico, 
      Estudiante,
      Semestre,
      Ciclo,
    ]),
  ],
  controllers: [ImportCsvController],
  providers: [ImportCsvService],
})
export class ImportCsvModule {}