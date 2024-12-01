import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { UsuarioDto } from './usuario.dto/usuario.dto';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Get(':usuarioId')
    async findOne(@Param('usuarioId') usuarioId: number) {
      return await this.usuarioService.findUsuarioById(usuarioId);
    }
  
    @Post()
    async create(@Body() usuarioDto: UsuarioDto) {
      const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
      return await this.usuarioService.crearUsuario(usuario);
    }
  
    @Delete(':usuarioId')
    @HttpCode(204)
    async delete(@Param('usuarioId') usuarioId: number) {
      return await this.usuarioService.eliminarUsuario(usuarioId);
    }
}
