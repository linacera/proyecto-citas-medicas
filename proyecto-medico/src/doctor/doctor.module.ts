import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorEntity } from './doctor.entity';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { CitaService } from '../cita/cita.service';
import { CitaEntity } from '../cita/cita.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { UsuarioService } from '../usuario/usuario.service';

@Module(
  {
    imports: [TypeOrmModule
      .forFeature([
          DoctorEntity,
          CitaEntity,
          UsuarioEntity,
        ],
        'default' // Nombre de la cadena de conex.
      ),
    ],
    controllers: [
      DoctorController,
    ],
    providers: [
      DoctorService,
      CitaService,
      UsuarioService,
    ],
    exports: [
      DoctorService,
    ]}
)
export class DoctorModule {

}
