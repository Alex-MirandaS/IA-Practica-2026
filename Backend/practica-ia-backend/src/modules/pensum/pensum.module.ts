import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pensum } from './entities/pensum.entity';
import { PensumService } from './pensum.service';
import { PensumController } from './pensum.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pensum])],
  controllers: [PensumController],
  providers: [PensumService],
  exports: [PensumService],
})
export class PensumModule {}
