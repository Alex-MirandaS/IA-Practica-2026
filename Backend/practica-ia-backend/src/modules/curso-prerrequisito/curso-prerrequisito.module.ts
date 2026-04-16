import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursoPrerrequisito } from './entities/curso-prerrequisito.entity';
import { CursoPrerrequisitoService } from './curso-prerrequisito.service';
import { CursoPrerrequisitoController } from './curso-prerrequisito.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CursoPrerrequisito])],
  controllers: [CursoPrerrequisitoController],
  providers: [CursoPrerrequisitoService],
  exports: [CursoPrerrequisitoService],
})
export class CursoPrerrequisitoModule {}
