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
    const usuario = await this.usuarioRepository.findOne({where:  { id: userId } , relations: ['bonos','clases'] } );
    if (!usuario)
        throw new BusinessLogicException("The usuario with the given id de clase was not found", BusinessError.NOT_FOUND);

       return usuario.bonos;
    }

   async findBonoByCodigo(codigoClase: string): Promise<BonoEntity> {
       const bono = await this.bonoRepository.findOne({where: { clase: { codigo: codigoClase } }, relations: ['usuario','clase'] } );
       if (!bono)
         throw new BusinessLogicException("The bono with the given codigo de clase was not found", BusinessError.NOT_FOUND);
  
       return bono;
   }
  
   async crearBono(bono: BonoEntity ): Promise<BonoEntity> {
        console.log('Received Bono:', bono);

        if (bono.monto === undefined || bono.monto === null || bono.monto<0) {
            throw new BusinessLogicException("The bono must have a positive monto that is not empty", BusinessError.BAD_REQUEST);

        }
        const usuario = await this.usuarioRepository.findOne({
            where: { id: bono.usuario.id },
        });
       
        if (!usuario) {
            throw new BusinessLogicException(
                'The usuario associated with the bono was not found',
                BusinessError.NOT_FOUND,
            );
        }
    
        if (usuario.rol !== 'Profesor') {
            throw new BusinessLogicException(
                'The bono must be associated with a usuario that has the role of Profesor',
                BusinessError.BAD_REQUEST,
            );
        }

        console.log('Creating Bono...');
        const newBono = this.bonoRepository.create(bono);
        return await this.bonoRepository.save(newBono);
    }

    async deleteBono(id: number) {
        const bono = await this.bonoRepository.findOne({where: {id}, relations: ['clase','usuario'] } );

        if (bono.calificacion>4)
            throw new BusinessLogicException("The bono can not be deleted it has a grade above 4", BusinessError.BAD_REQUEST);

        await this.bonoRepository.remove(bono);
    }

}