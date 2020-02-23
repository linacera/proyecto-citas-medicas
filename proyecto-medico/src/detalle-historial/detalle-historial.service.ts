import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleHistorialEntity } from './detalle-historial.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class DetalleHistorialService {

  constructor(
    @InjectRepository(DetalleHistorialEntity) private _repositorioDetalleHistorial: Repository<DetalleHistorialEntity>
  ) {

  }

  encontrarUno(id: number): Promise<DetalleHistorialEntity | undefined> {
    return this._repositorioDetalleHistorial
      .findOne(id);
  }

  crearUno(detalle: DetalleHistorialEntity) {
    return this._repositorioDetalleHistorial
      .save(detalle);
  }

  borrarUno(id: number): Promise<DeleteResult> {
    return this._repositorioDetalleHistorial
      .delete(id);
  }

  actualizarUno(
    id: number,
    detalle: DetalleHistorialEntity
  ): Promise<DetalleHistorialEntity> {
    detalle.id = id;
    return this._repositorioDetalleHistorial
      .save(detalle); // UPSERT
  }

  buscar(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      id: 'ASC',
    }): Promise<DetalleHistorialEntity[]> {

    return this._repositorioDetalleHistorial
      .find({
        where: where,
        skip: skip,
        take: take,
        order: order,
      });
  }

}