import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { DeleteResult, MoreThan, Repository } from 'typeorm';
import { DoctorEntity } from '../doctor/doctor.entity';

@Injectable()

export class PacienteService{

  constructor(
    @InjectRepository(PacienteEntity) private _repositorioPaciente: Repository<PacienteEntity>
  ) {
  }

  encontrarUno(id: number): Promise<PacienteEntity | undefined> {
    return this._repositorioPaciente
      .findOne(id);
  }

  crearUno(paciente: PacienteEntity) {
    return this._repositorioPaciente
      .save(paciente);
  }

  borrarUno(id: number): Promise<DeleteResult> {
    return this._repositorioPaciente
      .delete(id);
  }

  actualizarUno(
    id: number,
    paciente: PacienteEntity
  ): Promise<PacienteEntity> {
    paciente.id = id;
    return this._repositorioPaciente
      .save(paciente); // UPSERT
  }

  buscar(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      id: 'ASC',
    }): Promise<PacienteEntity[]> {

    // Exactamente el name o LIKE la idCard


    // id sea mayor a 20
    const consultaWhereMoreThan = {
      id: MoreThan(20)
    };

    // id sea igual a x
    const consultaWhereIgual = {
      id: 30
    };

    return this._repositorioPaciente
      .find({
        where: where,
        skip: skip,
        take: take,
        order: order,
      });
  }

}
