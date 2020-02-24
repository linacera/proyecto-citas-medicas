import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Get,
  Res,
  HttpException,
  BadRequestException, Session, Response, Redirect,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppController } from './app.controller';
import { constants } from 'http2';
import * as Http from 'http';
import * as module from 'module';
import * as http from 'http';
import { handleRetry } from '@nestjs/typeorm';
import { response } from 'express';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles: string[] = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      try {
        const currentUserRole = request.session.usuario.roles;
        try {
          if (this.matchRoles(roles, currentUserRole)) {
            console.log('t2');
            return true;
          } else if (currentUserRole[0] === 'paciente') {
            await response.redirect('/paciente/mostrar-mis-citas/'+request.session.usuario.userId+'?error=Ud es un paciente no tiene los permisos suficientes para acceder a este recurso')
          } else if(currentUserRole[0] === 'doctor'){
            await response.redirect('/doctor/mostrar-mis-citas/'+request.session.usuario.userId+'?error=Ud es un doctor, no tiene los permisos suficientes para acceder a este recurso')
          }else if(currentUserRole[0] === 'administrador'){
            await response.redirect('/paciente/mostrar-pacientes/?error=Ud es un administrador, no tiene los permisos suficientes para acceder a este recurso')
          }
        } catch (e) {
          await response.redirect('/login?error=Error del servidor')
        }
      } catch (e) {
        await response.redirect('/login?error=Debe logearse para acceder a esa pantalla')
      }
    }catch (e) {

    }
  }

  matchRoles(roles, currenUserRol): boolean {
      for(const rol of roles){
        if(rol === currenUserRol[0]){
          return true;
        }
      }
      return false;

  }

}



