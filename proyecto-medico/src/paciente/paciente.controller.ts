import { Controller, Get } from '@nestjs/common';
import { PacienteService } from './paciente.service';

@Controller('paciente')
export class PacienteController {

  constructor(
    private readonly _pacienteService: PacienteService,
  ){}

  @Get('holi')
  holi(){
    console.log('holi paciente')
  }


}