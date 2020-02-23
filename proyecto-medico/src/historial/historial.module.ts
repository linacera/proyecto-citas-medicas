import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialService } from './historial.service';
import { HistorialEntity } from './historial.entity';


@Module(
  {
    imports: [TypeOrmModule
      .forFeature([
          HistorialEntity,
          // Entidades a usarse dentro
          // del modulo.
        ],
        'default' // Nombre de la cadena de conex.
      ),
    ],
    controllers: [
    ],
    providers: [
      HistorialService,
    ],
    exports: [
      HistorialService,
    ]}
)
export class HistorialModule {}
