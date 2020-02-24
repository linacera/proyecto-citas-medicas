import { Body, Controller, Get, Post, Query, Req, Res, Session, SetMetadata, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UsuarioService } from './usuario/usuario.service';
import { UsuarioEntity } from './usuario/usuario.entity';
import { RolesGuard } from './roles.guard';

@Controller()
@UseGuards(RolesGuard)
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
    res.render('./session/login',{
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
  @SetMetadata('roles', ['administrador','paciente','doctor'])
  logout(
    @Session() session,
    @Req() req,
    @Res() res,
  ) {
    session.usuario = undefined;
    req.session.destroy();
    res.redirect('/login?mensaje=Ha cerrado sesion')
  }

  @Get('cambiar-contrasena')
  @SetMetadata('roles', ['administrador','paciente','doctor'])
  cambiarContrasenaView(
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Query('error') error: string,
  ) {
    res.render('./session/cambiar-contrasena',{
        datos: {
          mensaje,
          error
        }
      }

    );
  }

  @Post('cambiar-contrasena')
  @SetMetadata('roles', ['administrador','paciente','doctor'])
  async cambiarContrasena(
    @Body('pass') pass: string,
    @Body('repass') repass: string,
    @Session() session,
    @Res() res,
  ){
    try{
      if(pass === repass){
        const user = await this.usuarioService.encontrarUno(session.usuario.userId);
        user.contrasena = pass;
        await this.usuarioService.actualizarUno(session.usuario.userId,user);
        res.redirect('/cambiar-contrasena?mensaje=La contraseña se cambio con exito');
      }else{
        res.redirect('/cambiar-contrasena?error=Las contraseñas no coinciden');
      }
    }catch (e) {
      res.redirect('/cambiar-contrasena?error=Error del servidor');
    }

  }

}
