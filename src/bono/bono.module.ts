import { Module } from '@nestjs/common';
import { BonoService } from './bono.service';
import { BonoController } from './bono.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity/bono.entity';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BonoEntity, UsuarioEntity, ClaseEntity])],
  providers: [BonoService],
  controllers: [BonoController],
  exports: [BonoService],
})
export class BonoModule {}
