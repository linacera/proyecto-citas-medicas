import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitaEntity } from './cita.entity';
import { CitaService } from './cita.service';
import { CitaController } from './cita.controller';
import { PacienteEntity } from '../paciente/paciente.entity';
import { PacienteService } from '../paciente/paciente.service';
import { DoctorService } from '../doctor/doctor.service';
import { DoctorEntity } from '../doctor/doctor.entity';

@Module(
  {
    imports: [TypeOrmModule
      .forFeature([
          CitaEntity,
          PacienteEntity,
          DoctorEntity,
          // Entidades a usarse dentro
          // del modulo.
        ],
        'default' // Nombre de la cadena de conex.
      ),
    ],
    controllers: [
      CitaController,
    ],
    providers: [
      CitaService,
      PacienteService,
      DoctorService,
    ],
    exports: [
      CitaService,


    ]}
)
export class CitaModule {

}