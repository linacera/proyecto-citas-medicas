import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente/paciente.entity';
import { CitaEntity } from './cita/cita.entity';
import { DoctorEntity } from './doctor/doctor.entity';
import { PacienteModule } from './paciente/paciente.module';
import { CitaModule } from './cita/cita.module';
import { DoctorModule } from './doctor/doctor.module';
import { DoctorService } from './doctor/doctor.service';
import { DoctorController } from './doctor/doctor.controller';

@Module({
  imports: [
    CitaModule,
    PacienteModule,
    DoctorModule,
    TypeOrmModule.forRoot(
      {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'johanna',
        password: 'web2019',
        database: 'proyecto',
        entities: [
          PacienteEntity,
          CitaEntity,
          DoctorEntity,
        ],
        synchronize: true, // Crear -> true , Conectar -> false
        dropSchema: false,
      },
    ),
  ],
  controllers: [AppController,
  ],
  providers: [AppService,
  ],
})
export class AppModule {
  constructor() {}
}






