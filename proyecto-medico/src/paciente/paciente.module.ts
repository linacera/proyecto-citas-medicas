import { Module } from '@nestjs/common';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { CitaEntity } from '../cita/cita.entity';
import { CitaService } from '../cita/cita.service';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { UsuarioService } from '../usuario/usuario.service';

@Module({
  imports: [TypeOrmModule
    .forFeature([
        PacienteEntity,
        CitaEntity,
        UsuarioEntity,
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
      CitaService,
      UsuarioService,
    ],
    exports: [
      PacienteService,


]}
)
export class PacienteModule {

}