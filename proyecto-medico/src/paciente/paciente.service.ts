import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { DeleteResult, Repository } from 'typeorm';

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

}