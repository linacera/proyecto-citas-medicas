import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorEntity } from './doctor.entity';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';

Module({
  imports: [TypeOrmModule
    .forFeature([
        DoctorEntity, // Entidades a usarse dentro
        // del modulo.
      ],
      'default' // Nombre de la cadena de conex.
    ),
  ],
  controllers: [
    DoctorController,
  ],
  providers: [
    DoctorService,
  ],
  exports: [
    DoctorService,
  ]}
);
export class DoctorModule {

}