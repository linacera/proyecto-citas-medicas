import { Module } from '@nestjs/common';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';

@Module({
  imports: [TypeOrmModule
    .forFeature([
        PacienteEntity,
        // Entidades a usarse dentro
        // del modulo.
      ],
      'default' // Nombre de la cadena de conex.
    ),
  ],
    controllers: [
      PacienteController,
    ],
    providers: [
      PacienteService,
    ],
    exports: [
      PacienteService,


]}
)
export class PacienteModule {

}