import { Column, Entity, PrimaryGeneratedColumn ,ManyToOne} from 'typeorm';
import { ClaseEntity } from "../../clase/clase.entity/clase.entity";
import { UsuarioEntity } from "../../usuario/usuario.entity/usuario.entity";

@Entity()
export class BonoEntity {
 @PrimaryGeneratedColumn('increment')
 id: number;

 @Column({ type: 'varchar', length: 100 })
 palabraClave: string;
 
 @Column({ type: 'double precision'})
 calificacion: number;

 @Column({ type: 'int'})
 monto: number;

 @ManyToOne(() => UsuarioEntity, usuario => usuario.bonos)
 usuario: UsuarioEntity;

 @ManyToOne(() => ClaseEntity, clase => clase.bonos)
 clase: ClaseEntity;
}