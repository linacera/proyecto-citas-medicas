import { Controller } from '@nestjs/common';
import { CitaService } from './cita.service';

@Controller()
export class CitaController {

  constructor(
    private readonly _citaService: CitaService,
  ){

    




  }

}
