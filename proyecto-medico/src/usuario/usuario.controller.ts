import { Body, Controller, Post, Res, SetMetadata } from '@nestjs/common';
import { UsuarioEntity } from './usuario.entity';
import { DoctorService } from '../doctor/doctor.service';
import { UsuarioService } from './usuario.service';

@Controller()
export class UsuarioController {
  constructor(
    private readonly _usuarioService: UsuarioService,
  ){

  }

  @Post('crear-usuario')
  @SetMetadata('roles', ['administrador'])
  async crearUsurio(
    @Res() res,
    @Body() BodyParams,
  ){
    try{
      const user = new UsuarioEntity();
      user.nombreDeUsuario = BodyParams.name;
      user.contrasena = BodyParams.pass;
      user.rol = BodyParams.rol;
      await this._usuarioService.crearUno(user);
      res.send('ok')
    }catch (e) {
      res.send('error en el server');
      console.log(e)
    }
  }

}