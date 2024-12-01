import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ClaseDto } from './clase.dto/clase.dto';
import { ClaseEntity } from './clase.entity/clase.entity';
import { ClaseService } from './clase.service';

@Controller('clases')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClaseController {
    constructor(private readonly claseService: ClaseService) {}

    @Get(':claseId')
    async findOne(@Param('claseId') claseId: number) {
      return await this.claseService.findClaseById(claseId);
    }
  
    @Post()
    async create(@Body() claseDto: ClaseDto) {
      const clase: ClaseEntity = plainToInstance(ClaseEntity, claseDto);
      return await this.claseService.crearClase(clase);
    }
}
