import { Body, Controller, Get, Param, Post, Query, Res, Session, SetMetadata, UseGuards } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { Like } from 'typeorm';
import { validate } from 'class-validator';
import { PacienteEntity } from './paciente.entity';
import { PacienteCreateDto } from './paciente.create-dto';
import { CitaService } from '../cita/cita.service';
import { UsuarioService } from '../usuario/usuario.service';
import { RolesGuard } from '../roles.guard';


@Controller('paciente')
@UseGuards(RolesGuard)
export class PacienteController {

  constructor(
    private readonly _pacienteService: PacienteService, private _citaService: CitaService, private _usuarioService: UsuarioService,
  ){}
  @Get('mostrar-pacientes')
  @SetMetadata('roles', ['administrador'])
  async rutaMostrarPacientes(
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Query('error') error: string,
    @Query('consultaPaciente') consultaPaciente: string,
  ) {
    let consultaServicio;
    if (consultaPaciente) {
      consultaServicio = [
        {
          nombre: Like('%' + consultaPaciente + '%'),
        },
        {
          apellido: Like('%' + consultaPaciente + '%'),
        },
        {
          fechaDeNacimiento: Like('%' + consultaPaciente + '%'),
        },
        {
          telefono: Like('%' + consultaPaciente + '%'),
        },
        {
          direccion: Like('%' + consultaPaciente + '%'),
        },
      ];
    }
    const pacientes = await this._pacienteService.buscar(consultaServicio);
    res.render('paciente/mostrar-pacientes',
      {
        datos: {
          error,
          mensaje,
          pacientes, // es igual a pacientes:pacientes
        },
      },

    );
  }

  @Post('crear')
  @SetMetadata('roles', ['administrador'])
  async crearUnPaciente(
    @Body() paciente: PacienteEntity,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    const pacienteCreateDTO = new PacienteCreateDto();
    pacienteCreateDTO.nombre = paciente.nombre;
    pacienteCreateDTO.apellido = paciente.apellido;
    pacienteCreateDTO.telefono = paciente.telefono;
    pacienteCreateDTO.direccion = paciente.direccion;
    pacienteCreateDTO.fechaDeNacimiento = paciente.fechaDeNacimiento;
    const errores = await validate(pacienteCreateDTO);
    if (errores.length > 0) {

      res.redirect(
        '/paciente/crear-paciente?error=Error validando',
      );
    } else {
      try {
        paciente.usuario = await this._usuarioService.crearUsuario(paciente.nombre,paciente.apellido,'paciente');
        await this._pacienteService
          .crearUno(
            paciente,
          );
        res.redirect(
          '/paciente/crear-paciente?mensaje=El paciente se creó correctamente',
        );
      } catch (error) {
        console.error(error);
        res.redirect(
          '/paciente/crear-paciente?error=Error del servidor',
        );
      }
    }
  }

  @Get('crear-paciente')
  @SetMetadata('roles', ['administrador'])
  rutaCrearPacientes(
    @Query('error') error: string,
    @Query('mensaje') mensaje: string,
    @Res() res,
  ) {
    res.render('paciente/crear-paciente',
      {
        datos: {
          error,
          mensaje,
        },
      },
    );
  }

  @Get('editar-paciente/:idPaciente')
  @SetMetadata('roles', ['administrador'])
  async rutaEditarPacientes(
    @Query('error') error: string,
    @Param('idPaciente') idPaciente: string,
    @Res() res,
  ) {
    const consulta = {
      where: {
        id: idPaciente,
      },
    };
    console.log(consulta)
    try {
      const arregloPacientes = await this._pacienteService.encontrarUno(+idPaciente);
      if (arregloPacientes) {
        res.render(
          'paciente/crear-paciente',
          {
            datos: {error, paciente: arregloPacientes,
            },
          },
        );
      }else{
        res.redirect(
          '/paciente/mostrar-pacientes?error=NO existe este paciente',
        );
      }
    } catch (error) {
      console.log(error);
      res.redirect(
        '/paciente/mostrar-pacientes?error=Error editando paciente'
      )
    }

  }


  @Post(':id')
  @SetMetadata('roles', ['administrador'])
  async actualizarUnPaciente(
    @Body() paciente: PacienteEntity,
    @Param('id') id: string,
    @Res() res,
  ): Promise<void> {
    const pacienteUpdateDTO = new PacienteCreateDto();
    pacienteUpdateDTO.nombre = paciente.nombre;
    pacienteUpdateDTO.apellido = paciente.apellido;
    pacienteUpdateDTO.fechaDeNacimiento = paciente.fechaDeNacimiento;
    pacienteUpdateDTO.direccion = paciente.direccion;
    pacienteUpdateDTO.telefono = paciente.telefono;
    const errores = await validate(pacienteUpdateDTO);
    if (errores.length > 0) {
      res.redirect(
        '/paciente/editar-paciente/' + id + '?error=Paciente no validado',
      );
      console.log(errores)
    } else {
      await this._pacienteService
        .actualizarUno(
          +id,
          paciente,
        );
      res.redirect(
        '/paciente/mostrar-pacientes?mensaje=El paciente ' + paciente.nombre + ' actualizado',
      );
    }

  }

  @Post('delete/:id')
  async eliminarUnoPost(
    @Param('id') id: string,
    @Res() res,
  ): Promise<void> {
    try {
      await this._pacienteService
        .borrarUno(
          +id,
        );
      res.redirect(`/paciente/mostrar-pacientes?mensaje=Paciente ID: ${id} eliminado`);
    } catch (error) {
      console.error(error);
      res.redirect('/paciente/mostrar-pacientes?error=Error del servidor');
    }
  }

  @Get('mostrar-mis-citas/:id')
  @SetMetadata('roles', ['paciente'])
  async mostarMisCitas(
    @Query('error') error: string,
    @Query('mensaje') mensaje: string,
    @Param('id') idUsuario: string,
    @Res() res,
  ){
    const paciente = await this._pacienteService.encontarPacientePorUserId(+idUsuario);
    const  pacienteConRelaciones = await this._pacienteService.encontrarCitasDePaciente(paciente.id);
    const citasSinRelaciones = pacienteConRelaciones.citas;
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
