import { Body, Controller, Get, Param, Post, Query, Res, Session, SetMetadata, UseGuards } from '@nestjs/common';
import { CitaService } from './cita.service';
import { async } from 'rxjs/internal/scheduler/async';

import { validate } from 'class-validator';
import { CitaEntity } from './cita.entity';
import { CitaCreateDto } from './cita.create-dto';
import { DoctorService } from '../doctor/doctor.service';
import { PacienteService } from '../paciente/paciente.service';
import { Like } from 'typeorm';
import { RolesGuard } from '../roles.guard';

@Controller('cita')
@UseGuards(RolesGuard)
export class CitaController {

  constructor(
    private readonly _citaService: CitaService, private _doctorService: DoctorService, private _pacienteService: PacienteService,
  ) {
  }

  @Post('crear-cita')
  @SetMetadata('roles', ['administrador','doctor'])
  async crearUnCita(
    @Body() cita: CitaEntity,
    @Res() res,
    @Body() bodyParams,
    @Session() session,
  ): Promise<void> {
    try {
      const citaCreateDTO = new CitaCreateDto();
      const doctor = await this._doctorService.encontrarUno(+bodyParams.idDoctor);
      const paciente = await this._pacienteService.encontrarUno(+bodyParams.idPaciente);
      citaCreateDTO.estado = cita.estado;
      citaCreateDTO.fechaCita = cita.fechaCita;
      citaCreateDTO.consultorio = cita.consultorio;
      cita.doctor = doctor;
      cita.paciente = paciente;
      citaCreateDTO.doctor = cita.doctor;
      citaCreateDTO.paciente = cita.paciente;
      const errores = await validate(citaCreateDTO);
      console.log(errores);
      if (errores.length > 0) {
        res.redirect(
          '/cita/crear-cita?error=Error validando',
        );
      } else {
        try {
          await this._citaService
            .crearUno(
              cita,
            );
          res.redirect(
            '/cita/crear-cita?mensaje=El cita se creó correctamente',
          );
        } catch (error) {
          console.error(error);
          res.redirect(
            '/cita/crear-cita?error=Error del servidor',
          );
        }
      }
    } catch (e) {
      res.redirect(
        '/cita/crear-cita?error=Error del servidor',
      );
    }

  }

  @Get('crear-cita')
  @SetMetadata('roles', ['administrador','doctor'])
  rutaCrearCitas(
    @Query('error') error: string,
    @Query('mensaje') mensaje: string,
    @Res() res,
  ) {
    res.render('cita/crear-cita',
      {
        datos: {
          error,
          mensaje,
        },
      },
    );
  }

  @Get('buscar-citas')
  @SetMetadata('roles', ['administrador','doctor'])
  async buscarCitas(
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Query('error') error: string,
    @Query('consultaCita') consultaCita: string,
  ) {
    let consultaServicio;
    if (consultaCita) {
      consultaServicio = [
        {
          estado: Like('%' + consultaCita + '%'),
        },
        {
          fechaCita: Like('%' + consultaCita + '%'),
        },
        {
          consultorio: Like('%' + consultaCita + '%'),
        },
      ];
    }
    const citasMatch = await this._citaService.buscar(consultaServicio);
    const citas = await this._citaService.buscarRelacionesDeCitas(citasMatch);
    res.render('cita/mostrar-citas',
      {
        datos: {
          error,
          mensaje,
          citas, // es igual a citas:citas
        },
      },
    );
  }

  @Get('mostrar-citas')
  @SetMetadata('roles', ['administrador'])
  async rutaMostrarCitas(
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Query('error') error: string,
  ) {
    const citas = await this._citaService.buscarCitasConRelaciones();
    res.render('cita/mostrar-citas',
      {
        datos: {
          error,
          mensaje,
          citas, // es igual a citas:citas
        },
      },
    );

  }

  @Post('cancelar-cita/:idCita/:idDoctor')
  @SetMetadata('roles', ['doctor', 'paciente'])
  async cancelarCita(
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Query('error') error: string,
    @Param('idCita') idCita: string,
    @Param('idDoctor') idDoctor: string,
    @Session() session,
  ) {
    try {
      if (await this.cambiarEstadoDeCita(+idCita, 'Cancelado')) {
        res.redirect('/doctor/mostrar-mis-citas/' + idDoctor + '?mensaje=Cita cancelada');
      } else {
        res.redirect('/doctor/mostrar-mis-citas/' + idDoctor + '?error=No se puede actualizar la cita porque ya fue realizada o cancelada');
      }

    } catch (e) {
      res.redirect('/doctor/mostrar-mis-citas/' + idDoctor + '?error=Error en el servidor');
    }
  }

  @Post('cita-realizada/:idCita/:idDoctor')
  @SetMetadata('roles', ['doctor'])
  async citaRealizada(
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Query('error') error: string,
    @Param('idCita') idCita: string,
    @Param('idDoctor') idDoctor: string,
    @Session() session,
  ) {
    try {
      if ( await this.cambiarEstadoDeCita(+idCita, 'Realizado')) {
        res.redirect('/doctor/mostrar-mis-citas/' + idDoctor + '?mensaje=Cita realizada');
      } else {
        res.redirect('/doctor/mostrar-mis-citas/' + idDoctor + '?error=No se puede actualizar la cita porque ya fue cancelada o realizada');
      }
    } catch (e) {
      res.redirect('/doctor/mostrar-mis-citas/' + idDoctor + '?error=Error en el servidor');
    }
  }

  async cambiarEstadoDeCita(idCita: number, estado: string) {
    const cita = await this._citaService.encontrarUno(idCita);
    if(estado === 'Realizado' && cita.estado==='Cancelado') {
      return false;
    }
    if(estado === 'Cancelado' && cita.estado==='Realizado') {
      return false;
    }
    if(estado === 'Cancelado' && cita.estado==='Cancelado') {
      return false;
    }
    if(estado === 'Realizado' && cita.estado==='Realizado') {
      return false;
    }
    cita.estado = estado;
    await this._citaService.actualizarUno(idCita,cita);
    return true
  }

}