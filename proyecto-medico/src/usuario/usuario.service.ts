import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, getRepository, MoreThan, Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { HistorialEntity } from '../historial/historial.entity';
import { DoctorEntity } from '../doctor/doctor.entity';

@Injectable()
export class UsuarioService{

  constructor(
    @InjectRepository(UsuarioEntity) private _repositorioUsuario: Repository<UsuarioEntity>
  ) {
  }

  encontrarUno(id: number): Promise<UsuarioEntity | undefined> {
    return this._repositorioUsuario
      .findOne(id);
  }

  crearUno(usuario: UsuarioEntity) {
    return this._repositorioUsuario
      .save(usuario);
  }

  borrarUno(id: number): Promise<DeleteResult> {
    return this._repositorioUsuario
      .delete(id);
  }

  actualizarUno(
    id: number,
    usuario: UsuarioEntity
  ): Promise<UsuarioEntity> {
    usuario.id = id;
    return this._repositorioUsuario
      .save(usuario); // UPSERT
  }

  buscar(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      id: 'ASC',
    }): Promise<UsuarioEntity[]> {

    // Exactamente el name o LIKE la idCard


    // id sea mayor a 20
    const consultaWhereMoreThan = {
      id: MoreThan(20)
    };

    // id sea igual a x
    const consultaWhereIgual = {
      id: 30
    };

    return this._repositorioUsuario
      .find({
        where: where,
        skip: skip,
        take: take,
        order: order,
      });
  }

  async encontrarPorUsuario(username:string): Promise<UsuarioEntity>{
   return await getRepository(UsuarioEntity).
    createQueryBuilder('usuario')
      .where("usuario.nombreDeUsuario = :username", {username: username})
      .getOne()
  }

  async encontrarDoctor(idUsuario: number) : Promise<UsuarioEntity>{
    return  await this._repositorioUsuario.findOne(
      {
        where: { id: idUsuario }, relations: ['doctor']
      })
  }

  async crearUsuario(nombre:string, apellido:string, role:string): Promise<UsuarioEntity>{
      const user = new UsuarioEntity();
      user.nombreDeUsuario = nombre.substring(0,3).toLowerCase()+'.'+apellido.toLowerCase();
      const mismoUsername = await this.encontrarPorUsuario(user.nombreDeUsuario);
      if(mismoUsername === undefined){
        user.contrasena = '1234';
        user.rol = role;
        await this.crearUno(user);
        return await this.encontrarPorUsuario(user.nombreDeUsuario);
      }else{
        user.nombreDeUsuario = nombre.substring(0,3).toLowerCase()+'.'+apellido.toLowerCase()+'01';
        user.contrasena = '1234';
        user.rol = role;
        await this.crearUno(user);
        return await this.encontrarPorUsuario(user.nombreDeUsuario);
      }
  }





}