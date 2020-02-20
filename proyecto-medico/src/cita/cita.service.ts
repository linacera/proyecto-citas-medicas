import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CitaEntity } from './cita.entity';

@Injectable()
export class CitaService{
  constructor(
    @InjectRepository(CitaEntity) private _repositorioCita: Repository<CitaEntity>
  ) {

  }

  encontrarUno(id: number): Promise<CitaEntity | undefined> {
    return this._repositorioCita
      .findOne(id);
  }

  crearUno(doctor: CitaEntity) {
    return this._repositorioCita
      .save(doctor);
  }

  borrarUno(id: number): Promise<DeleteResult> {
    return this._repositorioCita
      .delete(id);
  }

  actualizarUno(
    id: number,
    doctor: CitaEntity
  ): Promise<CitaEntity> {
    doctor.id = id;
    return this._repositorioCita
      .save(doctor); // UPSERT
  }

}