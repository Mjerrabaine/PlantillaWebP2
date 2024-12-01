import { Column, Entity, PrimaryGeneratedColumn ,OneToMany} from 'typeorm';
import { BonoEntity } from "../../bono/bono.entity/bono.entity";
import { ClaseEntity } from "../../clase/clase.entity/clase.entity";


@Entity()
export class UsuarioEntity {
 @PrimaryGeneratedColumn('increment')
 id: number;

 @Column({ type: 'varchar', length: 100 })
 nombre: string;

 @Column({
  type: 'text', 
  })
  rol: 'Profesor' | 'Decana'; 

 @Column({ type: 'varchar', length: 100 })
 grupoInvestigacion: string;

 @Column({ type: 'int'})
 cedula: number;

 @Column({ type: 'int'})
 numeroExtension: number;

 //@Column()
 //jefe: UsuarioEntity;

 @OneToMany(() => ClaseEntity, clase => clase.usuario)
 clases: ClaseEntity[];

 @OneToMany(() => BonoEntity, bono => bono.usuario)
 bonos: BonoEntity[];
}

