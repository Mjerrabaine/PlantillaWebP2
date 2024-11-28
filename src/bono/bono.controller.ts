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
    return await this.propuestaService.findAll();
  }

  @Get()
  async findBonoByCodigo() {
    return await this.propuestaService.findAll();
  }

  @Post()
  async crearBono() {
    return await this.propuestaService.findAll();
  }

  @Put()
  async deleteBono() {
    return await this.propuestaService.findAll();
  }
/*
  @Get(':museumId')
  async findOne(@Param('museumId') museumId: string) {
    return await this.museumService.findOne(museumId);
  }

  @Post()
  async create(@Body() museumDto: MuseumDto) {
    const museum: MuseumEntity = plainToInstance(MuseumEntity, museumDto);
    return await this.museumService.create(museum);
  }

  @Put(':museumId')
  async update(@Param('museumId') museumId: string, @Body() museumDto: MuseumDto) {
    const museum: MuseumEntity = plainToInstance(MuseumEntity, museumDto);
    return await this.museumService.update(museumId, museum);
  }

  @Delete(':museumId')
  @HttpCode(204)
  async delete(@Param('museumId') museumId: string) {
    return await this.museumService.delete(museumId);
  }
    */
}
