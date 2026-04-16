import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleHorario } from './entities/detalle-horario.entity';
import { DetalleHorarioService } from './detalle-horario.service';
import { DetalleHorarioController } from './detalle-horario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleHorario])],
  controllers: [DetalleHorarioController],
  providers: [DetalleHorarioService],
  exports: [DetalleHorarioService],
})
export class DetalleHorarioModule {}
