import { Body, Controller, Get, Post, Query, Res, Session } from '@nestjs/common';
import { CitaService } from './cita.service';
import { async } from 'rxjs/internal/scheduler/async';

import { validate } from 'class-validator';
import { CitaEntity } from './cita.entity';
import { CitaCreateDto } from './cita.create-dto';

@Controller()
export class CitaController {

  constructor(
    private readonly _citaService: CitaService,
  ){
  }

  @Post('crear')
  async crearUnCita(
    @Body() cita: CitaEntity,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    const citaCreateDTO = new CitaCreateDto();
    citaCreateDTO.estado = cita.estado;
    citaCreateDTO.fechaCita = cita.fechaCita;
    citaCreateDTO.consultorio = cita.consultorio;

    const errores = await validate(citaCreateDTO);
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

}
