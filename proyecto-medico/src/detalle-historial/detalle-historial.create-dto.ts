import { IsISO8601, IsNotEmpty, IsString, Length } from 'class-validator';
import { DoctorEntity } from '../doctor/doctor.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import { HistorialEntity } from '../historial/historial.entity';

export class DetalleHistorialCreateDto {

  @IsNotEmpty()
  @IsISO8601()
  fechaHistorial: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  sintomas: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  signosVitales: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  alergias: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  antecedentesFamiliares: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  diagnostico: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  medicamentos: string;

  @IsNotEmpty()
  doctor: DoctorEntity;

  @IsNotEmpty()
  historial: HistorialEntity;


}