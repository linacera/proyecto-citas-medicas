import { IsISO8601, IsNotEmpty, IsString, Length } from 'class-validator';

export class HistorialCreateDto {

  @IsNotEmpty()
  @IsISO8601()
  fechaCreacion: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  estado: string;



}