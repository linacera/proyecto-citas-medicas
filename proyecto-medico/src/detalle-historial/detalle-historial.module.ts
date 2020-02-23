import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleHistorialEntity } from './detalle-historial.entity';
import { DetalleHistorialController } from './detalle-historial.controller';
import { DetalleHistorialService } from './detalle-historial.service';
import { PacienteService } from '../paciente/paciente.service';
import { DoctorService } from '../doctor/doctor.service';
import { HistorialService } from '../historial/historial.service';
import { PacienteEntity } from '../paciente/paciente.entity';
import { DoctorEntity } from '../doctor/doctor.entity';
import { HistorialEntity } from '../historial/historial.entity';

@Module(
  {
    imports: [TypeOrmModule
      .forFeature([
          DetalleHistorialEntity,
          PacienteEntity,
          DoctorEntity,
          HistorialEntity,
        ],
        'default' // Nombre de la cadena de conex.
      ),
    ],
    controllers: [
      DetalleHistorialController,
    ],
    providers: [
      DetalleHistorialService,
      PacienteService,
      DoctorService,
      HistorialService,
    ],
    exports: [
      DetalleHistorialService,
    ]}
)

export class DetalleHistorialModule {

}
