import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, MoreThan, Repository } from 'typeorm';
import { DoctorEntity } from './doctor.entity';

@Injectable()
export class DoctorService{
  constructor(
    @InjectRepository(DoctorEntity) private _repositorioDoctor: Repository<DoctorEntity>
  ) {
  }

  encontrarUno(id: number): Promise<DoctorEntity | undefined> {
    return this._repositorioDoctor
      .findOne(id);
  }

  crearUno(doctor: DoctorEntity) {
    return this._repositorioDoctor
      .save(doctor);
  }

  borrarUno(id: number): Promise<DeleteResult> {
    return this._repositorioDoctor
      .delete(id);
  }

  actualizarUno(
    id: number,
    doctor: DoctorEntity
  ): Promise<DoctorEntity> {
    doctor.id = id;
    return this._repositorioDoctor
      .save(doctor); // UPSERT
  }

  buscar(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      id: 'ASC',
    }): Promise<DoctorEntity[]> {

        // Exactamente el name o LIKE la idCard


    // id sea mayor a 20
    const consultaWhereMoreThan = {
      id: MoreThan(20)
    };

    // id sea igual a x
    const consultaWhereIgual = {
      id: 30
    };

    return this._repositorioDoctor
      .find({
        where: where,
        skip: skip,
        take: take,
        order: order,
      });
  }


}
