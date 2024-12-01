import {IsNotEmpty, IsString,IsNumber, IsUrl,Length,IsInt} from 'class-validator';
export class ClaseDto {

    @IsString()
    @Length(1, 100)
    @IsNotEmpty()
    nombre: string;
  
    @IsString()
    @Length(10, 10)
    @IsNotEmpty()
    codigo: string;
  
    @IsInt()
    @IsNotEmpty()
    numCreditos: number;
  
    @IsInt()
    @IsNotEmpty()
    usuarioId: number; 

    @IsNotEmpty()
    readonly usuario: { id: number };

}