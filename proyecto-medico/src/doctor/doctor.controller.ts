import { Body, Controller, Get, Param, Post, Query, Res, Session } from '@nestjs/common';
import { DoctorEntity } from './doctor.entity';
import { DoctorCreateDto } from './doctor.create-dto';
import { validate } from 'class-validator';
import { DoctorService } from './doctor.service';
import { Like } from 'typeorm';
import { DoctorUpdateDto } from './doctor.update-dto';

@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly _doctorService: DoctorService,
  ){

  }

  @Get('holi')
  async holi(){
    console.log('holi')
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
          especialidad: Like('%' + consultaDoctor + '%'),
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
        '/doctor/crear-doctor?error=Error validando',
      );
    } else {
      try {
        await this._doctorService
          .crearUno(
            doctor,
          );
        res.redirect(
          '/doctor/crear-doctor?mensaje=El doctor se creó correctamente',
        );
      } catch (error) {
        console.error(error);
        res.redirect(
          '/doctor/crear-doctor?error=Error del servidor',
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
    res.render('doctor/crear-doctor',
      {
        datos: {
          error,
          mensaje,
        },
      },
    );
  }

  @Get('editar-doctor/:idDoctor')

  async rutaEditarDoctors(
    @Query('error') error: string,
    @Param('idDoctor') idDoctor: string,
    @Res() res,
  ) {
    const consulta = {
      where: {
        id: idDoctor,
      },
    };
    console.log(consulta)
    try {
      const arregloDoctors = await this._doctorService.encontrarUno(+idDoctor);
      console.log(consulta.where.id)
      if (arregloDoctors) {
        res.render(
          'doctor/crear-doctor',
          {
            datos: {error, doctor: arregloDoctors,
            },
          },
        );
      }else{
        res.redirect(
          '/doctor/mostrar-doctors?error=NO existe este doctor',
        );
      }
    } catch (error) {
      console.log(error);
      res.redirect(
        '/doctor/mostrar-doctors?error=Error editando doctor'
      )
    }

  }


  @Post(':id')
  async actualizarUnDoctor(
    @Body() doctor: DoctorEntity,
    @Param('id') id: string,
    @Res() res,
  ): Promise<void> {
    const doctorUpdateDTO = new DoctorUpdateDto();
    doctorUpdateDTO.nombre = doctor.nombre;
    doctorUpdateDTO.apellido = doctor.apellido;
    doctorUpdateDTO.especialidad = doctor.especialidad;
    doctorUpdateDTO.direccion = doctor.direccion;
    doctorUpdateDTO.telefono = doctor.telefono;
    const errores = await validate(doctorUpdateDTO);
    if (errores.length > 0) {
      res.redirect(
        '/doctor/editar-doctor/' + id + '?error=Doctor no validado',
      );
      console.log(errores)
    } else {
      await this._doctorService
        .actualizarUno(
          +id,
          doctor,
        );
      res.redirect(
        '/doctor/mostrar-doctores?mensaje=El doctor ' + doctor.nombre + ' actualizado',
      );
    }

  }

  @Post('delete/:id')
  async eliminarUnoPost(
    @Param('id') id: string,
    @Res() res,
  ): Promise<void> {
    try {
      await this._doctorService
        .borrarUno(
          +id,
        );
      res.redirect(`/doctor/mostrar-doctores?mensaje=Doctor ID: ${id} eliminado`);
    } catch (error) {
      console.error(error);
      res.redirect('/doctor/mostrar-doctores?error=Error del servidor');
    }
  }


}
