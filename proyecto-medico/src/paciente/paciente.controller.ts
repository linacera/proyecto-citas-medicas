import { Body, Controller, Get, Param, Post, Query, Res, Session } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { Like } from 'typeorm';
import { validate } from 'class-validator';
import { PacienteEntity } from './paciente.entity';
import { PacienteCreateDto } from './paciente.create-dto';


@Controller('paciente')
export class PacienteController {

  constructor(
    private readonly _pacienteService: PacienteService,
  ){}

  @Get('holi')
  holi(){
    console.log('holi paciente')
  }

  @Get('mostrar-pacientes')
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
      console.log(consulta.where.id)
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


}
