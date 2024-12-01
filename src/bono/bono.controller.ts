import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { BonoDto } from './bono.dto/bono.dto';
import { BonoEntity } from './bono.entity/bono.entity';
import { BonoService } from './bono.service';

@Controller('bonos')
@UseInterceptors(BusinessErrorsInterceptor)
export class BonoController {
    constructor(private readonly bonoService: BonoService) {}
    
    @Get(':userId/usuario')
    async findAllByUsuario(@Param('userId') userId: number) {
      return await this.bonoService.findAllBonosByUsuario(userId);
    }
  
    @Get(':codigo/codigo')
    async findByCodigo(@Param('codigo') codigo: string) {
      return await this.bonoService.findBonoByCodigo(codigo);
    }
  
    @Post()
    async create(@Body() bonoDto: BonoDto) {
      const bono: BonoEntity = plainToInstance(BonoEntity, bonoDto);
      return await this.bonoService.crearBono(bono);
    }
  
    @Delete(':bonoId')
    @HttpCode(204)
    async delete(@Param('bonoId') bonoId: number) {
      return await this.bonoService.deleteBono(bonoId);
    }
}
