import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitaEntity } from './cita.entity';
import { CitaService } from './cita.service';
import { CitaController } from './cita.controller';

@Module(
  {
    imports: [TypeOrmModule
      .forFeature([
          CitaEntity,
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
    ],
    exports: [
      CitaService,


    ]}
)
export class CitaModule {

}