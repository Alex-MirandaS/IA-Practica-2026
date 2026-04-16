import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeleccionCursos } from './entities/seleccion-cursos.entity';
import { SeleccionCursosService } from './seleccion-cursos.service';
import { SeleccionCursosController } from './seleccion-cursos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SeleccionCursos])],
  controllers: [SeleccionCursosController],
  providers: [SeleccionCursosService],
  exports: [SeleccionCursosService],
})
export class SeleccionCursosModule {}
