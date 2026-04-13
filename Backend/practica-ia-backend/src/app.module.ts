import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database';
import { CarreraModule } from './modules/carrera/carrera.module';
import { SemestreModule } from './modules/semestre/semestre.module';
import { CicloModule } from './modules/ciclo/ciclo.module';
import { SeccionModule } from './modules/seccion/seccion.module';
import { EstudianteModule } from './modules/estudiante/estudiante.module';
import { CursoModule } from './modules/curso/curso.module';
import { PensumModule } from './modules/pensum/pensum.module';
import { CursoPrerrequisitoModule } from './modules/curso-prerrequisito/curso-prerrequisito.module';
import { HorarioGeneralModule } from './modules/horario-general/horario-general.module';
import { HistorialAcademicoModule } from './modules/historial-academico/historial-academico.module';
import { SeleccionCursosModule } from './modules/seleccion-cursos/seleccion-cursos.module';
import { HorarioEstudianteModule } from './modules/horario-estudiante/horario-estudiante.module';
import { DetalleHorarioModule } from './modules/detalle-horario/detalle-horario.module';
import { NotificacionModule } from './modules/notificacion/notificacion.module';
import { ControlRepitenciasModule } from './modules/control-repitencias/control-repitencias.module';
import { ResumenEstudianteModule } from './modules/resumen-estudiante/resumen-estudiante.module';
import { ImportCsvModule } from './modules/import-csv/import-csv.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    CarreraModule,
    SemestreModule,
    CicloModule,
    SeccionModule,
    EstudianteModule,
    CursoModule,
    PensumModule,
    CursoPrerrequisitoModule,
    HorarioGeneralModule,
    HistorialAcademicoModule,
    SeleccionCursosModule,
    HorarioEstudianteModule,
    DetalleHorarioModule,
    NotificacionModule,
    ControlRepitenciasModule,
    ResumenEstudianteModule,
    ImportCsvModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
