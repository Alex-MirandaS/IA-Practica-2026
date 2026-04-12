import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioGeneral } from './entities/horario-general.entity';
import { HorarioGeneralService } from './horario-general.service';
import { HorarioGeneralController } from './horario-general.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioGeneral])],
  controllers: [HorarioGeneralController],
  providers: [HorarioGeneralService],
  exports: [HorarioGeneralService],
})
export class HorarioGeneralModule {}
