
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
import { HistorialModule } from './historial/historial.module';
import { DetalleHistorialModule } from './detalle-historial/detalle-historial.module';
import { HistorialEntity } from './historial/historial.entity';
import { DetalleHistorialEntity } from './detalle-historial/detalle-historial.entity';


@Module({
  imports: [
    CitaModule,
    PacienteModule,
    DoctorModule,
    HistorialModule,
    DetalleHistorialModule,
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
          HistorialEntity,
          DetalleHistorialEntity,
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






