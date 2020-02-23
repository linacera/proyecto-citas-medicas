import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorEntity } from './doctor.entity';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';

@Module(
  {
    imports: [TypeOrmModule
      .forFeature([
          DoctorEntity,
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
)
export class DoctorModule {

}
