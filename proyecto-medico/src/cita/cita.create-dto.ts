import { IsISO8601, IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';
import { DoctorEntity } from '../doctor/doctor.entity';
import { PacienteEntity } from '../paciente/paciente.entity';

export class CitaCreateDto {

  @IsNotEmpty()
  @IsISO8601()
  fechaCita: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(1,3)
  consultorio: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 9)
  estado: string;

  @IsNotEmpty()
  doctor: DoctorEntity;

  @IsNotEmpty()
  paciente: PacienteEntity;

}