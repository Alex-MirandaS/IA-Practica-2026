import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioEstudiante } from './entities/horario-estudiante.entity';
import { HorarioEstudianteService } from './horario-estudiante.service';
import { HorarioEstudianteController } from './horario-estudiante.controller';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Pensum } from '../pensum/entities/pensum.entity';
import { SeleccionCursos } from '../seleccion-cursos/entities/seleccion-cursos.entity';
import { HistorialAcademico } from '../historial-academico/entities/historial-academico.entity';
import { CursoPrerrequisito } from '../curso-prerrequisito/entities/curso-prerrequisito.entity';
import { DetalleHorario } from '../detalle-horario/entities/detalle-horario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HorarioEstudiante,
      Estudiante,
      Pensum,
      SeleccionCursos,
      HistorialAcademico,
      CursoPrerrequisito,
      DetalleHorario,
    ]),
  ],
  controllers: [HorarioEstudianteController],
  providers: [HorarioEstudianteService],
  exports: [HorarioEstudianteService],
})
export class HorarioEstudianteModule {}
