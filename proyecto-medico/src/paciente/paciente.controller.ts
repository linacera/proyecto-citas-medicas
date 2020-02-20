import { Controller } from '@nestjs/common';
import { PacienteService } from './paciente.service';

@Controller()
export class PacienteController {

  constructor(
    private readonly _pacienteService: PacienteService,
  ){

  }


}