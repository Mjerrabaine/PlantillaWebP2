import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { BonoEntity } from './bono.entity/bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';

@Injectable()
export class BonoService 
{
   constructor(
       @InjectRepository(BonoEntity)
       private readonly bonoRepository: Repository<BonoEntity>,

       @InjectRepository(UsuarioEntity)
       private readonly usuarioRepository: Repository<UsuarioEntity>,

       @InjectRepository(ClaseEntity)
       private readonly claseRepository: Repository<ClaseEntity>,

   ){}

   async findAllBonosByUsuario(userId:number): Promise<BonoEntity[]> {
    return await this.bonoRepository.find({where: { usuario: { id: userId } }, relations: ['propuesta'] });
    }

   async findBonoByCodigo(codigoClase: string): Promise<BonoEntity> {
       const bono = await this.bonoRepository.findOne({where: { clase: { codigo: codigoClase } }, relations: ['usuario','clase'] } );
       if (!bono)
         throw new BusinessLogicException("The bono with the given codigo de clase was not found", BusinessError.NOT_FOUND);
  
       return bono;
   }
  
   async crearBono(bono: BonoEntity ): Promise<BonoEntity> {
        if (!bono.monto && bono.monto<0) {
            throw new BusinessLogicException("The bono has a nonexistent monto or is negative", BusinessError.BAD_REQUEST);

        }
        const isProfesor= await this.userProfesor(bono.id);

        if (!isProfesor)
            throw new BusinessLogicException("The bono belongs to a profesor user and can not be deleted", BusinessError.NOT_FOUND);
       

        const newBono = this.bonoRepository.create(bono);
        return await this.bonoRepository.save(newBono);
    }

    async deleteBono(id: number) {
        const bono = await this.bonoRepository.findOne({where: {id}, relations: ['clase','usuario'] } );

        if (!(bono.calificacion>4))
            throw new BusinessLogicException("The bono can not be deleted it has a grade above 4", BusinessError.BAD_REQUEST);

        await this.bonoRepository.remove(bono);
    }

    private async userProfesor(bonoId: number): Promise<boolean> {
        const usuario  = await this.usuarioRepository.find({
          where: { bonos: { id: bonoId } },
          relations: ['bonos','clases'], 
        });
        
        return usuario;
      }
}