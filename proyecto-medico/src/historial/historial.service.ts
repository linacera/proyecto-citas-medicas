import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { HistorialEntity } from './historial.entity';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(HistorialEntity) private _repositorioHistorial: Repository<HistorialEntity>
  ) {

  }

  encontrarUno(id: number): Promise<HistorialEntity | undefined> {
    return this._repositorioHistorial
      .findOne(id);
  }

  crearUno(historial: HistorialEntity) {
    return this._repositorioHistorial
      .save(historial);
  }

  borrarUno(id: number): Promise<DeleteResult> {
    return this._repositorioHistorial
      .delete(id);
  }

  actualizarUno(
    id: number,
    historial: HistorialEntity
  ): Promise<HistorialEntity> {
    historial.id = id;
    return this._repositorioHistorial
      .save(historial); // UPSERT
  }

  buscar(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      id: 'ASC',
    }): Promise<HistorialEntity[]> {

    return this._repositorioHistorial
      .find({
        where: where,
        skip: skip,
        take: take,
        order: order,
      });
  }

}
