import {IsNotEmpty, IsString,IsNumber, IsUrl, Length, Min,IsInt,IsEnum} from 'class-validator';

export enum Rol {
    PROFESOR = 'Profesor',
    DECANA = 'Decana',
  }

export class UsuarioDto {

    @IsString()
    @Length(1, 100)
    @IsNotEmpty()
    nombre: string;
  
    @IsEnum(Rol)
    @IsNotEmpty()
    rol: Rol;
  
    @IsString()
    @Length(1, 100)
    @IsNotEmpty()
    grupoInvestigacion: string;
  
    @IsInt()
    @IsNotEmpty()
    cedula: number;
  
    @IsInt()
    @IsNotEmpty()
    numeroExtension: number;

}