import { Body, Controller, Get, Param, Post, Query, Res, Session, ValidationError } from '@nestjs/common';
import { DoctorService } from '../doctor/doctor.service';
import { PacienteService } from '../paciente/paciente.service';
import { DetalleHistorialService } from './detalle-historial.service';
import { validate } from 'class-validator';
import { DetalleHistorialEntity } from './detalle-historial.entity';
import { DetalleHistorialCreateDto } from './detalle-historial.create-dto';
import { getRepository } from 'typeorm';
import { HistorialEntity } from '../historial/historial.entity';
import { HistorialService } from '../historial/historial.service';
import { response } from 'express';
import { empty } from 'rxjs/internal/Observer';


@Controller('detalle')
export class DetalleHistorialController {

  constructor(
    private readonly _detalleHistorialService: DetalleHistorialService,
    private _doctorService: DoctorService,
    private _pacienteService: PacienteService,
    private _historialService: HistorialService,
  ) {

  }

  @Post('crear-detalle-historial/:idPaciente')
  async crearUnDetalleHistorial(
    @Body() detalleHistorial: DetalleHistorialEntity,
    @Res() res,
    @Param('idPaciente') idPaciente:string,
    @Body() bodyParams,
  ): Promise<void> {
    try {
      console.log(idPaciente);
      const tieneHistorial =  await this.encontrarHistorialPaciente(+idPaciente);
      if(tieneHistorial != undefined){
        const datosCreacion = await this.validarDatosCreacionDetalle(+bodyParams.idDoctor, detalleHistorial, tieneHistorial);
        await this.crearDetalleYRender(datosCreacion.errores,datosCreacion.detalle,+idPaciente,res)
      }else{
        const historialCreado = await this.crearHistorial(+idPaciente);
        const datosCreacion = await this.validarDatosCreacionDetalle(+bodyParams.idDoctor, detalleHistorial, historialCreado);
        await this.crearDetalleYRender(datosCreacion.errores,datosCreacion.detalle,+idPaciente,res)
      }
    } catch (e) {
      console.error(e);
      res.redirect(
        '/detalle/crear-detalle-historial/'+idPaciente+'?error=Error del servidor',
      );
    }

  }

  @Get('crear-detalle-historial/:id')
  rutaCrearDetalleHistorial(
    @Query('error') error: string,
    @Query('mensaje') mensaje: string,
    @Param('id') idPaciente: string,
    @Res() res,
  ) {
    console.log('soy el id paciente en el get: '+ idPaciente);
    res.render('detalle-historial/crear-detalle-historial',
      {
        datos: {
          error,
          mensaje,
          idPaciente,
        },
      },
    );
  }

  @Get('mostrar-detalle-historial/:id')
  async rutaMostrarHistorial(
    @Query('error') error: string,
    @Query('mensaje') mensaje: string,
    @Param('id') idPaciente: string,
    @Res() res,
  ){
    const historial =  await this.encontrarHistorialPaciente(+idPaciente);
    if(historial != undefined){
      const historialConDetalles = await this._historialService.buscarDetallesDeHistorial(historial.id);
      res.render('detalle-historial/mostrar-detalle-historial',
        {
          datos: {
            error,
            mensaje,
            historialConDetalles, // es igual a detalle-historials:detalle-historials
            idPaciente,
          },
        },
      );
    }else{
      const historialConDetalles = new HistorialEntity();
      historialConDetalles.estado ='';
      historialConDetalles.fechaCreacion='';
      historialConDetalles.detalles = [];
      historialConDetalles.id = undefined;
      mensaje = 'El paciente aun no tiene historial medico creado'
      res.render('detalle-historial/mostrar-detalle-historial',
        {
          datos: {
            error,
            mensaje,
            historialConDetalles, // es igual a pacientes:pacientes
          },
        },
      );
    }
  }


  async encontrarHistorialPaciente(idPaciente:number): Promise<HistorialEntity>{
    return await getRepository(HistorialEntity).
      createQueryBuilder('historial')
      .where("historial.pacienteId = :idPaciente", {idPaciente: idPaciente})
      .getOne()
  }

  async crearHistorial(idPaciente:number):Promise<HistorialEntity>{
    const historial = new HistorialEntity();
    historial.fechaCreacion = new Date().toISOString().substring(0,10);
    historial.estado = 'activo';
    historial.paciente = await  this._pacienteService.encontrarUno(idPaciente);
    return  await this._historialService.crearUno(historial);
  }

  async validarDatosCreacionDetalle(idDoctor:number, detalleHistorial: DetalleHistorialEntity,historial:HistorialEntity){
    const detalleHistorialCreateDTO = new DetalleHistorialCreateDto();
    const doctor = await this._doctorService.encontrarUno(idDoctor);
    detalleHistorialCreateDTO.fechaHistorial = detalleHistorial.fechaHistorial;
    detalleHistorialCreateDTO.alergias = detalleHistorial.alergias;
    detalleHistorialCreateDTO.antecedentesFamiliares = detalleHistorial.antecedentesFamiliares;
    detalleHistorialCreateDTO.signosVitales = detalleHistorial.signosVitales;
    detalleHistorialCreateDTO.sintomas = detalleHistorial.sintomas;
    detalleHistorialCreateDTO.diagnostico = detalleHistorial.diagnostico;
    detalleHistorialCreateDTO.medicamentos = detalleHistorial.medicamentos;
    detalleHistorial.doctor = doctor;
    detalleHistorial.historial = historial;
    detalleHistorialCreateDTO.doctor = detalleHistorial.doctor;
    detalleHistorialCreateDTO.historial = detalleHistorial.historial;
    const errores = await validate(detalleHistorialCreateDTO);
    console.log(errores);
    return {
      errores: errores,
      detalle: detalleHistorial,
    }
  }

  async crearDetalleYRender(errores, detalleValidado,idPaciente , res){

      if (errores.length > 0) {
      response.redirect(
        '/detalle/crear-detalle-historial'+idPaciente+'??error=Error validando',
      );
    } else {
      try {
        await this._detalleHistorialService
          .crearUno(
            detalleValidado,
          );
        res.redirect(
          '/detalle/crear-detalle-historial/'+idPaciente+'?mensaje=El detalleHistorial se creó correctamente',
        );
      } catch (error) {
        console.error(error);
        res.redirect(
          '/detalle/crear-detalle-historial/'+idPaciente+'?error=Error del servidor',
        );
      }
    }
  }


}