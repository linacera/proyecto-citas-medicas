import { Body, Controller, Get, Post, Query, Res, Session } from '@nestjs/common';
import { CitaService } from './cita.service';
import { async } from 'rxjs/internal/scheduler/async';

import { validate } from 'class-validator';
import { CitaEntity } from './cita.entity';
import { CitaCreateDto } from './cita.create-dto';
import { DoctorService } from '../doctor/doctor.service';
import { PacienteService } from '../paciente/paciente.service';
import { Like } from 'typeorm';

@Controller('cita')
export class CitaController {

  constructor(
    private readonly _citaService: CitaService, private _doctorService: DoctorService, private _pacienteService: PacienteService,
  ) {
  }

  @Post('crear-cita')
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
  async buscarCitas(
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Query('error') error: string,
    @Query('consultaCita') consultaCita: string,
  ){
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
}