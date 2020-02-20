import { Body, Controller, Get, Post, Query, Res, Session } from '@nestjs/common';
import { PacienteService } from '../paciente/paciente.service';
import { DoctorService } from './doctor.service';
import { Like } from 'typeorm';
import { DoctorCreateDto } from './doctor.create-dto';
import { DoctorEntity } from './doctor.entity';
import { validate } from 'class-validator';


@Controller()
export class DoctorController {

  constructor(
    private readonly _doctorService: DoctorService,
  ){

  }

  @Get('mostrar-doctores')
  async rutaMostrarDoctors(
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Query('error') error: string,
    @Query('consultaDoctor') consultaDoctor: string,
  ) {
    let consultaServicio;
    if (consultaDoctor) {
      consultaServicio = [
        {
          nombre: Like('%' + consultaDoctor + '%'),
        },
        {
          apellido: Like('%' + consultaDoctor + '%'),
        },
        {
          fechaDeNacimiemto: Like('%' + consultaDoctor + '%'),
        },
        {
          telefono: Like('%' + consultaDoctor + '%'),
        },
        {
          direccion: Like('%' + consultaDoctor + '%'),
        },
      ];
    }
    const doctores = await this._doctorService.buscar(consultaServicio);
    res.render('doctor/mostrar-doctores',
      {
        datos: {
          error,
          mensaje,
          doctores, // es igual a doctores:doctores
        },
      },

    );
  }

  @Post('crear')
  async crearUnDoctor(
    @Body() doctor: DoctorEntity,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    const doctorCreateDTO = new DoctorCreateDto();
    doctorCreateDTO.nombre = doctor.nombre;
    doctorCreateDTO.apellido = doctor.apellido;
    doctorCreateDTO.telefono = doctor.telefono;
    doctorCreateDTO.direccion = doctor.direccion;
    doctorCreateDTO.especialidad = doctor.especialidad;
    const errores = await validate(doctorCreateDTO);
    if (errores.length > 0) {

      res.redirect(
        '/doctor/create-doctor?error=Error validando',
      );
    } else {
      try {
        await this._doctorService
          .crearUno(
            doctor,
          );
        res.redirect(
          '/doctor/create-doctor?mensaje=El usuario se creo correctamente',
        );
      } catch (error) {
        console.error(error);
        res.redirect(
          '/doctor/create-doctor?error=Error del servidor',
        );
      }
    }
  }

  @Get('crear-doctor')
  rutaCrearDoctors(
    @Query('error') error: string,
    @Query('mensaje') mensaje: string,
    @Res() res,
  ) {
    res.render('doctor/create-doctor',
      {
        datos: {
          error,
          mensaje,
        },
      },
    );
  }






}