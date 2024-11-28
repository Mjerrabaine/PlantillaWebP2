import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ClaseEntity } from './clase.entity/clase.entity';

@Injectable()
export class ClaseService 
{
   constructor(
       @InjectRepository(ClaseEntity)
       private readonly claseRepository: Repository<ClaseEntity>,

   ){}

   async findClaseById(id: number): Promise<ClaseEntity> {
       const clase = await this.claseRepository.findOne({where: {id}, relations: ['bonos','usuario'] } );
       if (!clase)
         throw new BusinessLogicException("The clase with the given id was not found", BusinessError.NOT_FOUND);
  
       return clase;
   }
  
   async crearClase(clase: ClaseEntity ): Promise<ClaseEntity> {

        if (clase.codigo.length===10) {
            throw new BusinessLogicException("The code of the class needs to have 10 characters", BusinessError.BAD_REQUEST);

        }

        const newClase = this.claseRepository.create(clase);
        return await this.claseRepository.save(newClase);
    }
}