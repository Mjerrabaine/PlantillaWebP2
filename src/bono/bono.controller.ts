import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { BonoDto } from './bono.dto/bono.dto';
import { BonoEntity } from './bono.entity/bono.entity';
import { BonoService } from './bono.service';

@Controller('bono')
@UseInterceptors(BusinessErrorsInterceptor)
export class BonoController {
    constructor(private readonly bonoService: BonoService) {}

  @Get()
  async findAllBonosByUsuario() {
    return await this.bonoService.findAll();
  }

  @Get()
  async findBonoByCodigo() {
    return await this.bonoService.findAll();
  }

  @Post()
  async crearBono() {
    return await this.bonoService.findAll();
  }

  @Put()
  async deleteBono() {
    return await this.bonoService.findAll();
  }
}
