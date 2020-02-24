import { Body, Controller, Get, Param, Post, Query, Res, Session, SetMetadata, UseGuards } from '@nestjs/common';
import { DoctorEntity } from './doctor.entity';
import { DoctorCreateDto } from './doctor.create-dto';
import { validate } from 'class-validator';
import { DoctorService } from './doctor.service';
import { getRepository, Like } from 'typeorm';
import { DoctorUpdateDto } from './doctor.update-dto';
import { CitaService } from '../cita/cita.service';
import { UsuarioService } from '../usuario/usuario.service';
import { RolesGuard } from '../roles.guard';

@Controller('doctor')
@UseGuards(RolesGuard)
export class DoctorController {
  constructor(
    private readonly _doctorService: DoctorService, private _citaService : CitaService, private _usuarioService: UsuarioService,
  ){

  }

  @Get('holi')
  async holi(){
    console.log('holi')
  }

  @Get('mostrar-doctores')
  @SetMetadata('roles', ['administrador'])
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
  @SetMetadata('roles', ['administrador'])
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
        doctor.usuario = await this._usuarioService.crearUsuario(doctor.nombre,doctor.apellido,'doctor');
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
  @SetMetadata('roles', ['administrador'])
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
  @SetMetadata('roles', ['administrador'])
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
  @SetMetadata('roles', ['administrador'])
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
  @SetMetadata('roles', ['administrador'])
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

  @Get('mostrar-mis-citas/:id')
  @SetMetadata('roles', ['doctor'])
  async mostarMisCitas(
    @Query('error') error: string,
    @Query('mensaje') mensaje: string,
    @Param('id') idUsuario: string,
    @Res() res,
  ){
   const doctor = await this._doctorService.encontarDoctorPorUserId(+idUsuario);
   const  doctorConRelaciones = await this._doctorService.encontrarCitasDeDoctor(doctor.id);
   const citasSinRelaciones = doctorConRelaciones.citas;
   const citas =  await this._citaService.buscarRelacionesDeCitas(citasSinRelaciones);
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
