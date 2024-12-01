import { Module } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { ClaseController } from './clase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity/clase.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ClaseEntity])],
  providers: [ClaseService],
  controllers: [ClaseController],
  exports: [ClaseService],
})
export class ClaseModule {}
