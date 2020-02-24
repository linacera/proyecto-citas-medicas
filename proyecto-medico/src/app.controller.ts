import { Body, Controller, Get, Post, Query, Req, Res, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { UsuarioService } from './usuario/usuario.service';
import { UsuarioEntity } from './usuario/usuario.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private usuarioService: UsuarioService,) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('login')
  login(
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Query('error') error: string,
  ) {
    res.render('./login/login',{
        datos: {
          mensaje,
          error
        }
      }

    );
  }

  @Post('login')
  async authenticate(
    @Body('username') username: string,
    @Body('password') password: string,
    @Session() session,
    @Res() res,
  ) {
    try {
      if (username === '' || password === '') {
        res.redirect('/login?error=No envia credenciales validas')
      }
      const user: UsuarioEntity = await this.usuarioService.encontrarPorUsuario(username);
      if(user != undefined){
        session.usuario = {
          nombre: user.nombreDeUsuario,
          userId: user.id,
          roles: [user.rol],
        };
        if (user.rol === 'doctor'){
          res.redirect('/doctor/mostrar-mis-citas/'+user.id)
        }
        if(user.rol === 'paciente'){
          res.redirect('/paciente/mostrar-mis-citas/'+user.id)
        }
        if(user.rol === 'administrador'){
          res.redirect('/paciente/mostrar-pacientes')
        }
      }else{
        res.redirect('/login?error=El usuario no existe')
      }
    } catch (e) {
      console.log(e);
      res.redirect('/login?error=Error del serrvidor')
    }
  }

  @Get('logout')
  logout(
    @Session() session,
    @Req() req,
    @Res() res,
  ) {
    session.usuario = undefined;
    req.session.destroy();
    res.redirect('/login?mensaje=Ha cerrado sesion')
  }

}
