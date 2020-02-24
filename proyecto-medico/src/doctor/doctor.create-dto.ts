import { IsISO8601, IsNotEmpty, IsNumberString, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { UsuarioEntity } from '../usuario/usuario.entity';

export class DoctorCreateDto{

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  apellido: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  especialidad: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  direccion: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(10,10)
  telefono: string;


}
