import { Column, Entity, PrimaryGeneratedColumn ,ManyToOne,OneToMany} from 'typeorm';
import { BonoEntity } from "../../bono/bono.entity/bono.entity";
import { UsuarioEntity } from "../../usuario/usuario.entity/usuario.entity";

@Entity()
export class ClaseEntity {
 @PrimaryGeneratedColumn('increment')
 id: number;

 @Column({ type: 'varchar', length: 100 })
 nombre: string;

 @Column({ type: 'varchar', length: 100 })
 codigo: string;

 @Column({ type: 'int'})
 numCreditos: number;

 @ManyToOne(() => UsuarioEntity, usuario => usuario.clases)
 usuario: UsuarioEntity;


 @OneToMany(() => BonoEntity, bono => bono.clase)
 bonos: BonoEntity[];
}