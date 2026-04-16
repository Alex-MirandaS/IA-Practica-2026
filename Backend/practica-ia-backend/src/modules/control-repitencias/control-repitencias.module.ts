import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControlRepitencias } from './entities/control-repitencias.entity';
import { ControlRepitenciasService } from './control-repitencias.service';
import { ControlRepitenciasController } from './control-repitencias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ControlRepitencias])],
  controllers: [ControlRepitenciasController],
  providers: [ControlRepitenciasService],
  exports: [ControlRepitenciasService],
})
export class ControlRepitenciasModule {}
