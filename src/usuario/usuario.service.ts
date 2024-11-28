import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity/usuario.entity';

@Injectable()
export class UsuarioService 
{
   constructor(
       @InjectRepository(UsuarioEntity)
       private readonly usuarioRepository: Repository<UsuarioEntity>,

   ){}

   async findUsuarioById(id: number): Promise<UsuarioEntity> {
       const usuario = await this.usuarioRepository.findOne({where: {id}, relations: ['bonos','clases'] } );
       if (!usuario)
         throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND);
  
       return usuario;
   }
  
   async crearUsuario(usuario: UsuarioEntity ): Promise<UsuarioEntity> {
        const validGroups = ["TICSW", "IMAGINE", "COMIT"];
        const numeroString = new String(usuario.numeroExtension);
        if (!validGroups.includes(usuario.grupoInvestigacion) && usuario.rol==='Profesor') {
            throw new BusinessLogicException("The user profesor does nto belong to a valid grupo de Investigacion", BusinessError.BAD_REQUEST);

        }
        else if (numeroString.length===8 && usuario.rol==='Decana') {
            throw new BusinessLogicException("The user profesor does nto belong to a valid grupo de Investigacion", BusinessError.BAD_REQUEST);

        }
        const newUsuario = this.usuarioRepository.create(usuario);
        return await this.usuarioRepository.save(newUsuario);
    }

    async eliminarUsuario(id: number) {
        const usuario = await this.usuarioRepository.findOne({where: {id}, relations: ['bonos','clases'] } );

        if (!usuario)
            throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND);

        if (usuario.bonos)
            throw new BusinessLogicException("The usuario with the given id has bonos and can not be deleted", BusinessError.BAD_REQUEST);

        if (usuario.rol==='Decana')
          throw new BusinessLogicException("The profesor with the given id is Decana and can not be deleted", BusinessError.NOT_FOUND);
     
        await this.usuarioRepository.remove(usuario);
    }
}