import {IsNotEmpty, IsString,IsNumber, IsUrl} from 'class-validator';
export class BonoDto {

 @IsString()
 @IsNotEmpty()
 readonly palabraClave: string;
 
 @IsNumber()
 @IsNotEmpty()
 readonly monto: number;

 @IsNumber()
 @IsNotEmpty()
 readonly calificacion: number;

}